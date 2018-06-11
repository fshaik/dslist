const GoogleVision = require('./google_vision_service');
const AWS = require('aws-sdk');
const request = require('request-promise');
const send = require('./send_service');

const saveImageMessage = async (url, cb, recipientId) => {

  AWS.config.update({ accessKeyId: 'AKIAJRVWFDGVUKEXQKRQ', secretAccessKey: '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' });

  var filename = Math.random().toString(36).substring(7);
  var s3 = new AWS.S3();
  var imageBuff = await request.get({
    url,
    encoding: null
  });

  let params = {
    Bucket: 'd-list',
    Key: filename,
    ACL: 'public-read',
    Body: imageBuff // buffer
  }

  s3.putObject( params, function(err, data) {
      if(err) {
        console.log('ERROR IN saveImageMessage');
        console.log(err);
      } else {
        const temp = cb('https://s3.amazonaws.com/' + 'd-list' + '/' + filename, recipientId);
      }
    });

}

module.exports = {

   receivedMessage :  (event) => {
     console.log(event)

     if(event.message.attachments) {
       event.message.attachments.forEach( async a => {
         if(a.type ==='image') {
            saveImageMessage(a.payload.url, GoogleVision.detectTextFromImageURL, event.sender.id)
         } else {
           console.log("Not an Image")
         }
       })
     } else if(event.message.text) {
       send.sendTextMessage(event.sender.id, "I only speak in images")
     }
  },

  receivedAuthentication : (event) => {

    console.log("Recieved Auth")

  },

 receivedDeliveryConfirmation: (event) => {

 },

 receivedPostback: (event) => {

 },

 receivedMessageRead: (event) => {

 },

 receivedAccountLink: (event) => {

 }

}
