const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require('../nodeMailer');
var path = require('path');
const ejs = require('ejs')



const User = require("../models/user");
const Token = require("../models/token");
// enum
const { TokenType } = require('../helpers/token-type');
// Helper
const CheckHelper = require("../helpers/checkHelper");





exports.logIn = async (req, res, next) => {
  let foundUser;
  var token;
  User.findOne({ where: { uniqueName: req.body.uniqueName } })
    .then(user => {
      // check uniqueName exist
      if (!user) {
        return res.status(400).json({
          message: "Name not Found"
        });
      }
      foundUser = user;
      // user password match ,return promis,
      return bcrypt.compareSync(req.body.password, user.password);
    })
    .then(matched => {
      console.log('========', matched);

      if (!matched) {
        return res.status(400).json({
          message: "Wrong Password"
        });
      }

      if (foundUser.accountStatus == foundUser.rawAttributes.accountStatus.values[1]) {
        return res.status(400).json({
          message: "Your Account is Suspended"
        });
      }

      if (foundUser) {
        // generatomg Token
        token = generateToken(foundUser);

        res.status(200).json({
          token: token
        });
      }

    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: "Log in Failed"
      });
    });
};

exports.signUp = async (req, res, next) => {

  var user;
  var createdUser;
  var jwtToken;
  var tokenInRequest = req.query.checkToken;
  try {




    // check  email
    user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).json({
        message: "Email already in use!"
      });
    }
    // check  unique name
    var nameId = await User.findOne({ where: { uniqueName: req.body.uniqueName } });
    if (nameId) {
      return res.status(400).json({
        message: "Name Already Taken!"
      });
    }

    // if checks pass
    var hash = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    // var hash = await bcrypt.hash(req.body.password, 10);

    // Create User
    createdUser = await User.create({
      email: req.body.email,
      uniqueName: req.body.uniqueName,
      password: hash
    });

    // generate Jwt Token

    jwtToken = generateToken(createdUser);


    // generate Email verification Token

    const emailToken = await generateCryptoToken();

    // save to db

    const userEmailVerifyToken = await Token.create({
      userId: createdUser.Id,
      token: emailToken
    });


    var link = `${apiUrl}/auth/email-verification?verifytoken=${emailToken}&email=${createdUser.email}&checkToken=${tokenInRequest}`;

    ejs.renderFile(path.join(ROOT, '/emails/emailVerify.ejs'),
      { name: createdUser.uniqueName, token: link },
      async (err, str) => {
        try {
          if (err) { throw err }
          else {
            await transporter.sendMail({
              to: createdUser.email,
              subject: 'Email Verification',
              html: str,
              from: 'support@pay2mate.com'
            })
          }
        } catch (error) {
          console.log(error)
        }
      });


  } catch (error) {
    res.status(500).json({ error: error, message: "Registeration Failed" });
  }
  res.status(201).json({ message: "Registered", token: jwtToken });

}



// Email Verification
exports.emailVerification = async (req, res, next) => {

  var user;
  var tokenInRequest = req.query.checkToken;
  var jwtToken;
  var updatedUser;
  try {
    user = await User.findOne({
      where: { email: req.query.email }
    });


    if (user.isVerified) {
      return res.status(202).json({ message: `Email Already Verified` });
    }

    const foundEmailToken = await Token.findOne({
      where: { token: req.query.verifytoken }
    });

    if (foundEmailToken) {
      updatedUser = await user.update({ isVerified: true });
    }

    jwtToken = generateToken(updatedUser);

    // if  token is present in Request.
    if (tokenInRequest != "null") {

      const foundToken = await Token.findOne({ where: { token: tokenInRequest } });

      // if token is not presnt in Table
      if (!foundToken) {
        res.status(400).json({ message: "Check Token Not Valid", data: {} });
      }

      // Token is for is Check Recived
      if (foundToken.tokenType == TokenType.checkRecieve) {
        await CheckHelper.addRecieverInCheck(foundToken, user.Id);

      }

      // Token is for Sender Partner Signature
      if (foundToken.tokenType == TokenType.sndPartnerSign) {
        await CheckHelper.addSenderPartnerInCheck(foundToken, user.Id);
      }

      // Token is for Reciever Partner Signature
      if (foundToken.tokenType == TokenType.recPartnerSign) {
        await CheckHelper.addRecieverPartnerInCheck(foundToken, user.Id);
      }


    }


  } catch (error) {
    res.status(500).json({ message: error });

  }

  //
  res.redirect(`${APPURL}/?email_verified=${jwtToken}`);

  // res.status(201).json({message:`User with ${user.email} has been verified`});



}


