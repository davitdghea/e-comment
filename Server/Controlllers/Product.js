const Product = require('../Models/Product')
const slugify = require('slugify')
const ansyncHandler = require('express-async-handler')
const makeSKU = require('uniqid')
const creatProduct = ansyncHandler(async (req, res) => {
    const { title, price, description, brand, category, color } = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images.map(el => el.path)
    if (!(title && price && description && brand && category && color)) throw new Error('miss input')
    req.body.slug = slugify(title)
    if (thumb) req.body.thumb = thumb
    if (images) req.body.images = images
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? 'created' : 'Failed.'

    })
})
const getProduct = ansyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: "postedBy",
            select: 'firstname lastname avatar'
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        ProductData: product ? product : 'canot get product'
    })
})
// Filtering,sorting & pagination
const getProducts = ansyncHandler(async (req, res) => {
    const queries = { ...req.query };
    //tách các trường đặc biệt ra khỏi query
    const excludeFilds = ['limit', 'sort', 'page', 'fields']
    excludeFilds.forEach(el => delete queries[el])

    //format lại các operators cho dúng cú pháp mong gose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)
    let colorQueryObject = {}
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    if (queries?.brand) formatedQueries.brand = { $regex: queries.brand, $options: 'i' }
    if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
    if (queries?.color) {
        delete formatedQueries.color
        const colorArr = queries.color?.split(',')
        const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }))
        colorQueryObject = { $or: colorQuery }
    }
    let queryObject = {}
    if (queries?.q) {
        delete formatedQueries.q
        queryObject = {
            $or: [
                { color: { $regex: queries.q, $options: 'i' } },
                { title: { $regex: queries.q, $options: 'i' } },
                { category: { $regex: queries.q, $options: 'i' } },
                { brand: { $regex: queries.q, $options: 'i' } },
                // { description: { $regex: queries.q, $options: 'i' } }
            ]
        }
    }
    const q = { ...colorQueryObject, ...formatedQueries, ...queryObject }
    let queryCommand = Product.find(q)
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
            producData: response.length > 0 ? response : 'cannot get product',

        })
    } catch (err) {
        throw new Error(err?.message)
    }
})
const UpdateProducts = ansyncHandler(async (req, res) => {
    const { pid } = req.params
    const files = req?.files
    if (files?.thumb) req.body.thumb = files?.thumb[0].path
    if (files?.images) req.body.images = files?.images?.map(el => el.path)
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProducts = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updateProducts ? true : false,
        mes: updateProducts ? 'Update.' : 'Cannot get products'
    })
})
const DeleteProducts = ansyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduc = await Product.findByIdAndDelete(pid, req.body, { new: true })
    return res.status(200).json({
        success: deletedProduc ? true : false,
        mes: deletedProduc ? 'Delete Product' : 'cannot deleteProduct products'
    })
})
const ratings = ansyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid, updatedAt } = req.body

    if (!star || !pid) throw new Error("missing inputs")
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)

    if (alreadyRating) {
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.updatedAt": updatedAt }
        }, { new: true })
    } else {
        // add Star & comment
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id, updatedAt } }
        }, { new: true })
    }
    //sum ratings
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    if (ratingCount === 0) {
        updatedProduct.totalRatings = 0
    }
    else {
        const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + (+el.star || 0), 0);
        updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10;
    }
    await updatedProduct.save()
    return res.status(200).json({
        success: true,
        updatedProduct
    })
})
const uploadImagesProduct = ansyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) throw new Error('mising input')
    const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedProduct: response ? response : "sai rồi"
    })
})
const addVariant = ansyncHandler(async (req, res) => {
    const { pid } = req.params
    const { title, price, color } = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images.map(el => el.path)
    if (!(title && price && color)) throw new Error('miss input')
    const response = await Product.findByIdAndDelete(pid, { $push: { variants: { color, price, title, thumb, images, sku: makeSKU().toUpperCase() } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'add variants ok' : "sai rồi"
    })
})
module.exports = {
    addVariant,
    ratings,
    uploadImagesProduct,
    getProducts,
    DeleteProducts,
    getProduct,
    creatProduct,
    UpdateProducts
}