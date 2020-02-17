
const Check = require("../models/check");
const CheckImage = require("../models/check-image");
const CheckBackground = require("../models/check-background");
const Biller = require("../models/reciever");
const Document = require("../models/user-document");
const Token = require("../models/token");


exports.findCheckByCheckNumber = async (checkNumber) => {
  var check;
  try {
       check = await Check.findOne({
          where : {checkNumber: checkNumber}});
  } catch (error) {
      console.log(error);
  }
  return check;

}


exports.addRecieverInCheck = async (foundToken, id) => {

    var check
    try {

        // find Check
         check = await Check.findOne({
            where : {checkId: foundToken.checkId},
        });
        // Update Check with RecieverId
        await  check.update({
            recieverId: id
        });

    } catch (error) {
        console.log(error);
    }
    return check;


}

exports.addRecieverPartnerInCheck = async (foundToken, id) => {

    var check
    try {

        // find Check
        check = await Check.findOne({
            where : {checkId: foundToken.checkId},
        });
        // Update Check with RecieverId
        await  check.update({
            recieverPartnerId: id
        });

    } catch (error) {
        console.log(error);
    }
    return check;

}



exports.addSenderPartnerInCheck = async (foundToken, id) => {

    var check
    try {

        // find Check
        check = await Check.findOne({
            where : {checkId: foundToken.checkId},
        });
        // Update Check with RecieverId
        await  check.update({
            senderPartnerId: id
        });

    } catch (error) {
        console.log(error);
    }
    return check;

}





// all check

exports.unreadRecieveCheck = async (id) => {

    try {
        var check = await Check.findAll({
            where : {recieverId: id, isRecieved: false,  isSignCompleted: true}, // isSignCompleted means Signature Process from Sender

            include: [
                { model: CheckBackground },
                { model: CheckImage }
            ]
        });
    } catch (error) {
        console.log(error);

    }

    return check;

}

// unread check by Id

exports.getCheck = async (id) => {

    var check;
    try {
         check = await Check.findOne({
            where : {checkId: id},

            include: [
                { model: CheckBackground },
                { model: CheckImage },
                { model: Document }
            ]
        });
    } catch (error) {
        console.log(error);

    }
    return check;

}



// all check for signature Requests for sender Partner sign

exports.requestCheckSignatures = async (id) => {

    var check;
    try {
         check = await Check.findAll({
            where : {senderPartnerId: id, isSignCompleted: false}, // isSignCompleted means Signature Process from Sender

            include: [
                { model: CheckBackground },
                { model: CheckImage }
            ]
        });
    } catch (error) {
        console.log(error);

    }

    return check;

}


// check for sender Partner signatures

exports.requestCheckSignatureById = async (id) => {

    var check;
    try {
         check = await Check.findOne({
            where : {checkId: id},

            include: [
                { model: CheckBackground },
                { model: CheckImage }
            ]
        });
    } catch (error) {
        console.log(error);

    }
    return check;
}


//--------------- Reciever Partner Signatutre Request -------------

exports.requestRecieverCheckSignatures = async (id) => {

    var check;
    try {
         check = await Check.findAll({
            where : {recieverPartnerId: id, isRecieverSignCompleted: false}, // isSignCompleted means Signature Process from Sender

            include: [
                { model: CheckBackground },
                { model: CheckImage }
            ]
        });
    } catch (error) {
        console.log(error);

    }

    return check;

}


// ------- check Histoty -----------


exports.allSentChecks = async (id) => {

    var checks;
    try {
         checks = await Check.findAll({
            where : {senderId: id},

            include: [
                { model: CheckImage }
            ]
        });
    } catch (error) {
        console.log(error);

    }

    return checks;

}

exports.allRecievedChecks = async (id) => {

    var checks;
    try {
         checks = await Check.findAll({
            where : {recieverId: id},

            include: [
                { model: CheckImage }
            ]
        });
    } catch (error) {
        console.log(error);

    }

    return checks;

}

// find biller By BillerId


exports.findBiller = async (id) => {

    var biller;
    try {
        biller = await Biller.findOne({
            where : {recieverId: id}
        });
    } catch (error) {
        console.log(error);

    }
    return biller;
}

// documents



exports.addDocuments = async (model) => {

    var doc
    try {

        // creat doc
        doc = await Document.bulkCreate(model);

    } catch (error) {
        console.log(error);
    }
    return doc;
}

exports.getDocuments = async (id) => {

    var docs
    try {

        // creat doc
        docs = await Document.findAll({where: {userId: id}});

    } catch (error) {
        console.log(error);
    }
    return docs;
}

exports.addCheckBackgroundImages = async (model) => {

  var imgs;
  try {

      // add images
      imgs = await CheckBackground.bulkCreate(model);

  } catch (error) {
      console.log(error);
  }
  return imgs;
}



// sender Partner Token

exports.createToken = async (tokenModel) => {

    var createToken;
    try {
         createToken = await Token.create({
            token: tokenModel.token,
            tokenType: tokenModel.tokenType,
            userId: tokenModel.userId,
            checkId : tokenModel.checkId
        });

    } catch (error) {
        console.log(error);
    }
    return createToken;

}









