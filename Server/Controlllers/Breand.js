
const Brand = require("../Models/Breand")
const asyncHandler = require('express-async-handler')


const NewBrand = asyncHandler(async(req,res)=>{
    const response = await Brand.create(req.body)
    return res.json({
        success:response ? true :false,
        Brand:response ? response:"cannot create new product category"

    })
})
const getBrand = asyncHandler(async(req,res)=>{
    const response = await Brand.find().select('title _id')
    return res.json({
        success:response ? true :false,
        Brand:response ? response:"cannot create new product category"

    })
})
const updateBrand = asyncHandler(async(req,res)=>{
    const {bid}= req.params
    const response = await Brand.findByIdAndUpdate(bid, req.body,{new:true})
    return res.json({
        success:response ? true :false,
        Brand:response ? response:"cannot create new product category"

    })
})
const deleteBrand = asyncHandler(async(req,res)=>{
    const {bid}= req.params
    const response = await Brand.findByIdAndDelete(bid)
    return res.json({
        success:response ? true :false,
        Brand:response ? response:"cannot create new product category"

    })
})
module.exports ={
   deleteBrand,
   updateBrand,
   NewBrand,
   getBrand
}