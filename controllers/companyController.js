const User = require("../models/user");
const Company = require("../models/company");

const response = require("../helpers/genericResponse");




exports.creatCompany = (req,res,next) => {
  const model = req.body;
  const id = req.query.Id;
  // many to many relationship
    // save them... and then:
      Company.create({
        companyName : model.companyName,
        EIN : model.EIN,
        hasPartner: model.hasPartner,
        companyAddress: model.companyAddress,
        partnerEmail: model.partnerEmail,
        companyCity: model.companyCity,
        companyCountry: model.companyCountry,
        companyTelephone: model.companyTelephone,
        companyZipCode: model.companyZipCode,
        partnerName: model.partnerName,
        partnerMiddleName: model.partnerMiddleName,
        partnerLastName: model.partnerLastName,
        partnerDesignation: model.partnerDesignation,
      }).then(company => {
       return company.addUser(id);
      })
      .then(result => {
        res.status(201).json({message: 'Succefully Added', data: result})
}).catch(err=> res.status(500).json({message: err}))
}




// get all companies > accept userId as param
exports.getAllCompany = (req,res,next) => {
    const id = req.query.Id;
    // many to many relationship
     Company.findAll({
        include: [{
          model: User,
          as: 'users',
          attributes: [
            "Id",
            "email",
            "firstName"] ,
          where: {Id : id}
        }]
    }).then(company =>{
        console.log(company);
        return res.status(200).json({data: company});

       }).catch(err => {
        res.status(500).json({error: err});

    })


}



// get company by company Id

exports.getSingleCompany = async (req, res, next) => {
  const companyId = req.query.companyId;
  var company;
  try {
    company = await Company.findOne({
      where : {Id: companyId}
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.status(200).json({ message: "Succefull",  data: company});

}


// update company by CompanyId
exports.updateCompany = async (req,res,next) => {
  const model = req.body;
 var company;
try {

  company = await Company.update({
    companyName : model.companyName,
    EIN : model.EIN,
    hasPartner: model.hasPartner,
    companyAddress: model.companyAddress,
    partnerEmail: model.partnerEmail,
    companyCity: model.companyCity,
    companyCountry: model.companyCountry,
    companyTelephone: model.companyTelephone,
    companyZipCode: model.companyZipCode,
    partnerName: model.partnerName,
    partnerMiddleName: model.partnerMiddleName,
    partnerLastName: model.partnerLastName,
    partnerDesignation: model.partnerDesignation,
  }, {where: { Id: model.Id }})

} catch (error) {
  res.status(500).json({message: error})
}

res.status(201).json({message: 'Succefully Updated', data: company})

}


exports.deleteCompany = async (req, res, next) => {
  const companyId = req.query.companyId;
  try {
    await Company.destroy({
      where : {Id: companyId}
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.status(200).json({ message: "Succefull",  data: null});

};
