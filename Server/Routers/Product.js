const router = require("express").Router()
const ctrls = require("../Controlllers/Product")
const {verifileAccessToken, isAdmin} = require("../Anthi/virifiletoken")
const uploader = require('../Config/Cloudinary.config')


router.post("/",[verifileAccessToken, isAdmin],uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: "thumb", maxCount:1   }
]), ctrls.creatProduct)
router.get("/", ctrls.getProducts)
router.put("/ratings",[verifileAccessToken], ctrls.ratings)
router.put("/:pid", [verifileAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: "thumb", maxCount: 1 }
]), ctrls.UpdateProducts)
router.delete("/:pid",[verifileAccessToken, isAdmin], ctrls.DeleteProducts)
router.get("/:pid", ctrls.getProduct)
router.put("/uploadimage/:pid",[verifileAccessToken, isAdmin],uploader.array('images',10), ctrls.uploadImagesProduct)
router.put('/variant/:pid', [verifileAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 10 },
    { name: "thumb", maxCount: 1 }
]), ctrls.addVariant) 
module.exports = router