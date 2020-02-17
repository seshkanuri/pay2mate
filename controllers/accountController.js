const User = require("../models/user");
const accountHelper = require("../helpers/accountHelper");
const userHelper = require("../helpers/userHelper");
const genericHelper = require("../helpers/genericResponse");

// update user profile
exports.updateProfile = (req, res, next) => {

  var imageUrl;
  const model = req.body;

  if (req.file) {
    imageUrl = getImageUrl(req);
  }

  User.update (
    {
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      city: model.city,
      zipCode: model.zipCode,
      country: model.country,
      addressNumber: model.addressNumber,
      address: model.address,
      state: model.state,
      phone: model.phone,
      countryCode: model.countryCode

    },
    { where: { Id: model.Id }}
    ).then(result => {
      res.status(200).json({ message: "Profile Updated", data:result });
    })
    .catch(err => {
      res.status(500).json({ message: "Updation Failed", error: err });
    });
};



// get user Profile
exports.getProfile = (req, res, next) => {
  const id = req.query.Id;

  User.findOne({
    where: { Id: id },
    attributes: [
      "Id",
      "email",
      "uniqueName",
      "profileImageUrl",
      "firstName",
      "lastName",
      "city",
      "zipCode",
      "country",
      "addressNumber",
      "address",
      "kycStatus",
      "trustedUser",
      "phone",
      "countryCode",
      "state",
    ]
  })
    .then(profile => {
      res.status(200).json({
        profile: profile
      });
    })
    .catch(err => {
      res.status(400).json({ message: err });
    });
};



// add user KYC

exports.userKyc = async (req, res, next) => {

  var userId = req.query.userId;
  var documents;
  var docArrays = [];
  var model =  req.body;
  try {

    req.files.forEach(file => {
    var docUrl = genericHelper.getImageUrlFromArray(req, file);

    docArrays.push({
      userId : userId,
      document: docUrl,
      kycTypeId: model.kycTypeId
    });
    });

    documents = await accountHelper.kycVerification(docArrays,userId);


    if (documents.length == 0) {
      res.status(400).json({messgae: '', data: {}});
    }
  } catch (error) {
    res.status(500).json({messgae: error, data: {}});

  }
  res.status(201).json({messgae: 'Uploaded', data : documents});

}




exports.kycTypes = async (req, res, next) => {
var types;
  try {

   types = await accountHelper.getKycTypes();

   if (!types) {
     res.status(400).json({ message: "", data:{} });
   }

  } catch (error) {
  res.status(500).json({ message: error });
  }
  res.status(200).json({ message: "", data:types });


};




exports.addKycType = async (req, res, next) => {
  var model = req.body;
  try {
     await accountHelper.addKycType(model);

  } catch (error) {
    res.status(500).json({ message: error });
  }
   res.status(201).json({ message: "",  data: {}});
};


exports.deletekycTypes = async (req, res, next) => {
  const kycTypeId = req.query.kycTypeId;
  try {

    await accountHelper.deleteKycType(kycTypeId);

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.status(200).json({ message: "Succefully Deleted",  data: {}});

};

// Kyc Requests

exports.getkycDocs = async (req, res, next) => {
  var docs;
  var userId = req.query.userId;
    try {

      requests = await accountHelper.kycDocs(userId);

    } catch (error) {
    res.status(500).json({ message: error });
    }
    res.status(200).json({ message: "", data:requests });

  };


exports.updateKycStatus = async (req, res, next) => {
    var userId = req.query.userId;
    var updatedUser
      try {

        updatedUser = await accountHelper.updateKycStatus(userId);

      } catch (error) {
      res.status(500).json({ message: error });
      }
      res.status(200).json({ message: "", data:updatedUser });

    };



exports.deleteDocument = async (req, res, next) => {
  var documentId = req.query.documentId;
    try {

     await accountHelper.deleteDocumentById(documentId);

    } catch (error) {
    res.status(500).json({ message: error });
    }
    res.status(200).json({ message: "Deleted", data:{} });

  };


  exports.deleteKycDocument = async (req, res, next) => {
    var kycId = req.query.kycId;
      try {

       await accountHelper.deleteKycDocumentById(kycId);

      } catch (error) {
      res.status(500).json({ message: error });
      }
      res.status(200).json({ message: "Deleted", data:{} });

    };










function getImageUrl(req) {

  const url = req.protocol + '://' + req.get("host");
  const path = url + '/uploads/'+ req.file.filename;
 return path;
}



// get Uploaded ImagesUrl

// function getImageUrlFromArray(req, file) {

//   const url = req.protocol + '://' + req.get("host");
//   const path = url + '/uploads/' + file.filename;
//   return path;
// }