// exports.getCurrentUser = async (req, res, next) => {

//   var user;
//   try {
//     user = await User.findAll({
//       attributes: [
//       "Id",
//       "kycStatus"]});
//   }
//   catch (error) {
//     return res.status(500).json({message: "something wrong", error: err});
//   }
//   res.status(200).json({message: "users", data: user})
// }







// Reset Password Request

exports.resetPasswordRequest = async (req, res, next) => {


  try {
    user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).json({
        message: "Email Not Found"
      });
    }


    const token = await generateCryptoToken();

    // user.resetToken = token;
    // user.resetTokenExpire =  Date.now() + 3600000 // 1 hour

    await user.update({
      resetToken: token,
      resetTokenExpire: Date.now() + 3600000 // 1 hour
    });

    // send email



    var link = `${APPURL}/reset-password/${token}`;

    ejs.renderFile(path.join(ROOT, '/emails/resetPassword.ejs'),
      { token: link },
      async (err, str) => {
        try {
          if (err) { throw err }
          else {
            await transporter.sendMail({
              to: req.body.email,
              subject: 'Reset Password Request',
              html: str,
              from: 'support@pay2mate.com'
            })
          }
        } catch (error) {
          console.log(error)
        }
      })

  } catch (error) {
    res.status(500).json({
      message: error
    });
  }

  res.status(200).json({
    message: "Please check your email"
  });


}


// validate reset password token

exports.getresetPassword = async (req, res, next) => {

  const token = req.params.token;
  var user;
  try {
    user = await User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now } });
    if (!user) {
      return res.status(400).json({
        message: "Token hass been expire."
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error
    });
  }

  res.status(200).json({
    message: "",
    data: user.Id
  });

  // res.redirect(`${APPURL}/reset-password/${token}`);


}

// reset password and save new password into db
exports.postresetPassword = async (req, res, next) => {

  var model = req.body;
  var user;
  try {

    user = await User.findOne(
      {
        resterToken: model.token,
        //  resetTokenExpire: {$gt:Date.now},
        Id: model.userId
      });

    if (!user) {
      return res.status(400).json({
        message: "Token hass been expired."
      });
    }

    // if checks pass
    var hash = await bcrypt.hashSync(model.password, bcrypt.genSaltSync(10));
    // var hash = await bcrypt.hash(model.password, 10);

    await user.update({
      password: hash,
      resetToken: null,
      resetTokenExpire: null
    });



  } catch (error) {
    res.status(400).json({
      message: error
    });
  }

  res.status(201).json({
    message: "Password Updated"
  });

}


// chnage Password

exports.changePassword = async (req, res, next) => {

  const model = req.body;
  var user;


  User.findOne({ where: { Id: model.userId } })
    .then(foundUser => {
      // check uniqueName exist
      if (!foundUser) {
        res.status(400).json({
          message: "Name not Found"
        });
      }
      user = foundUser;
      // user password match ,return promise,
      //return bcrypt.compareSync(model.oldPassword, user.password);
    })
    // .then(match => {
    //   if (!match) {
    //    return  res.status(400).json({
    //       message: "Wrong Old Password"
    //     });
    //   }
    //   return bcrypt.hashSync(model.newPassword, bcrypt.genSaltSync(10));
    // })
    .then(hash => {
      var newPassword = bcrypt.hashSync(model.newPassword, bcrypt.genSaltSync(10));
      return user.update({
        password: newPassword
      });
    }).then(user => {
      res.status(200).json({
        message: "Password Changed"
      });
    })
    .catch(err => {
      console.log(err);

      return res.status(500).json({
        message: "something worng"
      });
    });


}



async function generateCryptoToken() {
  const buffer = await new Promise((resolve, reject) => {
    crypto.randomBytes(256, function (ex, buffer) {
      if (ex) {
        reject("error generating token");
      }
      resolve(buffer);
    });
  });
  const token = crypto
    .createHash("sha1")
    .update(buffer)
    .digest("hex");

  console.log(token);
  return token;
}



function generateToken(foundUser) {
  const token = jwt.sign(
    {
      email: foundUser.email,
      uniqueName: foundUser.uniqueName,
      Id: foundUser.Id,
      isAdmin: foundUser.isAdmin,
      isVerified: foundUser.isVerified //email verification
    },
    "DevSecretkey",
    { expiresIn: "24h" }
  );
  return token;
}
