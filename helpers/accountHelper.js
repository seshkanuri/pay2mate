
const userHelper = require("../helpers/userHelper");
const User = require("../models/user");
const Document = require("../models/user-document");
const KYC = require("../models/kyc");
const KycType = require("../models/kyc-type");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


exports.kycVerification = async (model, userId) => {

  var docs
  try {

      // add Kyc Documents
      docs = await KYC.bulkCreate(model);

      // update user kyc staus to pending, then admin will see and apprve

      await User.update({
        kycStatus : User.rawAttributes.kycStatus.values[1],
      },
       { where : {Id : userId}}
       );

  } catch (error) {
      console.log(error);
  }
  return docs;
}



exports.getKycTypes = async () => {

  var types;
  try {

    types = await KycType.findAll();


  } catch (error) {
      console.log(error);
      throw new Error(error);
  }
  return types;

}


exports.addKycType = async (model) => {

  try {

      await KycType.create({
        kycType: model.kycType,
        kycTypeDescription: model.kycTypeDescription
      });
  } catch (error) {
      console.log(error);
  }
}

exports.deleteKycType = async (id) => {

  try {

      await KycType.destroy({
        where : {kycTypeId: id}
      });
  } catch (error) {
      console.log(error);
  }
}

exports.deleteDocumentById = async (id) => {

  try {

      await Document.destroy({
        where : {documentId: id}
      });
  } catch (error) {
      console.log(error);
  }
}







exports.kycDocs = async id => {

  var docs;
  try {

    docs = await KYC.findAll({
      where:{userId: id, deleted :  {[Op.not]: true} },
      include: [
        { model: KycType },
    ]
    });


  } catch (error) {
      console.log(error);
      throw new Error(error);
  }
  return docs;

}



exports.updateKycStatus = async (userId) => {

  var user;
  try {
    user = await userHelper.getUserById(userId);
   await user.update({
    trustedUser: true,
    kycStatus: user.rawAttributes.kycStatus.values[2] // kyc Completed
  });


  } catch (error) {
      console.log(error);
      throw new Error(error);
  }
  return user;

}



exports.deleteKycDocumentById = async (kycId) => {

  var user;
  try {
   await KYC.update({
    deleted: true,
  }, {where: { kycId: kycId }});


  } catch (error) {
      console.log(error);
      throw new Error(error);
  }
  return user;

}



