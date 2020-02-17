const User = require("../models/user");
const Bank = require("../models/bank");
const BankAccount = require("../models/bank-account");
const Company = require("../models/company");
const Signature = require("../models/user-signature");
const BankAccountType = require("../models/bankaccount-type");
const IndividualCoPartner = require("../models/individual-copartner");
const UserBank = require("../models/user-bank");
//helper
const bankHelper = require("../helpers/bankHelper");
const genericHelper = require("../helpers/genericResponse");
const { decryptData } = require('../helpers/cipherHelper');



exports.getBank = async (req, res, next) => {
  const rnId = req.query.rn;
  var bank;
  try {
    bank = await Bank.findOne({ where: { routingNumber: rnId } });

    if (bank) {
      return res.status(200).json({ message: "bank found", data: bank });
    }

  } catch (error) {
    res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: "Go for Live Api", data: null });
};


exports.getBankLogos = async (req, res, next) => {
  var bankLogos;
  try {
    bankLogos = await bankHelper.bankLogos();

    if (!bankLogos) {
      return res.status(400).json({ message: "bank Logo not presnet", data: {} });
    }

  } catch (error) {
    res.status(500).json({ message: error });
  }
  return res.status(200).json({ message: "bank Logos", data: bankLogos });

};



exports.addBankLogos = async (req, res, next) => {

  var bankLogos;
  var logoArrays = [];
  try {

    req.files.forEach(file => {
      var logoUrl = genericHelper.getImageUrlFromArray(req, file);

      logoArrays.push({
        bankLogo: logoUrl,
      });
    });

    bankLogos = await bankHelper.addLogos(logoArrays);


    if (bankLogos.length == 0) {
      res.status(400).json({ messgae: '', data: {} });
    }
  } catch (error) {
    res.status(500).json({ messgae: error, data: {} });

  }
  res.status(201).json({ messgae: 'Uploaded', data: bankLogos });

};

