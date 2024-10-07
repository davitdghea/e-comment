const User = require("../Models/Users")
const { generatAccessToken, generateReAccessToken } = require("../Anthi/jdt")
const asyncHend = require("express-async-handler")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const sendMail = require("../Anthi/sendMail")
const makeToken = require("uniqid")
const { MessageChannel } = require("worker_threads")

const register = asyncHend(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !lastname || !firstname)
        return res.status(400).json({
            success: false,
            mes: "missing inputs"
        })
    const user = await User.findOne({ email })
    if (user) throw new Error("user has existed")
    else {
        const token = makeToken()
        const emailEdited = btoa(email) + '@' + token
        const newUser = await User.create({
            email: emailEdited, password, firstname, lastname
        })
        if (newUser) {
            const html = `<h2>REGISTER Code:</h2><br/><Blockquote>${token}</Blockquote>`
            await sendMail({ email, html, subject: "config, register acccount in digital word" })
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailEdited })
        }, 200000)
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
    const { firstname, lastname,  mobile, address } = req.body
    const data = { firstname, lastname,  mobile, address }
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
    const { _id } = req.user
    const { pid, quantity = 1, color, price, thumb, title } = req.body
    console.log(req.body)
    if (!pid || !quantity) throw new Error('missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, {
            $set: {
                "cart.$.quantity": quantity,
                'cart.$.price': price,
                'cart.$.thumb': thumb,
                'cart.$.title': title,
                'cart.$.color': color
            }
        }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            MessageChannel: response ? 'update success' : 'no update'
        })
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price, thumb,title } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            MessageChannel: response ? 'Update your cart' : 'no update'
        })
    }
}
)
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
    const { pid } = req.body
    const { _id } = req.user
    const user = await User.findById(_id)
    const alreadyInWishlist = user.wishList?.find(el => el.toString() === pid)
    console.log(alreadyInWishlist)
    if (alreadyInWishlist) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishList: pid } },
            { new: true }
        )
        return res.json({
            success: response ? true : false,
            tem: user,
            rs: response ? 'Removed from wishlist' : 'false to update wishlist',
        })
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishList: pid } },
            { new: true }
        )
        console.log(response)
        return res.status(200).json({
            success: response ? true : false,
            tem:pid,
            _id,
            rs: response ? 'updated your wishlist' : 'false to update wishlist',
        })
    }

})

module.exports = {
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
