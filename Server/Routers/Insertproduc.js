const router = require('express').Router()
const ctrls = require('../Controlllers/Insateproduc')
router.post('/',ctrls.insertProduct)
router.post('/category',ctrls.insertCategory)
module.exports = router