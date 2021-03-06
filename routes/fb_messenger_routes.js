// Creates the endpoint for our webhook
const keys = require('../config/keys');
const Received = require('../services/received_service');

module.exports = (app) => {

  app.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        var pageID = entry.id;
        var timeOfEvent = entry.time;
        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
        entry.messaging.forEach(function(messagingEvent) {
          if (messagingEvent.optin) {
            Received.receivedAuthentication(messagingEvent);
          } else if (messagingEvent.message) {
            Received.receivedMessage(messagingEvent);
          } else if (messagingEvent.delivery) {
            Received.receivedDeliveryConfirmation(messagingEvent);
          } else if (messagingEvent.postback) {
            Received.receivedPostback(messagingEvent);
          } else if (messagingEvent.read) {
            Received.receivedMessageRead(messagingEvent);
          } else if (messagingEvent.account_linking) {
            Received.receivedAccountLink(messagingEvent);
          } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
          }
        });
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }

  });

  // Adds support for GET requests to our webhook
  app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = keys.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);

      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });
}
