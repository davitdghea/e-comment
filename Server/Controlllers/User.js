const User = require("../Models/Users")
const { generatAccessToken, generateReAccessToken } = require("../Anthi/jdt")
const asyncHend = require("express-async-handler")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const sendMail = require("../Anthi/sendMail")
const makeToken = require("uniqid")
const paypal = require('@paypal/payouts-sdk');
const { default: mongoose } = require("mongoose")

const register = asyncHend(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !lastname || !firstname)
       { return res.status(400).json({
            success: false,
            mes: "Missing inputs"
        })}
    const user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({
            success: false,
            mes: "User has existed"
        })
    }
    else {
        const token = makeToken()
        const emailEdited = btoa(email) + '@' + token
        const newUser = await User.create({
            email: emailEdited, password, firstname, lastname, money: 0
        })
        if (newUser) {
            const html = `<h2>REGISTER Code:</h2><br/><Blockquote>${token}</Blockquote>`
            await sendMail({ email, html, subject: "config, register acccount in digital word" })
        }
        setTimeout(async () => {
            try {
                await User.deleteOne({ email: emailEdited })
                console.log(`User with email ${emailEdited} has been deleted`)
            } catch (error) {
                console.error('Failed to delete user:', error)
            }
        }, 180000)
        return res.json({
            success: newUser ? true : false,
            mes: newUser ? "please check your email to action account" : "some went wrong, please try later"
        })
    }
})
const finalRegister = asyncHend(async (req, res) => {
    // const cookie = req.cookies
    const { token } = req.params
    const notActiveEmail = await User.findOne({
        email: new RegExp(`${token}$`)
    })
    if (notActiveEmail) {
        notActiveEmail.email = atob(notActiveEmail.email.split('@')[0])
        notActiveEmail.save()
    }
    return res.json({
        success: notActiveEmail ? true : false,
        mes: notActiveEmail ? 'Register is SuccessFully. Please go login' : "some went wrong, please try later"
    })
})
const login = asyncHend(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: "missing inputs",
        })
    const response = await User.findOne({ email })
    if (!response) {
        return res.status(400).json({
            mes: "User không tồn tại",
        });
    }
    if (response && await response.isCorrectPassword(password)) {
        // tách pass và role ra khỏi répos

        const { password, role, refreshToken, ...userData } = response.toObject()
        // tạo access token
        const accessToken = generatAccessToken(response._id, role)
        // tạo refresh token 
        const refreshTokennew = generateReAccessToken(response._id)
        //lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: refreshTokennew }, { new: true })
        //lưu refr vào cookie httpOnly: true,
        res.cookie("refreshToken", refreshTokennew, {  maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        res.status(400).json({
            success: false,
            mes: "mk không đúng",
        })
    }
})

const getone = asyncHend(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id)
    .select("-refreshToken -password")
    .populate({
        path: 'cart',
        // populate:{
        //     path:'product',
            select: 'title thumb price'
        //}
        
    }).populate(
        {
            path: 'wishList',
            select: 'title thumb price color',})
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : "user not found"
    })
})
const refreshTokenAcc = asyncHend(async (req, res) => {
    //lấy token từ cookies
    const cookie = req.cookies
    //check có token ko 
    if (!cookie && !cookie.refreshToken) throw new Error("no refresh token in cookies")
    //check token có họp lệ ko
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generatAccessToken(response._id, response.role) : "refresh token not matched"
    })
})
const logout = asyncHend(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error("No refresh token in cookies")
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: "" }, { new: true })
    // xóa refresh token ơ trinh duyệt
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: "logout is done"
    })
})

