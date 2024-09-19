const router = require('express').Router()
const ctrls = require('../Controlllers/Order')
const {isAdmin,verifileAccessToken} = require("../Anthi/Virifiletoken")



router.put('/status/:oid',[verifileAccessToken,isAdmin],ctrls.updateStatus)
router.post('/',[verifileAccessToken],ctrls.NewOrder)
router.get('/',[verifileAccessToken],ctrls.getUserOrder)
router.get('/admin',[verifileAccessToken,isAdmin],ctrls.getOrders)
module.exports = router