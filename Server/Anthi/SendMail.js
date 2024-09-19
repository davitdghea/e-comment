const nodemailer = require('nodemailer')
const asyncHand = require('express-async-handler')
const sendMail = asyncHand(async({email,html,subject}) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_NAME,
            pass:process.env.EMAIL_APP_PASSWORD,
        },
         tls: {
            rejectUnauthorized: false,
        }
    });
    let info = await transporter.sendMail({
        from:'"Cửa hàng" <no-relply@cuahangdientu.com>',
        to:email,
        subject: subject,
        html:html,

    })
   return info
})
module.exports = sendMail