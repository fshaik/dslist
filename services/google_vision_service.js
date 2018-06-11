const vision = require('@google-cloud/vision');
const Events = require('./events_service');
const Send = require('./send_service')

module.exports = {

  detectTextFromImageURL(url, recipientId) {

    const client = new vision.ImageAnnotatorClient();

    return client
      .textDetection(url)
      .then(results => {
        const detections = results[0].textAnnotations;
        Events.parseDetectedText(detections[0].description).map(calLink => {
          if(calLink) {
            Send.sendTextMessage(recipientId, `${calLink}`)
          }

        })

      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  },



}
