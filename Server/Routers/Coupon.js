const router = require("express").Router()
const strls = require("../Controlllers/Coupon")
const  {verifileAccessToken,isAdmin} = require("../Anthi/Virifiletoken")

router.post('/',[verifileAccessToken,isAdmin],strls.newCoupon)
router.get('/',strls.getCoupon)
router.put('/:cid',[verifileAccessToken,isAdmin],strls.updateCoupon)
router.delete('/:cid',[verifileAccessToken,isAdmin],strls.deleteCoupon)


module.exports = router