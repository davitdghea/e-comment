const Product = require("../Models/Product")
const ansyncHandler = require('express-async-handler')
const data = require('../../Data/data2.json')
const slugify = require('slugify')
const categoryData = require('../../Data/Cabe_brand')
const Category = require("../Models/ProductCategory")
const fn = async(product) =>{
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random()*1000) + '',
        description:product?.description,
        brand: product?.brand,
        price: Number(product?.price?.match(/\d/g).join("")),
        category:product?.category[1],
        quantity:Math.round(Math.random()*1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find(el => el.label === "Color")?.variants[0] || 'BLACK',
        thumb:product?.thumb,
        totalRatings: 0
    })
}
const insertProduct = ansyncHandler(async(req,res)=>{
         const promises = []
         for (let product of data) promises.push(fn(product))
            await Promise.all(promises)
     return res.status('done')
 })
 const fn2 = async(cate) =>{
    await Category.create({
        title:cate?.cate,
        brand:cate?.brand,
        image:cate?.image
    })
 }
 const insertCategory = ansyncHandler(async(req,res)=>{
    const promises = []
  
    for (let cate of categoryData) promises.push(fn2(cate))
       await Promise.all(promises)
return res.status('done')
})
 module.exports ={
    insertProduct,
    insertCategory,
 }