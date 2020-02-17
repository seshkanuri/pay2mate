
// helper
const recieverHelper = require("../helpers/recieverHelper");





exports.addReciever = async (req,res,next) => {
    const model = req.body;
    const userId = req.query.Id;
    var recieverCreated;

    try {

        recieverCreated =  await recieverHelper.createReceiever(model, userId)

        if (!recieverCreated) {
            res.status(400).json({message: 'Could Not Add Payee', data: {}});
        }

    } catch (error) {
        res.status(500).json({message: error, data: {}});
    }
    res.status(201).json({message: 'Payee added', data: recieverCreated});

}






exports.getAllReciever = async (req,res,next) => {

    const recieverId = req.query.Id;
    var recievers;
    try {


      recievers =  await recieverHelper.getRecievers(recieverId);

      if (!recievers) {
          res.status(400).json({message: 'Not Found', data: {}});
      }

    } catch (error) {
      res.status(500).json({ message: error });
    }
    res.status(200).json({ message: "",  data: recievers});
  }




exports.getSingleReciever = async (req,res,next) => {

  const recieverId = req.query.recieverId;
  var reciever;
  try {


    reciever =  await recieverHelper.getRecieverById(recieverId);

    if (!reciever) {
        res.status(400).json({message: 'Not Found', data: {}});
    }

  } catch (error) {
    res.status(500).json({ message: error });
  }
  res.status(200).json({ message: "",  data: reciever});
}




exports.updateReciever = async (req,res,next) => {
    const model = req.body;
   var updatedReciever;
  try {

    updatedReciever =  await recieverHelper.updateReciever(model);
    if (!updatedReciever) {
        res.status(400).json({message: 'could not updated', data: {}});
    }

  } catch (error) {
    res.status(500).json({message: error})
  }

  res.status(201).json({message: 'Succefully Updated', data: updatedReciever})

  }


  exports.deleteReciever = async (req, res, next) => {
    const recieverId = req.query.recieverId;
    try {

        await recieverHelper.deleteReciever(recieverId);

    } catch (error) {
      res.status(500).json({ message: error });
    }
    res.status(200).json({ message: "Succefull",  data: {}});

  };
