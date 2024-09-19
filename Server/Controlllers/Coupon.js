const Coupon = require('../Models/Coupon')
const asyncHandel = require("express-async-handler")

const newCoupon = asyncHandel(async(req,res)=>{
    const  { name, discount, expiry} = req.body
    if(!name || !discount || !expiry) throw new Error("missing inputs")
    const reponse = await Coupon.create({
      ...req.body,
    expiry: Date.now() + +expiry *24 *60 *60 *1000
    })
    return res.json({
        success : reponse ? true : false,
        newCoupon: reponse ? reponse : "canot newCoupon "
    })
})
const getCoupon = asyncHandel(async(req,res)=>{
    const reponse = await Coupon.find().select("-createdAt -updatedAt")
    return res.json({
        success : reponse ? true : false,
        newCoupon: reponse ? reponse : "canot getCoupon "
    })
})
const updateCoupon = asyncHandel(async(req,res)=>{
    const { cid} = req.params
    if(Object.keys(req.body).length === 0) throw new Error("Missing input")
        if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry *24 *60 *60 *1000
    const reponse = await Coupon.findByIdAndUpdate( cid, req.body,{new:true})
    return res.json({
        success : reponse ? true : false,
        newCoupon: reponse ? reponse :"cannot update Coupon"
    })

})
const deleteCoupon = asyncHandel(async(req,res)=>{
    const { cid} = req.params
    const reponse = await Coupon.findByIdAndDelete( cid)
    return res.json({
        success : reponse ? true : false,
        newCoupon: reponse ? reponse :"cannot delete Coupon"
    })
})

module.exports = {
    deleteCoupon,
    updateCoupon,
    newCoupon,
    getCoupon,

}