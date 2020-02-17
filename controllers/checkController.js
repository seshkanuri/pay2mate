const crypto = require("crypto");
const Check = require("../models/check");
const CheckImage = require("../models/check-image");
const CheckBackground = require("../models/check-background");
const Token = require("../models/token");
const Signature = require("../models/user-signature");
const transporter = require('../nodeMailer');
var path = require('path');
const ejs = require('ejs');
const Sequelize = require('sequelize');


const Op = Sequelize.Op;



// enum
const { TokenType } = require('../helpers/token-type');

const CheckHelper = require("../helpers/checkHelper");

const userHelper = require("../helpers/userHelper");

const genericHelper = require("../helpers/genericResponse");

const globalHelper = require("../helpers/globalHelper");




// Upload User Docs
exports.uploadDocuments = async (req, res, next) => {

  var userId = req.query.userId;
  var documents;
  var docArrays = [];
  try {

    req.files.forEach(file => {
      var docUrl = genericHelper.getImageUrlFromArray(req, file);

      docArrays.push({
        userId: userId,
        documentName: file.originalname,
        documentUrl: docUrl,
        createdDate: Date.now()
      });
    });

    documents = await CheckHelper.addDocuments(docArrays);


    if (documents.length == 0) {
      res.status(400).json({ messgae: '', data: {} });
    }
  } catch (error) {
    res.status(500).json({ messgae: error, data: {} });

  }
  res.status(201).json({ messgae: 'Uploaded', data: documents });

};


// get Documents


exports.getDocuments = async (req, res, next) => {

  var userId = req.query.userId;
  var documents;
  try {


    documents = await CheckHelper.getDocuments(userId);


    if (!documents) {
      res.status(400).json({ messgae: 'You have no documnets', data: {} });
    }
  } catch (error) {
    res.status(500).json({ messgae: error, data: {} });

  }
  res.status(201).json({ messgae: 'Your Documents', data: documents });

};



exports.checkIssuedNumber = async (req, res, next) => {

  const userId = req.query.userId;
  var check;
  var checknmber;
  try {

    check = await Check.findOne({
      where: { senderId: userId },
      order: [['createdDate', 'DESC']],

    });


    if (!check)
      checknmber = 001;  // assign check number if check is not present
    else
      checknmber = check.checkNumber + 1; //   assign the next number acc to previous



  } catch (error) {
    res.status(500).json({ message: error });
  }


  res.status(200).json({ data: checknmber });


}


exports.getCheckBackgrounds = async (req, res, next) => {

  const userId = req.query.userId;
  var backgroundImages;
  try {

    backgroundImages = await CheckBackground.findAll({
      where: {

        [Op.or]: [{ uploadedByAdmin: true },
        { userId: userId }]
      }
    });


    if (!backgroundImages)
      res.status(200).json({ message: 'No background Used', data: {} });


  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: 'Check Backgrounds', data: backgroundImages });

}

