const cryptoJSON = require('crypto-json')


const password = 'jksjas$%hjs#3@TYKIT@'
const config = {
 algorithm : 'aes256',
  keys : [],
 encoding : 'hex',
}


let encryptData = (obj) =>{

  //filter not null  keys
let cryptoConfig = config;
  /* Object.keys(obj).forEach(key => {
    if (obj[key] != null && obj[key] != false &&  obj[key] != true && key != 'bankaccountTypeId') {
      cryptoConfig.keys.push(key);
    }
  }) */

  cryptoConfig.keys = ['accountNumber', 'address', 'accountName'];


  const encryptedObject = cryptoJSON.encrypt(
    obj, password, cryptoConfig
  );

  return encryptedObject;

}


let decryptData = (obj) =>{
  config.keys = []
let cryptoConfig = config;

 /*  Object.keys(obj).forEach(key => {
    if (obj[key] != null && obj[key] != false &&  obj[key] != true && key != 'bankaccountTypeId') {
      cryptoConfig.keys.push(key);
    }
  }) */

  cryptoConfig.keys = ['accountNumber', 'address', 'accountName'];


  const decryptedObject = cryptoJSON.decrypt(
    obj, password, cryptoConfig
  )

  return decryptedObject;


}


module.exports = {
  decryptData: decryptData,
  encryptData: encryptData,
}
