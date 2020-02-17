

const BankAccountType = require("../models/bankaccount-type");
const BankAccount = require("../models/bank-account");
const Signature = require("../models/user-signature");
const BankLogo = require("../models/bank-logo");
const Bank = require("../models/bank");


exports.bankAccountTypes = async () => {

    var accountTypes;
    try {

        // get types
        accountTypes = await BankAccountType.findAll();

    } catch (error) {
        console.log(error);
    }
    return accountTypes;


}




exports.addBankAccountType = async (model) => {

  try {

      await BankAccountType.create({
        bankaccountType: model.bankaccountType
      });
  } catch (error) {
      console.log(error);
  }
}

exports.deleteBankAccountType = async (id) => {

  try {

      await BankAccountType.destroy({
        where : {bankAccountTypeId: id}
      });
  } catch (error) {
      console.log(error);
  }
}




// get Bank

exports.getBanks = async (id) => {

    var banks;
    try {


        banks = await Bank.findAll({
          include: [
            { model: BankLogo },
        ]
        });

    } catch (error) {
        console.log(error);
    }
    return banks;

}



// bank account by  Id


exports.findBankAccount = async (id) => {

    var bankAccount;
    try {

        // get types
        bankAccount = await BankAccount.findOne({where: {bankAccountId: id}});

    } catch (error) {
        console.log(error);
    }
    return bankAccount;

}

// add bank acount sign

exports.addBankAccountSign = async (signId, accountId) => {

    var bankAccount;
    try {

        // get types
        bankAccount = await BankAccount.update({
            signatureId : signId
        },{where: { bankAccountId: accountId }});

    } catch (error) {
        console.log(error);
    }
    return bankAccount;

}


exports.addSignatureImage = async (req,model) => {

    var signature;
    try {


        var signImageUrl = exports.getImageUrl(req);
         signature = await Signature.create({
          signatureImage : signImageUrl,
          userId : model.userId
        });


    } catch (error) {
        console.log(error);
    }
    return signature;

}


// get Bnak Logos

exports.bankLogos = async () => {
  var logos;
  try {

      // get bank logos
      logos = await BankLogo.findAll();

  } catch (error) {
      console.log(error);
  }
  return logos;
}



exports.addLogos = async (model) => {

  var logos
  try {

      // creat doc
      logos = await BankLogo.bulkCreate(model);

  } catch (error) {
      console.log(error);
  }
  return logos;
}




exports.addBankLogo = async (url) => {

  var logo
  try {

      logo = await BankLogo.create({
        bankLogo: url
      });

  } catch (error) {
      console.log(error);
  }
  return logo;
}

// get image url after upload in folder

exports.getImageUrl = (req) => {


    const url = APPURL;
    const path = url + 'uploads/'+ req.file.filename;
   return path;
  }
