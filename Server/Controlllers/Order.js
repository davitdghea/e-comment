
const Order = require("../Models/Order")
const User = require('../Models/Users')
const Coupon = require('../Models/Coupon')
const asyncHandler = require('express-async-handler');
const Product = require("../Models/Product");

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const NewOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, total, address, status } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ success: false, message: "Products are required and must be an array." });
    }
    if (!total || typeof total !== 'number' || total <= 0) {
        return res.status(400).json({ success: false, message: "Total must be a positive number." });
    }
    if (!address || typeof address !== 'string' || address.trim() === "") {
        return res.status(400).json({ success: false, message: "Address is required and must be a non-empty string." });
    }

    try {
            
            for (const product of products) {
                
                const updatedProduct = await Product.findOneAndUpdate(
                    { _id: product.product }, 
                    { $inc: 
                        { soId: +product.quantity,
                          quantity: -(+product.quantity),
                          
                        } 
                    },    
                    { new: true }  
                );
                
                if (!updatedProduct) {
                    return res.status(400).json({ success: false, message: `Product with ID ${product.product} not found.` });
                }
            }
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const updatedCart = user.cart.filter(cartItem =>
            !products.some(product => product._id.toString() === cartItem._id.toString())
        );    
        user.cart = updatedCart;
        user.address = address;  
        await user.save();
        const lastSixChars = generateRandomString(8);
        const data = { products, address, total, orderBy: _id, deliveryCode: lastSixChars };
        if (status) data.status = status;
        const rs = await Order.create(data);
        if (!rs) {
            throw new Error("Failed to create order.");
        }
        return res.json({
            success: true,
            order: rs
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating the order."
        });
    }
});

const updateStatus = asyncHandler(async(req,res)=>{
    const { status, oid } = req.body
    if(!status) throw new Error('missing status')
    const response = await Order.findByIdAndUpdate(oid, { status },{new:true})
   return res.json({
        success:response ? true :false,
       mes: response ? 'update Status':"something went wrong",   
    })
})
const getUserOrder = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const { _id } = req.user;
    const searchKeyword = queries.q;  

    
    const excludeFilds = ['limit', 'sort', 'page', 'fields', 'q']; 
    excludeFilds.forEach(el => delete queries[el]);


    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    const formatedQueries = JSON.parse(queryString);

   
    const searchCondition = searchKeyword ? {
        $or: [
            { "products.deliveryCode": { $regex: searchKeyword, $options: 'i' } },
            { "products.color": { $regex: searchKeyword, $options: 'i' } },
            { "products.title": { $regex: searchKeyword, $options: 'i' } }
        ]
    } : {};

    
    const q = { ...formatedQueries, orderBy: _id, ...searchCondition };

    let queryCommand = Order.find(q).sort({ createdAt: -1 });

    // Sắp xếp
    if (req.query?.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Lọc các fields
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT || 10;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // Execute query
    try {
        const response = await queryCommand;
        const counts = await Order.countDocuments(q);
        return res.status(200).json({
            success: response ? true : false,
            counts,
            orders: response ? response : 'Chưa mua sản phẩm nào',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong'
        });
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const searchKeyword = queries.q;


    const excludeFilds = ['limit', 'sort', 'page', 'fields', 'q'];
    excludeFilds.forEach(el => delete queries[el]);


    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    const formatedQueries = JSON.parse(queryString);


    const searchCondition = searchKeyword ? {
        $or: [
            { "deliveryCode": { $regex: searchKeyword, $options: 'i' } },
            { "products.color": { $regex: searchKeyword, $options: 'i' } },
            { "products.title": { $regex: searchKeyword, $options: 'i' } }
        ]
    } : {};


    const q = { ...formatedQueries, ...searchCondition };

    let queryCommand = Order.find(q).sort({ createdAt: -1 });

    // Sắp xếp
    if (req.query?.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Lọc các fields
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT || 10;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // Execute query
    try {
        const response = await queryCommand;
        const counts = await Order.countDocuments(q);
        return res.status(200).json({
            success: response ? true : false,
            counts,
            orders: response ? response : 'Chưa mua sản phẩm nào',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong'
        });
    }
});

// const getOrders = asyncHandler(async (req, res) => {
//     const queries = { ...req.query };
//     const { _id } = req.user
//     //tách các trường đặc biệt ra khỏi query
//     const excludeFilds = ['limit', 'sort', 'page', 'fields']
//     excludeFilds.forEach(el => delete queries[el])

//     //format lại các operators cho dúng cú pháp mong gose
//     let queryString = JSON.stringify(queries)
//     queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
//     const formatedQueries = JSON.parse(queryString)
//     // let colorQueryObject = {}
//     // if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
//     // if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
//     // if (queries?.color) {
//     //     delete formatedQueries.color
//     //     const colorArr = queries.color?.split(',')
//     //     const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }))
//     //     colorQueryObject = { $or: colorQuery }
//     // }
//     // let queryObject = {}
//     // if (queries?.q) {
//     //     delete formatedQueries.q
//     //     queryObject = {
//     //         $or: [
//     //             { color: { $regex: queries.q, $options: 'i' } },
//     //             { title: { $regex: queries.q, $options: 'i' } },
//     //             { category: { $regex: queries.q, $options: 'i' } },
//     //             { brand: { $regex: queries.q, $options: 'i' } },
//     //             { description: { $regex: queries.q, $options: 'i' } }
//     //         ]
//     //     }
//     // }
//     const q = {  ...formatedQueries, order: _id }
//     let queryCommand = Order.find(q)
//     // sắp xếp 
//     // abc,efg =>[abc,efg]=>abc efg

//     if (req.query?.sort) {
//         const sortBy = req.query.sort.split(',').join(' ')

//         queryCommand = queryCommand.sort(sortBy)
//     }
//     if (req.query.fields) {

//         const fields = req.query.fields.split(',').join(' ')
//         queryCommand = queryCommand.select(fields)
//     }
//     //pagination
//     //limit:số object lấy về 1 gọi API
//     //skip: 2
//     // 1 2 3 ....10
//     const page = +req.query.page || 1
//     const limit = +req.query.limit || process.env.LIMIT_PRODUCT
//     const skip = (page - 1) * limit
//     queryCommand.skip(skip).limit(limit)
//     // execute query
//     //số luộng sp thỏa mán đk
//     try {
//         const response = await queryCommand;
//         const counts = await Product.countDocuments(q);
//         return res.status(200).json({
//             success: response.length > 0,
//             counts,
//             orders: response ? response : 'cannot get product',

//         })
//     } catch (err) {
//         throw new Error(err?.message)
//     }
// })
module.exports ={
   NewOrder,
   getOrders,
   updateStatus,
   getUserOrder,
}
// let colorQueryObject = {}
// if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
// if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
// if (queries?.color) {
//     delete formatedQueries.color
//     const colorArr = queries.color?.split(',')
//     const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }))
//     colorQueryObject = { $or: colorQuery }
// }
// let queryObject = {}
// if (queries?.q) {
//     delete formatedQueries.q
//     queryObject = {
//         $or: [
//             { color: { $regex: queries.q, $options: 'i' } },
//             { title: { $regex: queries.q, $options: 'i' } },
//             { category: { $regex: queries.q, $options: 'i' } },
//             { brand: { $regex: queries.q, $options: 'i' } },
//             { description: { $regex: queries.q, $options: 'i' } }
//         ]
//     }
// }
// ...queryObject, ...colorQueryObject,