const router = require('express').Router()
const ctrls = require('../Controlllers/Blog')
const {isAdmin,verifileAccessToken} = require("../Anthi/Virifiletoken")
const uploader = require('../Config/Cloudinary.config')

router.post('/',[verifileAccessToken,isAdmin],ctrls.creatBlog )
router.get('/one/:bid',ctrls.getBlogter )
router.put('/images/:bid',[verifileAccessToken,isAdmin],uploader.single("images"),ctrls.uploadImagesblog )
router.get('/',ctrls.getBlog )
router.put('/delete/:bid',[verifileAccessToken,isAdmin],ctrls.deleteBlog )
router.put('/update/:bid',[verifileAccessToken,isAdmin],ctrls.updateblog )
router.put('/like/:bid',[verifileAccessToken],ctrls.likeBlog )
router.put('/dislike/:bid',[verifileAccessToken],ctrls.dislikeBlog )

module.exports = router