exports.deleteCheckBackground = async (req, res, next) => {

  const checkBackgroundId = req.query.checkBackgroundId;
  try {

    await CheckBackground.destroy({
      where: { checkBackgroundId: checkBackgroundId }
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: 'Deleted', data: {} });

}


//ByAdmin
exports.addCheckBackground = async (req, res, next) => {

  var backgrounds;
  var imgArrays = [];
  try {

    req.files.forEach(file => {
      var url = genericHelper.getImageUrlFromArray(req, file);

      imgArrays.push({
        Image: url,
        uploadedByAdmin: true
      });
    });

    backgrounds = await CheckHelper.addCheckBackgroundImages(imgArrays);


    if (backgrounds.length == 0) {
      res.status(400).json({ messgae: '', data: {} });
    }
  } catch (error) {
    res.status(500).json({ messgae: error, data: {} });
  }
  res.status(201).json({ messgae: 'Uploaded', data: backgrounds });

};



exports.saveCheck = async (req, res, next) => {

  var model = req.body;
  var savedCheck;
  var savedCheckBackground;
  var savedSecondPartnerSign;
  var checkBackgroundId;
  var biller;
  var recieverId;
  var foundReciever;
  var foundSenderPartner;
  var senderPartnerId;
  var senderPartnerSignatureId;
  var signatureCompleted = true; // assume that signature process is complete
  try {

    // see if checIssuedkNumber Is unique
    var foundCheckNumber = await CheckHelper.findCheckByCheckNumber(model.checkNumber);

    if (foundCheckNumber) {
      return res.status(400).json({ message: 'Check number already exists', data: {} })
    }

    // save check Image in Db
    var checkFrontImage = genericHelper.getImageUrlFromArray(req, req.files['checkImage'][0]); // url of image
    var savedCheckImage = await CheckImage.create({
      checkFront: checkFrontImage,
    });

    // uploaded second partner sign by First Partner
    if (model.uploadPartnerSignature != 'false' && model.uploadPartnerSignature != 'undefined') {
      var secondPartnerSign = genericHelper.getImageUrlFromArray(req, req.files['secondSignImage'][0]); // url of image
      savedSecondPartnerSign = await Signature.create({
        signatureImage: secondPartnerSign,
        userId: model.userId
      });
      senderPartnerSignatureId = secondPartnerSign.signatureId;
    }

    // save checkbacground Image into Db

    if (model.checkBackgroundId == 'null') {
      var checkBackgroundImage = genericHelper.getImageUrlFromArray(req, req.files['backgroundImage'][0]); // url of image
      savedCheckBackground = await CheckBackground.create({
        Image: checkBackgroundImage,
        uploadedByAdmin: false,
        userId: model.userId
      });
      checkBackgroundId = savedCheckBackground.checkBackgroundId;
    }
    else {
      checkBackgroundId = model.checkBackgroundId;
    }

    if (checkBackgroundId) {

      // second Sender Partner
      // --->>> if (model.senderPartnerEmail)
      if (model.uploadPartnerSignature != 'true' && model.senderPartnerEmail != undefined) {
        signatureCompleted = false;  // we have to send email to sender Paertner
        foundSenderPartner = await userHelper.getUserByEmail(model.senderPartnerEmail);
      }

      /* ------------------ #### user search in Database #### ----------------------- */

      // Find Biller by BillerId
      biller = await CheckHelper.findBiller(model.billerId);  // biller is list of biller details that users add

      // First Find the reciever in Database
      if (biller) {
        foundReciever = await userHelper.getUserByEmail(biller.recieverEmail);    // this will actual reciever
      }

      if (foundReciever) {
        recieverId = foundReciever.Id; // biller email present as a user in Db
      }

      if (foundSenderPartner) {
        senderPartnerId = foundSenderPartner.Id;
      }



      // ----------save check to db ----------------------
      savedCheck = Check.create({
        checkNumber: model.checkNumber,
        // checkStatus: Check.rawAttributes.checkStatus.values[0], // check Status pending
        createdDate: Date.now(),
        issuedDate: model.issuedDate,
        isSignCompleted: signatureCompleted, // sender sign process
        amount: model.amount,
        checkMemo: model.checkMemo,
        senderAddress: model.senderAddress,
        senderName: model.senderName,
        billerId: model.billerId,  // its biller details for user
        bankAccountId: model.bankAccountId,
        senderId: model.userId,
        recieverId: recieverId,  // if receiver already present in Db
        isRecieved: false,  //  receiver notiifcation
        checkBackgroundId: checkBackgroundId,
        CheckImageId: savedCheckImage.checkImageId,
        senderPartnerId: senderPartnerId,
        senderPartnerSignId: senderPartnerSignatureId, // first save sign into signature table and get Id
        documentId: model.documentId,
        checkStaus: Check.rawAttributes.checkStatus.defaultValue

      });


    }

    /* ------------------  ##### ------------------------- ##### --------------- */
    // if reciever email not present in Db & isSignCompleted true then send token
    // --->>>> foundReciever !=null & sign = true

    if (!foundReciever && signatureCompleted) {
      // generate Token against checkId

      var checkToken = await generateCryptoToken();

      // save token into db

      var createToken = await Token.create({
        token: checkToken,
        tokenType: TokenType.checkRecieve,
        userId: model.userId,
        checkId: savedCheck.checkId
      });

      var link = `${apiUrl}/check/check-recieved?checkToken=${checkToken}`;
      ejs.renderFile(path.join(ROOT, '/emails/check.ejs'),
        {
          message: 'you recieved a check',
          amount: savedCheck.amount,
          token: link
        },
        async (err, str) => {
          try {
            if (err) { throw err }
            else {
              await transporter.sendMail({
                to: biller.recieverEmail,
                subject: 'Check Received',
                html: str,
                from: 'support@pay2mate.com'
              })
            }
          } catch (error) {
            console.log(error)
          }
        });


    }
    else if (foundReciever && signatureCompleted) {
      // reciever email present in Db , send email

      const emailObj = {
        msg: 'You have recieved check. Please click the button to view your check',
        amount: savedCheck.amount,
        link: `${APPURL}recieved-checks`,
        userEmail: biller.recieverEmail,
        subject: 'Check Received'
      }
      await globalHelper.checkEmailNotification(emailObj); // send email to inform user
    }


    /* ------------------  ##### sender Partner Email  ##### --------------- */
    // if senderPartner is not in db and sign is not done on behalf  then send email
    if (senderPartnerId == undefined && model.uploadPartnerSignature != 'true' && model.senderPartnerEmail != undefined) {
      var senderPartnerToken = await generateCryptoToken();

      const tokenModel = {
        token: senderPartnerToken,
        tokenType: TokenType.sndPartnerSign,
        userId: model.userId,
        checkId: savedCheck.checkId,
      }

      var spCreatedToken = await CheckHelper.createToken(tokenModel);

      var link = `${apiUrl}/check/sign/sender-partner?checkToken=${spCreatedToken.token}`;
      ejs.renderFile(path.join(ROOT, '/emails/check.ejs'),
        {
          message: 'Your Partner needs your signature on a check',
          amount: savedCheck.amount,
          token: link
        },
        async (err, str) => {
          try {
            if (err) { throw err }
            else {
              await transporter.sendMail({
                to: model.senderPartnerEmail,
                subject: 'Check Signatory Request',
                html: str,
                from: 'support@pay2mate.com'
              })
            }
          } catch (error) {
            console.log(error)
          }
        });

    } else if (senderPartnerId != undefined && model.senderPartnerEmail != undefined) {
      // sender email present in Db , send email if sign on behalf not done
      if (model.uploadPartnerSignature != 'true') {
        const emailObj = {
          msg: 'Your Partner requires your signature on check. Please click the button to view check',
          amount: savedCheck.amount,
          link: `${APPURL}sender/signature-requests`,
          userEmail: foundSenderPartner.email,
          subject: 'Check Signatory Request'
        }
        await globalHelper.checkEmailNotification(emailObj); // send email to inform user
      }

    }



  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ data: savedCheck });


}


