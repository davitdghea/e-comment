
const ProductCategory = require("../Models/ProductCategory")
const asyncHandler = require('express-async-handler')
const createCategory = asyncHandler(async(req,res)=>{
    const response = await ProductCategory.create(req.body)
    return res.json({
        success:response ? true :false,
        creatdCategory:response ? response:"cannot create new product category"

    })
})
const getCreateCategory = asyncHandler(async(req,res)=>{
    const response = await ProductCategory.find()
    return res.json({
        success:response ? true :false,
        creatdCategory:response ? response:"cannot create new product category"

    })
})
const updateCreateCategory = asyncHandler(async(req,res)=>{
    const {bcid}= req.params
    const response = await ProductCategory.findByIdAndUpdate(bcid, req.body,{new:true})
    return res.json({
        success:response ? true :false,
        creatdCategory:response ? response:"cannot create new product category"

    })
})
const deleteCreateCategory = asyncHandler(async(req,res)=>{
    const {bcid}= req.params
    const response = await ProductCategory.findByIdAndDelete(bcid)
    return res.json({
        success:response ? true :false,
        creatdCategory:response ? response:"cannot create new product category"

    })
})
module.exports ={
    deleteCreateCategory,
    updateCreateCategory,
    getCreateCategory,
    createCategory
}