'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  app = express()

app.use(bodyParser.json()); // creates express http server

require('./routes/fb_messenger_routes')(app);

// Sets server port and logs message on success


app.listen(process.env.PORT || 1337, () => console.log('webhook is listening on 1337'));


// var chrono = require('chrono-node')
// var date = chrono.parse('JUNE 14 , 2018 6:00 PM - 9:00 PM')
// console.log(date[0].start);
// console.log(date[0].end);
