const router = require("express").Router()
const ctrls = require("../Controlllers/User")
const {verifileAccessToken, isAdmin} = require("../Anthi/Virifiletoken")
const uploader = require('../Config/Cloudinary.config')


router.post("/register", ctrls.register)
router.put("/finalregister/:token", ctrls.finalRegister)
router.post("/login",ctrls.login)
router.post("/refreshtoken",ctrls.refreshTokenAcc)
router.get("/logout", ctrls.logout)
router.put("/resetpassword", ctrls.resetPassword)
router.post("/forgotpassword",ctrls.forgotPassword)
router.get('/current', verifileAccessToken, ctrls.getone)
router.put("/cart",[verifileAccessToken],ctrls.UpdateCart)
router.put("/wishlist", [verifileAccessToken], ctrls.updateWishList)
router.delete("/remote_cart/:pid/:color", [verifileAccessToken], ctrls.removeProductInCart)
router.put("/address",[verifileAccessToken],ctrls.UpdateUserAddress)
router.put("/update/money", verifileAccessToken, ctrls.UpdateMoney)
router.post("/payouts", [verifileAccessToken], ctrls.createPayout)
router.put("/update", verifileAccessToken, uploader.single('avatar'),ctrls.UpdateUsers)
router.get("/", [verifileAccessToken, isAdmin], ctrls.getUsers)
router.put("/:uid",[verifileAccessToken,isAdmin],ctrls.Updatebyadmin)
router.delete("/:uid",[verifileAccessToken,isAdmin],ctrls.deleteUsers)


module.exports = router