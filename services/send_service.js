const request = require('request-promise');
const keys = require('../config/keys')

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = keys.FACEBOOK_SECRET;

// Arbitrary value used to validate a webhook
// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = keys.PAGE_ACCESS_TOKEN;

function callSendAPI(messageData) {
      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;

          if (messageId) {
            //console.log("Successfully sent message with id %s to recipient %s",
             // messageId, recipientId);
          } else {
          //console.log("Successfully called Send API for recipient %s",
            //recipientId);
          }
        } else {
          console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
      });
}

module.exports = {

  sendTextMessage: function(recipientId, messageText) {
    var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          text: messageText,
          metadata: "DEVELOPER_DEFINED_METADATA"
        }
      };

      callSendAPI(messageData);
  }
}
