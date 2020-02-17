
const Slider = require("../models/slider");
const Contact = require("../models/contact");
const Subscriber = require("../models/subscriber");

exports.addMessage = async (model) => {

  try {

     await Contact.create(model);

  } catch (error) {
      console.log(error);
  }
}

exports.addSubscriber = async (model) => {

  try {

     await Subscriber.create(model);

  } catch (error) {
      console.log(error);
  }
}




exports.getSliderImages = async () => {

  var images;
  try {

    images = await Slider.findAll({
      order: [['sliderId', 'DESC']],
    });

  } catch (error) {
      console.log(error);
  }
  return images;
}


exports.addSliderImages = async (model) => {

  var imgs;
  try {

      // creat doc
      imgs = await Slider.bulkCreate(model);

  } catch (error) {
      console.log(error);
  }
  return imgs;
}

exports.deleteSliderImage = async (id) => {

  var image;
  try {

    await Slider.destroy({
      where: {sliderId: id}
    });

  } catch (error) {
      console.log(error);
  }
}




exports.getSubscribers = async () => {

  var data;
  try {

    data = await Subscriber.findAll();

  } catch (error) {
    console.log(error);
  }
  return data;
}

/* Contacts */

exports.getUserContactRequests = async () => {

  var requests;
  try {

    requests = await Contact.findAll({
      where : {isRead : false}
    });

  } catch (error) {
    console.log(error);
  }
  return requests;
}



exports.contactRequestRead = async (id) => {

  try {

    await Contact.update({
      isRead : true
    },
      {
        where: { contactId: id }
      }
    );

  } catch (error) {
    console.log(error);
  }
}



