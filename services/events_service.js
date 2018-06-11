const chrono = require('chrono-node')
const GOOGLE_CAL_ID = '7e0fa936b905266aa753cd280751ab0f8fdb750d'
const Send = require('./send_service')
module.exports = {

  writeEventToDB() {

  },

  createAnEvent() {

  },



  parseDetectedText(text) {
    return chrono.parse(text).map((result) => {
      if(result.start && result.end) {

          try {
            var start = new Date(result.start.knownValues.year ? result.start.knownValues.year: result.start.impliedValues.year, result.start.knownValues.month, result.start.knownValues.day, result.start.knownValues.hour);
            var end = new Date(result.end.knownValues.year ? result.end.knownValues.year: result.end.impliedValues.year, result.end.knownValues.month, result.end.knownValues.day, result.end.knownValues.hour);
            var calLink = (`https://calendar.google.com/calendar/r/eventedit?dates=${start.toISOString().replace(/-|:|\.\d\d\d/g,"")}/${end.toISOString().replace(/-|:|\.\d\d\d/g,"")}`);
            return calLink;
          } catch (e) {
            console.log('ERROR IN CHRONO', e)
          }

      }
    })

  }

}
