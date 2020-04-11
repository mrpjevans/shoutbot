/*
  Acknowledgment of code on HTTP POSTing:
  Complete project details at Complete project details at https://RandomNerdTutorials.com/esp32-http-get-post-arduino/

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  Everything else @mrpjevans
*/

#include <WiFi.h>
#include <HTTPClient.h>

// Settings
const char* ssid = "YOU_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverName = "http://<SHOUTBOT_IP_ADDRESS>:10207/notify";

// Set up
int sensorPin = 15;
int sensorValue = 0;
int doorOpened = false;

void connectToWiFi() {
  // Connect to WiFi
  Serial.println("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());  
}

void sendToShoutbot() {
  
  HTTPClient http;    
  http.begin(serverName);

  http.addHeader("Content-Type", "application/json");
  String httpRequestData = "{\"title\":\"Doorbot\",\"message\":\"Knock, knock!\"}";

  Serial.println("Sending notification");
  int httpResponseCode = http.POST(httpRequestData);
      
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
        
  http.end();

}

void setup() {
  Serial.begin(115200);
  pinMode(sensorPin, INPUT_PULLUP);

  connectToWiFi();
  
  // Set intial state
  doorOpened = digitalRead(sensorPin) == 1;
  Serial.println("Ready");

}

void loop() {

  sensorValue = digitalRead(sensorPin);

  // Is the door open?
  if (sensorValue == 1 && !doorOpened) {

    Serial.println("Door opened");
    doorOpened = true;

    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
  
      sendToShoutbot();
      
      // Debounce
      delay(500);
      
    } else {

      connectToWiFi();
 
    }
    
  } else if (sensorValue == 0 && doorOpened) {

    Serial.println("Door closed");
    doorOpened = false;

    // Debounce
    delay(500);

  }
  
}