const forgotPassword = asyncHend(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing Email')
    const user = await User.findOne({ email })
    if (!user) throw new Error("user not found")
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `vui lòng click me. me hết hạn sau 5p khi mail đc gửi. <a href=${process.env.CLIEN_URL}/reset-password/${resetToken}>Click-here</a>`
    const data = {
        email,
        html,
        subject: "Forgot password"
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        mes: "vui lòng check mail của bạn"
    })
})
const resetPassword = asyncHend(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error("missing input")
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error("invalid reset token")
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAT = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mess: user ? "update password" : "something went wrong"
    })
})
const getUsers = asyncHend(async (req, res) => {
    const queries = { ...req.query };
    //tách các trường đặc biệt ra khỏi query
    const excludeFilds = ['limit', 'sort', 'page', 'fields']
    excludeFilds.forEach(el => delete queries[el])

    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)


    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' }
    // const query = {}
    // if (req.query.q) {
    //    query = {$or:[
    //     {name:{$regex:req.query.q,$options:'i'}},
    //     {email:{$regex:req.query.q,$options:'i'}}
    //    ]}
    // }
    if (req.query.q) {
        delete formatedQueries.q
        formatedQueries['$or'] =
            [
                { firstname: { $regex: req.query.q, $options: 'i' } },
                { lastname: { $regex: req.query.q, $options: 'i' } },
                { email: { $regex: req.query.q, $options: 'i' } }
            ]
    }

    let queryCommand = User.find(formatedQueries)


    if (req.query?.sort) {
        const sortBy = req.query.sort.split(',').join(' ')

        queryCommand = queryCommand.sort(sortBy)
    }
    if (req.query.fields) {

        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    // execute query
    //số luộng sp thỏa mán đk
    try {
        const response = await queryCommand;
        const counts = await User.countDocuments(formatedQueries);
        return res.status(200).json({
            success: response.length > 0,
            counts,
            producData: response.length > 0 ? response : 'cannot get product',

        })
    } catch (err) {
        throw new Error(err?.message)
    }
})

const deleteUsers = asyncHend(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `user with email ${response.email} delete` : 'no user delete'
    })
})
const UpdateUsers = asyncHend(async (req, res) => {
    const { _id } = req.user
    const { firstname, lastname,  mobile, address,money } = req.body
    const data = { firstname, lastname, mobile, address, money }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error("missing input")
    const response = await User.findByIdAndUpdate(_id, data, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'no update'
    })
})
const Updatebyadmin = asyncHend(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error("missing input")
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        Updatebyadmin: response ? response : 'no update'
    })
})
const UpdateUserAddress = asyncHend(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('missing inputs')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        Updatebyadmin: response ? response : 'no update'
    })
})
const UpdateCart = asyncHend(async (req, res) => {
    const { _id } = req.user;
    const { sol, pid, quantity = 1, color, price, thumb, title, updateQuantity } = req.body;
    if (updateQuantity) {
        const user = await User.findById(_id).select('cart');
        const productIndex = user?.cart?.findIndex(el => el.product.toString() === pid && el.color === color);

        if (productIndex !== -1) {
            // Tìm thấy sản phẩm, thay thế quantity bằng giá trị mới
            user.cart[productIndex].quantity = quantity; // Thay số lượng hiện tại bằng số lượng mới

            // Lưu lại thay đổi
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'Update successful'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Product not found in cart'
            });
        }
    }


    if (!pid || !quantity) throw new Error('missing inputs');

    const user = await User.findById(_id).select('cart');
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color);

    // Nếu sản phẩm đã có trong giỏ hàng
    if (alreadyProduct) {
        const currentQuantity = alreadyProduct.quantity; // Số lượng hiện tại trong giỏ hàng
        const totalQuantity = currentQuantity + quantity; // Tổng số lượng sau khi thêm

        // Kiểm tra nếu tổng số lượng vượt quá kho
        if (totalQuantity > sol) {
            return res.status(400).json({
                success: false,
                message: 'Total quantity exceeds available stock'
            });
        }

        const response = await User.updateOne(
            { cart: { $elemMatch: alreadyProduct } },
            {
                $inc: { 'cart.$.quantity': quantity },
                $set: {
                    'cart.$.price': price,
                    'cart.$.thumb': thumb,
                    'cart.$.title': title,
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Update success' : 'No update'
        });
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng
        if (quantity > sol) {
            return res.status(400).json({
                success: false,
                message: 'Quantity exceeds available stock'
            });
        }

        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { cart: { product: pid, quantity, color, price, thumb, title } } },
            { new: true }
        );

        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Added to cart' : 'No update'
        });
    }
});

const removeProductInCart = asyncHend(async (req, res) => {
    const { _id } = req.user
    const { pid, color } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart.find(el => el.product.toString() === pid && el.color === color)
    if (!alreadyProduct) return res.status(200).json({
        success: true,
        MessageChannel: 'Updated your cart'
    })
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid, color } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        MessageChannel: response ? 'update your cart' : 'no update'
    })
})


