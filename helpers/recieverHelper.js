
const User = require("../models/user");
const Reciever = require("../models/reciever");


exports.createReceiever = async (model, id) => {

    var reciever;
    try {


        reciever = await Reciever.create({
            recieverName : model.recieverName,
            recieverEmail : model.recieverEmail,
            telephone: model.telephone,
            address: model.address,
            country: model.country,
            city: model.city,
            zipCode: model.zipCode,
            userId: id,
        });

    } catch (error) {
        console.log(error);
    }
    return reciever;


}



exports.getRecieverById = async (id) => {

    var reciever;
    try {

        reciever = await Reciever.findOne({
            where : {recieverId: id}
          });

    } catch (error) {
        console.log(error);
    }
    return reciever;


}



exports.getRecievers = async (id) => {

    var recievers;
    try {

        recievers = await Reciever.findAll({
            where : {userId: id}
          });

    } catch (error) {
        console.log(error);
    }
    return recievers;


}




exports.updateReciever = async (model) => {

    var reciever;
    try {

        reciever = await Reciever.update({
          recieverName : model.recieverName,
          recieverEmail : model.recieverEmail,
          telephone: model.telephone,
          address: model.address,
          country: model.country,
          city: model.city,
          zipCode: model.zipCode,
          }, {where: { recieverId: model.recieverId }})

    } catch (error) {
        console.log(error);
    }
    return reciever;


}




exports.deleteReciever = async (id) => {

    try {

        await Reciever.destroy({
            where : {recieverId: id}
          });

    } catch (error) {
        console.log(error);

    }

}
