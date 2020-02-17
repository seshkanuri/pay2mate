
const transporter = require('../nodeMailer');
var path = require('path');
const ejs = require('ejs');



exports.checkEmailNotification = async (obj) => {

  try {
    ejs.renderFile(path.join(ROOT, '/emails/check.ejs'),
    {
      message: obj.msg,
      amount: obj.amount,
      token: obj.link
    },
    async (err, str) => {
      try {
        if (err) { throw err }
        else {
          await transporter.sendMail({
            to: obj.userEmail,
            subject: obj.subject,
            html: str,
            from: 'support@pay2mate.com'
          })
        }
      } catch (error) {
        console.log(error)
      }

    });
  } catch (error) {
    console.log(error);
  }

}

