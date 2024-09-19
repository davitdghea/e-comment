
const BlogCategory = require("../Models/BlogCategory")
const asyncHandler = require('express-async-handler')
const NewBlogCategory = asyncHandler(async(req,res)=>{
    const response = await BlogCategory.create(req.body)
    return res.json({
        success:response ? true :false,
        BlogCategory:response ? response:"cannot create new product category"

    })
})
const getBlogCategory = asyncHandler(async(req,res)=>{
    const response = await BlogCategory.find().select('title _id')
    return res.json({
        success:response ? true :false,
        BlogCategory:response ? response:"cannot create new product category"

    })
})
const updateBlogCategory = asyncHandler(async(req,res)=>{
    const {bid}= req.params
    const response = await BlogCategory.findByIdAndUpdate(bid, req.body,{new:true})
    return res.json({
        success:response ? true :false,
        BlogCategory:response ? response:"cannot create new product category"

    })
})
const deleteBlogCategory = asyncHandler(async(req,res)=>{
    const {bid}= req.params
    const response = await BlogCategory.findByIdAndDelete(bid)
    return res.json({
        success:response ? true :false,
        BlogCategory:response ? response:"cannot create new product category"

    })
})
module.exports ={
   deleteBlogCategory,
   updateBlogCategory,
   NewBlogCategory,
   getBlogCategory
}