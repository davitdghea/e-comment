const router = require("express").Router()
const ctrls = require("../Controlllers/Chat")
const { verifileAccessToken, isAdmin } = require("../Anthi/Virifiletoken")

router.get('/messageOne', [verifileAccessToken], ctrls.getMessageOne)
router.get("/", [verifileAccessToken, isAdmin], ctrls.getMessages)  
router.put("/", [verifileAccessToken, isAdmin], ctrls.updateMessage)



module.exports = router