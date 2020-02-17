

const {encryptData} = require('../helpers/cipherHelper');

module.exports = (req, res, next) => {
    try{


    if (req.body) {

      req.body = encryptData(req.body);

    }
    next();


    } catch(err){
       res.status(500).json({error: err, message: "Encryption Failed"});

    }
}


/* let decryption = (req, res, next) => {
  try {

    if (req.body) {

      req.body = encryptData(req.body);

    }
    next();

  } catch (error) {

  }
}
 */
