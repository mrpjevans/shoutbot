/*
  
Edit this file as needed and save as config.js

The PSKs (pre-shared keys)provide a (small) layer of
security.
They are a string known only to Shoutbot and the
service delivering the notification. It is an array
so you can have different psks for different services
if you wish.

*/
module.exports = {
  // Array of pre-shared keys (so you can have multiple devices with unique passwords)
  // Leave blank for a welcome mat (bad idea)
  psks: [],
  // IP address(es) to listen on, leave empty [] for all
  ip: [],
  // Port to listen on (Default 10207)
  port: 10207,
  // SSL settings (place files in the certs directory)
  ssl: {
    enabled: false,
    cert: "certificate.pem",
    key: "privatekey.pem",
  },
  // Defaults if not specified in payload
  defaultTitle: "Title",
  defaultMessage: "Message",
  defaultSound: true,
  // Icons must be in the 'icons' subdirectory
  defaultIcon: "notify.png",
};
