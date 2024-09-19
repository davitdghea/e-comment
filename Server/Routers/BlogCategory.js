const router = require("express").Router()
const ctrls = require("../Controlllers/BlogCategory")
const {verifileAccessToken, isAdmin} = require("../Anthi/Virifiletoken")



router.post("/",[verifileAccessToken, isAdmin], ctrls.NewBlogCategory)
router.get("/", ctrls.getBlogCategory)
router.put("/:bid",[verifileAccessToken, isAdmin], ctrls.updateBlogCategory)
router.delete("/:bid",[verifileAccessToken, isAdmin], ctrls.deleteBlogCategory)


module.exports = router