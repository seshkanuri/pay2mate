const userHelper = require("../helpers/userHelper");
const nodemailer = require('nodemailer');


exports.getUsers = async (req, res, next) => {

  var users;

  try {
    users = await userHelper.allUsers();

    if (!users) {
      res.status(400).json({ message: 'Users', data: {} });
    }

  } catch (error) {
    res.status(500).json({ message: error, data: {} });
  }

  res.status(200).json({ message: 'Users', data: users });


};



// delete User

exports.deleteUser = (req, res, next) => {

  var isSucceed;
  var id = req.query.userId;

  try {
    isSucceed = userHelper.deleteUser(id);

    if (isSucceed != true) {
      res.status(400).json({ message: 'Could Not Delete User', data: {} });
    }
    else {
      res.status(200).json({ message: 'User Deleted Succefully', data: {} });

    }

  } catch (error) {
    res.status(500).json({ message: error, data: {} });
  }
};


// suspend User

exports.suspendUser = (req, res, next) => {

  var isSucceed;
  var id = req.query.userId;
  try {
    isSucceed = userHelper.suspendUser(id);

    if (isSucceed != true) {
      res.status(400).json({ message: 'User Could Not Suspend', data: {} });
    }
    else {
      res.status(200).json({ message: 'User Suspended Successfully', data: {} });

    }

  } catch (error) {
    res.status(500).json({ message: error, data: {} });
  }
};

exports.verifyUser = (req, res, next) => {

  var isSucceed;
  var id = req.query.userId;
  try {
    isSucceed = userHelper.verifyUser(id);
    if (isSucceed != true) {
      res.status(400).json({ message: 'Can not verify user', data: {} });
    }
    else {
      res.status(200).json({ message: 'User Verified Succefully', data: {} });

    }

  } catch (error) {
    res.status(500).json({ message: error, data: {} });
  }
};


exports.activateUser = (req, res, next) => {

  var isSucceed;
  var id = req.query.userId;
  try {
    isSucceed = userHelper.activateUser(id);
    if (isSucceed != true) {
      res.status(400).json({ message: 'Can not activate user', data: {} });
    }
    else {
      res.status(200).json({ message: 'User Activated Successfully', data: {} });

    }

  } catch (error) {
    res.status(500).json({ message: error, data: {} });
  }
};


exports.sendEmail = (req, res, next) => {

  var isSucceed;
  var email = req.query.email;
  var name = req.query.uniqueName;

  var transporter = nodemailer.createTransport(
    {
      host: "mail.pay2mate.com",
      port: 465,
      secure: true,
      auth: {
        user: "support@pay2mate.com",
        pass: "N}s;E;88X62R"
      },

      requireTLS: true,
      tls: {
        rejectUnauthorized: false
      },
    }
  );

  var mailOptions = {
    from: 'support@pay2mate.com',
    to: email,
    subject: 'Verification Reminder',
    html: 'Hello <strong>' + name + '</strong>,<br> Please verify your account on https://pay2mate.com/</p>'

  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Error while sending the email', data: {} });

    } else {
      res.status(200).json({ message: 'Email sent.', data: {} });
    }
  });

};

