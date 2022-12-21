const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const serviceSid = client.verify.v2.services
  .create({ friendlyName: "VF-INVEN" })
  .then(function (service) {
    return service.sid;
  });

module.exports = serviceSid;