exports.saveCheckBack = async (req, res, next) => {

  var model = req.body;
  var savedCheck;
  var checkDetails;
  var recieverSignatureId;
  var foundRecieverPartner;
  var recieverPartnerId;
  recieverSignatureCompleted = true;  // assume reciever sign is completed

  try {

    var checkImage = await CheckImage.findOne({ where: { checkImageId: model.checkImageId } });

    if (!checkImage) {
      res.status(400).json({ message: 'Not Found', data: {} });
    }

    var checkBackImage = genericHelper.getImageUrlFromArray(req, req.files['checkBackImage'][0]); // url of image

    var savedCheckBackImage = await checkImage.update({
      checkBack: checkBackImage,
    });

    // save checkbacground Image into Db

    if (model.signatureId == 'undefined') {
      var userSignatureImage = genericHelper.getImageUrlFromArray(req, req.files['signImage'][0]); // url of image
      saveduserSignature = await Signature.create({
        signatureImage: userSignatureImage,
        userId: model.userId
      });
      recieverSignatureId = saveduserSignature.signatureId;
    }
    else {
      recieverSignatureId = model.signatureId;
    }


    // update Check
    if (recieverSignatureId) {

      if (model.recieverPartnerEmail != '') {
        recieverSignatureCompleted = false;  // we have to send email to sender Paertner
        foundRecieverPartner = await userHelper.getUserByEmail(model.recieverPartnerEmail);
        if (foundRecieverPartner) {
          recieverPartnerId = foundRecieverPartner.Id;
        }
      }

      checkDetails = await Check.findOne({ where: { checkId: model.checkId } })

      await checkDetails.update({
        checkStatus: checkDetails.rawAttributes.checkStatus.values[1], // recieved check
        recieverSignId: recieverSignatureId,
        recieverPartnerId: recieverPartnerId,
        isRecieverSignCompleted: recieverSignatureCompleted,
        isRecieved: true,
        recieveDate: Date.now(),
      });
    }

    // if reciever not in Db then send mail
    if (!foundRecieverPartner) {

      // generate Token against checkId
      var checkToken = await generateCryptoToken();
      // save token into db
      const tokenModel = {
        token: checkToken,
        tokenType: TokenType.recPartnerSign,
        userId: model.userId,
        checkId: checkDetails.checkId
      }
      var rpCreatedToken = await CheckHelper.createToken(tokenModel);
      const emailObj = {
        msg: `Your Business partner recieve Check
        and Need your signature on the check`,
        amount: checkDetails.amount,
        link: `${apiUrl}/check/sign/reciever-partner?checkToken=${rpCreatedToken.token}`,
        userEmail: model.recieverPartnerEmail,
        subject: 'Check Signatory Request'
      }
      await globalHelper.checkEmailNotification(emailObj); // send email


    } else { // if reciever ind Db just inform him via email

      const emailObj = {
        msg: `Your Business partner recieve Check
        and Need your signature on the check`,
        amount: checkDetails.amount,
        // link: `${APPURL}reciever/signature-requests`,
        link: `${APPURL}dashboard`,
        userEmail: foundRecieverPartner.email,
        subject: 'Check Signatory Request'
      }
      await globalHelper.checkEmailNotification(emailObj); // send email to inform user

    }


  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: '', data: {} });


}


