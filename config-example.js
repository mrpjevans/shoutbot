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
  // SSL settings (Not yet supported)
  ssl: {
    enabled: false,
    cert: "",
    key: "",
  },
  defaultTitle: "Title",
  defaultMessage: "Message",
  defaultSound: false,
};