const updateWishList = asyncHend(async (req, res) => {
    const { pid, thumb, title, category,price,color } = req.body
    const { _id } = req.user

    // Tìm người dùng
    const user = await User.findById(_id)

    // Kiểm tra nếu wishlist tồn tại và không rỗng
    const alreadyInWishlist = user.wishList?.find(el => el.pid && el.pid.toString() === pid)

    if (alreadyInWishlist) {
        // Nếu sản phẩm đã có trong danh sách, thì xoá nó
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishList: { pid: pid } } }, // Chỉ khớp pid để xoá
            { new: true }
        )
        return res.json({
            success: !!response,
            tem: response, // Trả về danh sách cập nhật
            rs: response ? 'Đã xoá khỏi danh sách yêu thích' : 'Không thể cập nhật danh sách yêu thích',
        })
    } else {
        // Nếu sản phẩm chưa có trong danh sách, thì thêm vào
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishList: { pid: pid, thumb, title, category, price, color } } }, // Thêm đầy đủ thông tin sản phẩm
            { new: true }
        )
        return res.status(200).json({
            success: !!response,
            tem: response, // Trả về danh sách cập nhật
            rs: response ? 'Đã thêm vào danh sách yêu thích' : 'Không thể cập nhật danh sách yêu thích',
        })
    }
})


const UpdateMoney = asyncHend(async (req, res) => {
    const { _id } = req.user;
    const { nap, rut } = req.body;

    try {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { history: { nap, rut } } },
            { new: true }
        );

        if (response) {
            const totalNap = response.history.reduce((acc, transaction) => {
                return acc + (transaction.nap || 0);
            }, 0);
            const totalRut = response.history.reduce((acc, transaction) => {
                return acc + (transaction.rut || 0);
            }, 0);
            response.money = totalNap - totalRut;
            await response.save();

            return res.status(200).json({
                success: true,
                message: 'Updated your cart and money',
                money: response.money,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No update',
            });
        }
    } catch (error) {
        console.error('Error updating money:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});

const createPayout = asyncHend(async ( req,res) => {
    const environment = new paypal.core.SandboxEnvironment('AdET-ar8Aqq7_4VMR07z4N3pIrrK-6QtSgbsPPsZZhFAHXsjm73rtrtQJTsA7wB7b6UORjcU-n0ELaNJ', 'EIo0rKPPDtm6bD7vn2Rj8RMkDs7w5T3j6w7yp9BvBWEjdU-3Q51n0Ma0bPSUhkx-AZsByDIzPWac-BfV');
    const client = new paypal.core.PayPalHttpClient(environment);
    const { emailPayPal, amount, money } = req.body
    const { _id } = req.user;
    const DO = Math.round(amount / 25350 )
    const request = new paypal.payouts.PayoutsPostRequest();

    // Định cấu hình nội dung cho Payout
    request.requestBody({
        sender_batch_header: {
            sender_batch_id: `Payout-${Math.random().toString(36).substring(7)}`,
            email_subject: "Bạn đã nhận được tiền từ cửa hàng của chúng tôi!",
        },
        items: [{
            recipient_type: "EMAIL",
            amount: {
                value: DO,
                currency: "USD"
            },
            receiver: emailPayPal,  // Email PayPal của người dùng
            note: "Cảm ơn bạn đã sử dụng dịch vụ!",
            sender_item_id: `Item-${Math.random().toString(36).substring(7)}`
        }]
    });

    try {
        const response = await client.execute(request);
        if (response){
            const response = await User.findByIdAndUpdate(
                _id,
                { $push: { history: { rut: amount } },
                  $set: { money: money - amount }
                },
                { new: true }
            );
            if (response) { 
                await response.save();
                return res.status(200).json({
                    success: true,
                    message: 'Updated your cart and money',
                    money: response.money,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'No update',
                });
            }
        }
    } catch (err) {
        console.error("Lỗi khi thực hiện payout:", err);
        throw err;
    }
})

module.exports = {
    createPayout,
    UpdateMoney,
    updateWishList,
    removeProductInCart,
    finalRegister,
    UpdateUserAddress,
    Updatebyadmin,
    UpdateUsers,
    deleteUsers,
    getUsers,
    resetPassword,
    forgotPassword,
    register,
    login,
    getone,
    refreshTokenAcc,
    logout, UpdateCart

}