// Save Check with sender Partner sign

exports.saveCheckSenderPartnerSign = async (req, res, next) => {

  var model = req.body;
  var checkDetails;
  var biller;
  var spSignatureId;
  var foundReciever;
  var recieverId;
  try {

    var checkImage = await CheckImage.findOne({ where: { checkImageId: model.checkImageId } });

    if (!checkImage) {
      res.status(400).json({ message: 'Not Found', data: {} });
    }

    var checkAllSignImage = genericHelper.getImageUrlFromArray(req, req.files['checkImage'][0]); // url of image

    var savedCheckFrontImage = await checkImage.update({
      checkFront: checkAllSignImage,
    });

    // save checkbacground Image into Db

    if (model.signatureId == 'undefined') {
      var userSignatureImage = genericHelper.getImageUrlFromArray(req, req.files['signImage'][0]); // url of image
      saveduserSignature = await Signature.create({
        signatureImage: userSignatureImage,
        userId: model.userId
      });
      spSignatureId = saveduserSignature.signatureId;
    }
    else {
      spSignatureId = model.signatureId;
    }

    //check if Biiler Id is present

    biller = await CheckHelper.findBiller(model.billerId);


    if (biller) {
      // find reciever
      foundReciever = await userHelper.getUserByEmail(biller.recieverEmail);
      if (foundReciever) {
        recieverId = foundReciever.Id;
      }

      // update check

      // update Check

      checkDetails = await Check.findOne({ where: { checkId: model.checkId } });

      await checkDetails.update({
        senderPartnerSignId: spSignatureId,
        isSignCompleted: true,
        senderPartnerSignDate: Date.now(),
        recieverId: recieverId
      });

    }


    else {

      // generate Token against checkId

      var checkToken = await generateCryptoToken();

      // save token into db

      const tokenModel = {
        token: checkToken,
        tokenType: TokenType.checkRecieve,
        userId: model.userId,
        checkId: checkDetails.checkId
      }

      var checkCreatedToken = await CheckHelper.createToken(tokenModel);



      // send email to Reciver For check

      //       var sendEmail = await transporter.sendMail({
      //         to: model.recieverEmail,
      //         from: 'echeck@gmail.com',
      //         subject: 'Check Recieved',
      //         html: `<h1>Hi, you have recievd Check </h1>
      //  <a href="${apiUrl}/check/check-recieved?checkToken=${checkCreatedToken}">
      //    View Check
      //  </a> `
      //       });



      var link = `${apiUrl}/check/check-recieved?checkToken=${checkCreatedToken}`;
      ejs.renderFile(path.join(ROOT, '/emails/check.ejs'),
        {
          message: 'you recievd a check',
          amount: savedCheck.amount,
          token: link
        },
        async (err, str) => {
          try {
            if (err) { throw err }
            else {
              await transporter.sendMail({
                to: model.recieverEmail,
                subject: 'Check Received',
                html: str,
                from: 'support@pay2mate.com'
              })
            }
          } catch (error) {
            console.log(error)
          }
        });


    }







  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: '', data: {} });


}


// Save Check with sender Partner sign

exports.saveCheckRecieverPartnerSign = async (req, res, next) => {

  var model = req.body;
  var checkDetails;
  var rpSignatureId;
  try {

    var checkImage = await CheckImage.findOne({ where: { checkImageId: model.checkImageId } });

    if (!checkImage) {
      res.status(400).json({ message: 'Not Found', data: {} });
    }

    // with Both Sign
    var checkBackImage = genericHelper.getImageUrlFromArray(req, req.files['checkBackImage'][0]); // url of image

    var savedCheckFrontImage = await checkImage.update({
      checkBack: checkBackImage,
    });

    // save checkbacground Image into Db

    if (model.signatureId == 'undefined') {
      var userSignatureImage = genericHelper.getImageUrlFromArray(req, req.files['signImage'][0]); // url of image
      saveduserSignature = await Signature.create({
        signatureImage: userSignatureImage,
        userId: model.userId
      });
      rpSignatureId = saveduserSignature.signatureId;
    }
    else {
      rpSignatureId = model.signatureId;
    }


    // update Check
    if (rpSignatureId) {

      checkDetails = await Check.findOne({ where: { checkId: model.checkId } })

      await checkDetails.update({
        recieverPartnerSignId: rpSignatureId,
        isRecieverSignCompleted: true,
      });
    }




  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: '', data: {} });


}




