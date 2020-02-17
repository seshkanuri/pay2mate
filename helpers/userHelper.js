
const User = require("../models/user");








// find all users

exports.allUsers = async (email) => {

  var users;
  try {
    users = await User.findAll({
      order: [['Id', 'DESC']],
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  return users;

}

// find user by Email

exports.getUserByEmail = async (email) => {

  var user;
  try {
    user = await User.findOne({
      where: { email: email },

    });
  } catch (error) {
    console.log(error);
    throw new Error(error);

  }
  return user;

}




exports.getUserById = async (id) => {

  var user;
  try {
    user = await User.findOne({
      where: { Id: id },

    });
  } catch (error) {
    console.log(error);
    throw new Error(error);

  }
  return user;

}



// user Managment

exports.deleteUser = (userId) => {
  try {
    User.destroy({
      where: { Id: userId }
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  return true;

}


exports.suspendUser = (userId) => {
  try {
    User.update({
      accountStatus: User.rawAttributes.accountStatus.values[1],
    }, { where: { Id: userId } })
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  // User;
  return true;

}

exports.verifyUser = (userId) => {
  try {
    User.update({
      isVerified: 1,
    }, { where: { Id: userId } })
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  // User;
  return true;

}

exports.activateUser = (userId) => {
  try {
    User.update({
      accountStatus: User.rawAttributes.accountStatus.values[0],
    }, { where: { Id: userId } })
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  // User;
  return true;

}