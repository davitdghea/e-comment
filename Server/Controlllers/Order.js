
const Order = require("../Models/Order")
const User = require('../Models/Users')
const Coupon = require('../Models/Coupon')
const asyncHandler = require('express-async-handler')


const NewOrder = asyncHandler(async(req,res)=>{
    const{ _id} = req.user
    const {products,total,address,status} = req.body
    if(address){
        await User.findByIdAndUpdate(_id, { address,cart: [] })
    }
    const data = {products,total,postedBy:_id,}
    if(status) data.status = status
    const rs = await Order.create(data)
   return res.json({
        success:rs ? true :false,
        Order:rs ? rs:"something went wrong",
        
    })
})
const updateStatus = asyncHandler(async(req,res)=>{
    const{ oid} = req.params
    const { status} = req.body
    if(!status) throw new Error('missing status')
        const response = await Order.findByIdAndUpdate(oid, {status},{new:true})
   return res.json({
        success:response ? true :false,
        Order:response ? response:"something went wrong",   
    })
})
// const getUserOrder = asyncHandler(async(req,res)=>{
//     const{ oid} = req.user
//         const response = await Order.find({orderBy: oid})
//    return res.json({
//         success:response ? true :false,
//         Order:response ? response:"something went wrong",   
//     })
// })
const getUserOrder = asyncHandler(async(req,res)=>{
    const queries = { ...req.query };
    const {_id} = req.user
    //tách các trường đặc biệt ra khỏi query
    const excludeFilds = ['limit', 'sort', 'page', 'fields']
    excludeFilds.forEach(el => delete queries[el])

    //format lại các operators cho dúng cú pháp mong gose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)
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
    const q = { ...formatedQueries, orderBy:_id }
    let queryCommand = Order.find(q)
    // sắp xếp 
    // abc,efg =>[abc,efg]=>abc efg

    if (req.query?.sort) {
        const sortBy = req.query.sort.split(',').join(' ')

        queryCommand = queryCommand.sort(sortBy)
    }
    if (req.query.fields) {

        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    //pagination
    //limit:số object lấy về 1 gọi API
    //skip: 2
    // 1 2 3 ....10
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT || 10
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    // execute query
    //số luộng sp thỏa mán đk
    try {
        const response = await queryCommand;
        const counts = await Order.countDocuments(q);
        return res.status(200).json({
            success: response ? true : false,
            counts,
            orders: response ? response : 'Chưa mua sản phẩm nào',

        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong'
        });
    }
    }
)

const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const { _id } = req.user
    //tách các trường đặc biệt ra khỏi query
    const excludeFilds = ['limit', 'sort', 'page', 'fields']
    excludeFilds.forEach(el => delete queries[el])

    //format lại các operators cho dúng cú pháp mong gose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)
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
    const q = { ...colorQueryObject, ...formatedQueries, ...queryObject, order: _id }
    let queryCommand = Order.find(q)
    // sắp xếp 
    // abc,efg =>[abc,efg]=>abc efg

    if (req.query?.sort) {
        const sortBy = req.query.sort.split(',').join(' ')

        queryCommand = queryCommand.sort(sortBy)
    }
    if (req.query.fields) {

        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    //pagination
    //limit:số object lấy về 1 gọi API
    //skip: 2
    // 1 2 3 ....10
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    // execute query
    //số luộng sp thỏa mán đk
    try {
        const response = await queryCommand;
        const counts = await Product.countDocuments(q);
        return res.status(200).json({
            success: response.length > 0,
            counts,
            orders: response ? response : 'cannot get product',

        })
    } catch (err) {
        throw new Error(err?.message)
    }
})
module.exports ={
   NewOrder,
   getOrders,
   updateStatus,
   getUserOrder,
}