const http = require('http');
const url = require('url');
const notifier = require('node-notifier');
const config = require('./config');

// Create a server object
http.createServer(function (req, res) {

    let queryData = url.parse(req.url, true).query;
    console.log(queryData);

    // Validate the message. A parameter of 'psk' must be passed.
    if (req.method == 'GET' &&
        queryData.message != undefined &&
        queryData.psk != undefined &&
        config['psk'].indexOf(queryData.psk) != -1 ) {

        // Prepare message
        let title = queryData.title ? queryData.title : 'Title';
        let message = queryData.message ? queryData.message : 'Notification';
        let sound = queryData.silent ? false : true;

        // Push message
        notifier.notify({
            title,
            message,
            sound
        });
    
    }

    // Reply
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write('true');
    res.end();

}).listen(10207);
