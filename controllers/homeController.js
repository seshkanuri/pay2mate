
const homeHelper = require("../helpers/homeHelper");
const genericHelper = require("../helpers/genericResponse");

// Slider images
exports.getSliderImages = async (req, res, next) => {
  var images;
  try {
    images = await  homeHelper.getSliderImages();

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.status(200).json({ message: "",  data: images});
}


exports.addSliderImages = async (req, res, next) => {

  var sliderImages;
  var imgArrays = [];
  try {

    req.files.forEach(file => {
    var url = genericHelper.getImageUrlFromArray(req, file);

    imgArrays.push({
      sliderImage: url,
    });
    });

    sliderImages = await homeHelper.addSliderImages(imgArrays);


    if (sliderImages.length == 0) {
      res.status(400).json({messgae: '', data: {}});
    }
  } catch (error) {
    res.status(500).json({messgae: error, data: {}});
  }
  res.status(201).json({messgae: 'Uploaded', data :sliderImages});

};




exports.addContactMessage = async (req, res, next) => {

  const model = req.body;
  try {

    model.isRead= false;

    await homeHelper.addMessage(model);


  } catch (error) {
    res.status(500).json({messgae: error, data: {}});
  }
  res.status(201).json({messgae: 'message added', data :null});

};

/*  Subscriber */
exports.addSubscriber = async (req, res, next) => {

  const model = req.body;
  try {

    await homeHelper.addSubscriber(model);


  } catch (error) {
    res.status(500).json({messgae: error, data: {}});
  }
  res.status(201).json({messgae: '', data :null});

};





//------------------admin--------------------

exports.deleteSliderImages = async (req, res, next) => {

  const sliderId = req.query.sliderId;
  try {

    await homeHelper.deleteSliderImage(sliderId);

  } catch (error) {
    res.status(500).json({ message: error });
  }

  res.status(200).json({ message: 'Deleted', data: {} });

}


/* User contact Requests */

exports.getContactRequests = async (req, res, next) => {
  var requests;
  try {
    requests =  await  homeHelper.getUserContactRequests();
  } catch (error) {
  res.status(500).json({ message: "Bad Request",  data: error});

  }
  res.status(200).json({ message: "requests",  data: requests});

}

exports.readContactRequests = async (req, res, next) => {
  const contactId = req.query.contactId;
  try {
      await  homeHelper.contactRequestRead(contactId);
  } catch (error) {
  res.status(500).json({ message: "Bad Request",  data: error});

  }
  res.status(200).json({ message: "requests read",  data: null});

}


/* Subscribers */

exports.getSubscribers = async (req, res, next) => {
  var data;
  try {
    data =  await  homeHelper.getSubscribers();
  } catch (error) {
  res.status(500).json({ message: "Bad Request",  data: error});
  }
  res.status(200).json({ message: "subscribers",  data: data});

}





