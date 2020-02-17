
exports.JsonResponse = (res,status, message, result) => {

    res.json(
        {status: status,
             message: message,
              data: result });

}


exports.getImageUrlFromArray = (req, file) =>{

  // const url = req.protocol + '://' + req.get('host');
  // const url = req.protocol + '://' + req.hostname;
  const url = APPURL;
  const path = url + 'uploads/' + file.filename;
  return path;
}
