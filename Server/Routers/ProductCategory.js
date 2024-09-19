const router = require('express').Router()
const ctrls = require('../Controlllers/ProductCategory')
const {verifileAccessToken,isAdmin}= require('../Anthi/Virifiletoken')

router.post('/',[verifileAccessToken,isAdmin], ctrls.createCategory)
router.get('/', ctrls.getCreateCategory)
router.put('/:pcid',[verifileAccessToken,isAdmin], ctrls.updateCreateCategory)
router.delete('/:pcid',[verifileAccessToken,isAdmin], ctrls.deleteCreateCategory)


module.exports = router