// get Check By Token
exports.checkRecievedVerification = async (req, res, next) => {

  var checkToken = req.query.checkToken;
  var check;

  try {
    const token = await Token.findOne({ where: { token: checkToken } });

    // if token not found then
    if (!token) {
      return res.status(200).json({ message: 'Check Not Found' });
    }

    // if token  found then -> find check
    check = await Check.findOne({ where: { checkId: token.checkId } });


  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.redirect(`${APPURL}/sign-up?checkToken=${checkToken}`);

  // res.status(200).json({message: 'You Recieved a Check', data: check});
}




//  reciever partner sign token verification

exports.checkRecieverPartnerVerify = async (req, res, next) => {

  var checkToken = req.query.checkToken;

  try {
    const token = await Token.findOne({ where: { token: checkToken } });

    // if token not found then
    if (!token) {
      return res.status(200).json({ message: 'Token Not Found' });
    }

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.redirect(`${APPURL}/sign-up?checkToken=${checkToken}`);

}

//  sender partner sign token verification

exports.checkSenderPartnerVerify = async (req, res, next) => {

  var checkToken = req.query.checkToken;

  try {
    const token = await Token.findOne({ where: { token: checkToken } });

    // if token not found then
    if (!token) {
      return res.status(200).json({ message: 'Token Not Found' });
    }

  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.redirect(`${APPURL}/sign-up?checkToken=${checkToken}`);

}


exports.UnreadRecievedCheck = async (req, res, next) => {

  const userId = req.query.userId
  var check;
  try {

    check = await CheckHelper.unreadRecieveCheck(userId);

    if (!check) {
      return res.status(200).json({ message: 'No New Check', data: {} });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: 'Unread Checks', data: check });

}


// ---------------- Sender Check Signatures Request ---------------------



exports.requestCheckSignaturesBySender = async (req, res, next) => {

  const userId = req.query.userId
  var check;
  try {

    check = await CheckHelper.requestCheckSignatures(userId);

    if (!check) {
      return res.status(200).json({ message: 'No New Check', data: {} });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: 'Checks Need your Signature', data: check });

}

exports.requestSenderCheckSignaturById = async (req, res, next) => {

  const checkId = req.query.checkId
  var check;
  try {

    check = await CheckHelper.requestCheckSignatureById(checkId);

    if (!check) {
      return res.status(200).json({ message: 'No Check Found', data: {} });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: 'Check', data: check });

}





// ---------------- Reciever Signatures Request ---------------------



exports.requestCheckSignaturesByReciever = async (req, res, next) => {

  const userId = req.query.userId
  var check;
  try {

    check = await CheckHelper.requestRecieverCheckSignatures(userId);

    if (!check) {
      return res.status(200).json({ message: 'No New Check', data: {} });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: 'Checks Need your Signatures', data: check });

}

exports.requestRecieverCheckSignaturById = async (req, res, next) => {

  const checkId = req.query.checkId
  var check;
  try {

    check = await CheckHelper.requestCheckSignatureById(checkId);

    if (!check) {
      return res.status(200).json({ message: 'No Check Found', data: {} });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: 'Check', data: check });

}


// ----------------- Check History ----------

exports.getAllSentChecks = async (req, res, next) => {


  const userId = req.query.userId
  var checks;
  try {

    checks = await CheckHelper.allSentChecks(userId);

    if (!checks) {
      return res.status(200).json({ message: 'No  Check', data: {} });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: 'checks', data: checks });

}


exports.getAllRecievedChecks = async (req, res, next) => {

  const userId = req.query.userId
  var checks;
  try {

    checks = await CheckHelper.allRecievedChecks(userId);

    if (!checks) {
      return res.status(200).json({ message: 'No Check', data: {} });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: 'all checks', data: checks });


}



exports.getCheckById = async (req, res, next) => {

  const checkId = req.query.checkId
  var check;
  try {

    check = await CheckHelper.getCheck(checkId);

    if (!check) {
      return res.status(200).json({ message: 'No Check Found', data: {} });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: 'Check', data: check });

}





// generate Token


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

// get Uploaded ImagesUrl

// function getImageUrlFromArray(req, file) {

//   const url = req.protocol + '://' + req.get("host");
//   const path = url + '/uploads/' + file.filename;
//   return path;
// }
