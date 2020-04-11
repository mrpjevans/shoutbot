# Shoutbot

Easy, lightweight HTTP server to display desktop notification service for macOS (and possibly others).

## Installation

```bash
git clone https://github.com/mrpjevans/shoutbot.git
cd shoutbot
npm install
cp config-example.js config.js
nano config.js
```

Read through the config file carefully to set everything up.

## Usage

Everything is optional. You can even send an empty request instead of a JSON payload.

```
POST /notify

{
    "title": "Notification title",
    "message": "Notification message",
    "sound": true
    "icon": "myicon.png"
}
```

## Icons

Place any icons you wish to use in the `/icons` directory. You don't need to specify the path in the payload.
`notify.png` is used by default.

## SSL

SSL certificates are supported. Place them in the `/certs` directory. To create your own self-signed certificate:

```
openssl genrsa -out privatekey.pem 1024
openssl req -new -key privatekey.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```

## Doorbot

In the `/doorbot_esp32` directory is an ESP32 C++ Arduino sketch for a door monitor project that sends a notification
to Shoutbot whenever a door is opened. A magnetic reed switch is connected to P15 and GND.

## Attibution for icons/notify.png

notification by Bruno from the Noun Project
https://thenounproject.com/term/notification/24628/
