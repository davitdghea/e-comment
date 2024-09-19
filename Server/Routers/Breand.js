const router = require("express").Router()
const ctrls = require("../Controlllers/Breand")
const {verifileAccessToken, isAdmin} = require("../Anthi/Virifiletoken")



router.post("/",[verifileAccessToken, isAdmin], ctrls.NewBrand)
router.get("/", ctrls.getBrand)
router.put("/:bid",[verifileAccessToken, isAdmin], ctrls.updateBrand)
router.delete("/:bid",[verifileAccessToken, isAdmin], ctrls.deleteBrand)


module.exports = router