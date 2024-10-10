const router = require('express').Router()
const ctrls = require('../Controlllers/Order')
const {isAdmin,verifileAccessToken} = require("../Anthi/Virifiletoken")




router.post('/',[verifileAccessToken],ctrls.NewOrder)
router.get('/',[verifileAccessToken],ctrls.getUserOrder)
router.put('/status/', [verifileAccessToken, isAdmin], ctrls.updateStatus)
router.get('/admin',[verifileAccessToken,isAdmin],ctrls.getOrders)
module.exports = router