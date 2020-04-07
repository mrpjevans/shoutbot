const http = require("http");
const https = require("https");
const url = require("url");
const path = require("path");
const notifier = require("node-notifier");
const config = require(path.join(__dirname, "config"));
const fs = require("fs");

logit("Hello");

const httpHandler = (req, res) => {
  const urlData = url.parse(req.url, true);
  const route = `${req.method} ${urlData.pathname}`;
  let body = [];

  // Routes
  const routes = {
    "POST /notify": routePostNotify,
  };

  // Handle request
  logit(`${req.connection.remoteAddress} ${route}`);
  req
    .on("error", (err) => {
      logit(`${req.connection.remoteAddress} ${err.message}`);
    })
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      try {
        body = Buffer.concat(body).toString();
        payload = body.length > 0 ? JSON.parse(body) : {};
        routes[route] ? routes[route](urlData, payload) : simpleResponse(404);
      } catch (err) {
        simpleResponse(500, err.message ? err.message : err);
      }
      res.end();
    });

  // Generic response
  function simpleResponse(status, message = null) {
    const payload = { status };
    message && (payload.message = message);
    const payloadString = JSON.stringify(payload);
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Content-length": Buffer.byteLength(payloadString),
    });
    res.write(payloadString);
    logit(`${req.connection.remoteAddress} ${status} ${message}`);
  }

  //
  // Route handling
  //

  // POST /alert
  function routePostNotify(urlData, payload) {
    // Pre-shared key check
    if (
      config.psks.length !== 0 &&
      (!payload.psk || config.psks.indexOf(payload.psk) === -1)
    ) {
      simpleResponse(401);
      return;
    }

    // Prepare message
    const title = payload.title ? payload.title : config.defaultTitle;
    const message = payload.message ? payload.message : config.defaultMessage;
    const sound = payload.sound ? payload.sound : config.defaultSound;
    const icon = path.join(
      __dirname,
      "icons",
      payload.icon ? payload.icon : config.defaultIcon
    );

    // Push message
    notifier.notify({
      title,
      message,
      sound,
      icon,
    });

    simpleResponse(200);
  }
};

// Logging
function logit(s) {
  var dateStr = new Date().toISOString();
  console.log(`[SHOUTBOT] ${dateStr} ${s}`);
}

// Create a server instance
let httpInstance;
if (config.ssl.enabled) {
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "certs", config.ssl.key)),
    cert: fs.readFileSync(path.join(__dirname, "certs", config.ssl.cert)),
  };
  httpInstance = https.createServer(sslOptions, httpHandler);
  logit("SSL Enabled");
} else {
  httpInstance = http.createServer(httpHandler);
}

// Open a socket for each IP
config.ip.length === 0 && config.ip.push("0.0.0.0");
config.ip.forEach(function (ip) {
  logit(`Listening on ${ip}:${config.port}`);
  httpInstance.listen(config.port, ip);
});