exports.creatBank = async (req, res, next) => {
  const model = req.body;
  const userId = req.query.userId;
  var bank;
  var bankLogoUrl;
  var logoId;
  try {

    if (!model.bankId) {

      bank = await Bank.findOne({ where: { routingNumber: model.routingNumber } });

      if (bank) {
        return res.status(200).json({ message: "bank self stored info ", data: bank });
      }
      // if image is present

      if (req.files) {
        bankLogoUrl = genericHelper.getImageUrlFromArray(req, req.files[0]);
        var bankLogo = await bankHelper.addBankLogo(bankLogoUrl) // add bank Logo first
        logoId = bankLogo.bankLogoId;
      } else {
        logoId = model.bankLogoId
      }

      // if bankId not present it means new bank


      // save bank Logo Id found after saving Logo and then save bank

      bank = await Bank.create(
        {
          bankName: model.bankName,
          routingNumber: model.routingNumber,
          city: model.city,
          address: model.address,
          telephone: model.telephone,
          zipCode: model.zipCode,
          bankLogoId: logoId
        });

      // add all keys into bridge Tabke UserBank
      await bank.addUser(userId);  // this line add keys to Bridge Table

    } else {
      // existing Bank , magic functions

      const userBank = await UserBank.findOne({ where: { userId: userId, bankId: model.bankId } });

      if (userBank) {
        return res.status(400).json({ message: "Bank is already added to your profile", data: {} });
      }
      else {
        const user = await User.findOne({ where: { Id: userId } });
        await user.addBank(model.bankId);
        // await Bank.addUser(userId);
        // await User.addBank(model.bankId, {where: {userId: userId}});
      }

    }
  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(201).json({ message: "Bank Succefully Added", data: bank });
};


exports.updateBank = async (req, res, next) => {
  const model = req.body;
  var bank;
  var logoUrl;
  try {
    bank = await Bank.findOne({ where: { bankId: model.bankId } });

    if (!bank) {
      return res.status(200).json({ message: "Bank Not FOund ", data: {} });
    }

    // add signature to signature table for maintaing history
    if (model.logoImage) {
      logoUrl = await bankHelper.getImageUrl(req)
    }

    await bank.update(
      {
        bankName: model.bankName,
        routingNumber: model.routingNumber,
        city: model.city,
        address: model.address,
        telephone: model.telephone,
      });

  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(201).json({ message: "Bank Succefully Updated", data: bank });
};



exports.getAllBanks = async (req, res, next) => {
  var banks;
  try {
    banks = await bankHelper.getBanks();

  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: "all banks", data: banks });
};

//-------------------------Bank Account-------------------------

// creat bank account
exports.creatBankAccount = async (req, res, next) => {
  const model = req.body;
  var bankAccount;
  var coPartnerId;
  try {
    bankAccount = await BankAccount.findOne({ where: { accountNumber: model.accountNumber, bankId: model.bankId } });

    if (bankAccount) {
      return res.status(400).json({ message: "Bank Account is already added" });
    }

    // // avalibale for other company or not --- search by bank routing and account number
    // var isAccountAvailable = await BankAccount.findOne({where: {bankId: model.bankId, accountNumber: model.accountNumber}});

    // if (isAccountAvailable) {
    //   return res.status(400).json({ message: "Bank Account is already in use of other company" });
    // }

    // add signature to signature table for maintaing history
    // if (model.signatureId) {
    //   var signImageUrl =  getImageUrl(req);
    //   var signature = await Signature.create({
    //     signatureImage : signImageUrl,
    //     userId : model.userId
    //   });
    //   signId = signature.signatureId; // new sign
    // }
    //   else{
    //     signId = model.signatureId; // user choosed existing sign
    //   }


    // if Account is individual and have Co partner details

    if (model.isIndividualCoPartner) {

      const individualCoPartner = await IndividualCoPartner.create(
        {
          coPartnerName: model.coPartnerName,
          middleName: model.middleName,
          partnerEmail: model.partnerEmail,
          lastName: model.lastName,
          telephone: model.telephone,
          partnerAddress: model.partnerAddress,
        }
      )
      coPartnerId = individualCoPartner.coPartnerId
    }



    bankAccount = await BankAccount.create(
      {
        accountName: model.accountName,
        accountNumber: model.accountNumber,
        address: model.address,
        isSubAccount: model.isSubAccount,
        subAccountNumber: model.subAccountNumber,
        userId: model.userId,
        individualAccount: model.individualAccount,
        isIndividualCoPartner: model.isIndividualCoPartner,
        accountTypeId: model.bankaccountTypeId,
        coPartnerId: coPartnerId,
        companyId: model.companyId,
        bankId: model.bankId,
      });



  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(201).json({ message: "Account Succefully Added" });
};



exports.getBankAccount = async (req, res, next) => {
  const id = req.query.userId;
  var bankAccounts;
  try {
    bankAccounts = await BankAccount.findAll({
      where: { userId: id },

      include: [
        { model: Bank },
        { model: BankAccountType },
        { model: Company },
        { model: IndividualCoPartner }
      ]
    });

    if (!bankAccounts) {
      return res.status(400).json({ message: "Accounts not found" });
    }

    let decryptedBankAccounts = []
    //decryption
    bankAccounts.forEach(obj => {
      //  let decryptedObject =  decryptData(obj.dataValues);z
      let decryptedObject = obj.dataValues;
      decryptedBankAccounts.push(decryptedObject)
    });
    // end decryption


    res.status(201).json({ message: "Succefull", data: decryptedBankAccounts });

  } catch (error) {
    res.status(500).json({ message: error });
  }

};


// single bank account



exports.getBankAccountById = async (req, res, next) => {
  const id = req.query.bankAccountId;
  var bankAccount;
  try {
    bankAccount = await BankAccount.findOne({
      where: { bankAccountId: id },
      include: [
        { model: Bank },
        { model: BankAccountType },
        { model: Company },
        { model: IndividualCoPartner }
      ]
    });

    if (!bankAccount) {
      return res.status(400).json({ message: "Accounts not found" });
    }

    //decryption
    let decryptedBankAccount = decryptData(bankAccount.dataValues);

    res.status(201).json({ message: "Succefull", data: decryptedBankAccount });

  } catch (error) {
    res.status(500).json({ message: error });
  }

};

//update

exports.updateBankAccount = async (req, res, next) => {
  const model = req.body;
  var bankAccount;
  var coPartnerId;
  try {



    bankAccount = await BankAccount.findOne({ where: { bankAccountId: model.bankAccountId } });


    if (!bankAccount) {
      return res.status(400).json({ message: "Bank Account Not Found" });
    }


    // if Account is individual and have Co partner details

    if (model.isIndividualCoPartner) {

      const individualCoPartner = await IndividualCoPartner.create(
        {
          coPartnerName: model.coPartnerName,
          middleName: model.middleName,
          partnerEmail: model.partnerEmail,
          lastName: model.lastName,
          telephone: model.telephone,
          partnerAddress: model.partnerAddress,
        });

      coPartnerId = individualCoPartner.coPartnerId

    }

    bankAccount = await BankAccount.update(
      {
        accountName: model.accountName,
        accountNumber: model.accountNumber,
        address: model.address,
        isSubAccount: model.isSubAccount,
        subAccountNumber: model.subAccountNumber,
        userId: model.userId,
        individualAccount: model.individualAccount,
        isIndividualCoPartner: model.isIndividualCoPartner,
        accountTypeId: model.accountTypeId,
        coPartnerId: coPartnerId,
        companyId: model.companyId,
        bankId: model.bankId,
      }, { where: { bankAccountId: model.bankAccountId } });

    /*
            //decryption
             let decryptedBankAccount =  decryptData(bankAccount.dataValues);
            // end decryption
     */


  } catch (error) {
    res.status(500).json({ message: error })
  }

  res.status(201).json({ message: 'Succefully Updated', data: bankAccount })

}




// Delete bank Account @params bankaccountId


exports.deleteBankAccount = async (req, res, next) => {
  const accountId = req.query.bankAccountId;
  try {
    await BankAccount.destroy({
      where: { bankAccountId: accountId }
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.status(200).json({ message: "Succefully Deleted", data: {} });

};



// ---------------------Bank Account Types-----------------


exports.getBankAccountTypes = async (req, res, next) => {
  var accountTypes;
  try {
    accountTypes = await bankHelper.bankAccountTypes();

  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: "", data: accountTypes });
};

exports.addBankAccountType = async (req, res, next) => {
  var model = req.body;
  try {
    await bankHelper.addBankAccountType(model);

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.status(201).json({ message: "", data: {} });
};


exports.deleteBankAccountType = async (req, res, next) => {
  const accountTypeId = req.query.bankAccountTypeId;
  try {

    await bankHelper.deleteBankAccountType(accountTypeId);

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.status(200).json({ message: "Succefully Deleted", data: {} });

};

// ---------------------user Signature History-----------------

exports.getSignatures = async (req, res, next) => {
  const userId = req.query.userId
  var signatures;
  try {
    signatures = await Signature.findAll({
      attributes: ['signatureId', 'signatureImage'],
      where: { userId: userId }
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: "all signatures", data: signatures });
};


// Add bank Account Signatures

exports.addSignature = async (req, res, next) => {
  const model = req.body;
  var signId;
  var bankAccount;
  try {

    // add signature to signature table for maintaing history
    if (model.signatureId != 'null' && model.signatureId != 'undefined') {
      signId = model.signatureId; // user choosed existing sign
    }
    else {
      var signature = await bankHelper.addSignatureImage(req, model);
      signId = signature.signatureId; // new sign
    }

    bankAccount = await bankHelper.addBankAccountSign(signId, model.bankAccountId);

    if (!bankAccount) {
      return res.status(400).json({ message: "Bank Account not Updated" });
    }




  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: "Signature Added", data: {} });
};



// get Uploaded ImagesUrl

// function getImageUrlFromArray(req, file) {

//   const url = req.protocol + '://' + req.get("host");
//   const path = url + '/uploads/' + file.filename;
//   return path;
// }
