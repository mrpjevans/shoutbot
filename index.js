const http = require("http");
const url = require("url");
const notifier = require("node-notifier");
const config = require("./config");

logit("Hello");

// Validate config

// Create a server object
const httpInstance = http.createServer((req, res) => {
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
      logit(`${req.connection.remoteAddress} ${err}`);
    })
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      try {
        body = Buffer.concat(body).toString();
        payload = JSON.parse(body);
        routes[route] ? routes[route](urlData, payload) : simpleResponse(404);
      } catch (err) {
        simpleResponse(500, err);
      }
      res.end();
    });

  // Generic response
  function simpleResponse(status, message = null) {
    const payload = { status };
    message && (payload.message = message);
    res.writeHead(status, { "Content-Type": "application/json" });
    res.write(JSON.stringify(payload));
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
      (!urlData.query.psk || config.psks.indexOf(urlData.query.psk) === -1)
    ) {
      simpleResponse(401);
    }

    // Prepare message
    const title = payload.title ? payload.title : config.defaultTitle;
    const message = payload.message ? payload.message : config.defaultMessage;
    const sound = payload.sound ? payload.sound : config.defaultSound;

    // Push message
    notifier.notify({
      title,
      message,
      sound,
    });

    simpleResponse(200);
  }
});

// Logging
function logit(s) {
  console.log(`[SHOUTBOT] ${s}`);
}

// Open a socket for each IP
config.ip.length === 0 && config.ip.push("0.0.0.0");
config.ip.forEach(function (ip) {
  logit(`Listening on ${ip}:${config.port}`);
  httpInstance.listen(config.port, ip);
});
