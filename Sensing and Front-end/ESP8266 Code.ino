#include <Adafruit_SHT31.h>
#include <Adafruit_BusIO_Register.h>
#include <Adafruit_I2CDevice.h>
#include <Adafruit_I2CRegister.h>
#include <Adafruit_SPIDevice.h>
#include <Wire.h>

#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <WiFiClient.h>
#include <FS.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>





Adafruit_SHT31 sht31 = Adafruit_SHT31();

const char *ssid = "NestAware";
const char *password = "NestAware";

int linecountFile = 4958;

unsigned long previousMillis = 0;    // will store last time DHT was updated
const long interval = 10000;  


AsyncWebServer server(80);

String getGraphData(int numDays, int readingsShown) {
  int linecount = 4959;
  int currentcount = 0;
  int timeBetweenReadings = 30; // time measured in minutes
  int idealTempMax = 35;
  int idealTempMin = 15;
  int maxTemp = 0;
  int minTemp = 100;
  int readingsInRange = 0;
  int totalreadings = 0;
  int maxHumidity = 0;
  int minHumidity = 100;


  // IMPORTANT MUST BE CHANGED AT SOME POINT
  int CURRENTINDEXNUMBER = 2500;
  int numReadingsToAverage = numDays*24*60/(readingsShown*timeBetweenReadings);
  int howmanyreadingsTaken = 0;
  // Create JSON arrays
  String json = "[";
  String tempAverages = "";
  String humidityAverages = "";
  String tempLows = "";
  String humidityLows = "";

//Serial.println(CURRENTINDEXNUMBER -numReadingsToAverage*readingsShown);
  File file = SPIFFS.open("/SensorData.txt", "r");


  if (file) {
    float tempReadings[numReadingsToAverage] = {0};
    float humidityReadings[numReadingsToAverage] = {0};
    int readingIndex = 0;
    String line;

    //while (file.available()) {
    //while (totalreadings < numDays*24*60/timeBetweenReadings && file.available()) {
    while (file.available()) {

      //Serial.println("Here4");
      line = file.readStringUntil('\n');
      //Serial.println(line);
      if (line.length() == 0) {
        // Reached the end of the file
        break;
      }
      totalreadings = totalreadings + 1;
      int index;
      float temp, humidity;
      sscanf(line.c_str(), "%d,%f,%f", &index, &temp, &humidity);


      if (index < (CURRENTINDEXNUMBER -numReadingsToAverage*readingsShown )) {
        continue;
      }

      //checking maximums
      if (temp > maxTemp)
      {
        maxTemp = temp;
      }
      if (humidity > maxHumidity)
      {
        maxHumidity = humidity;
      }

      //checking minimums
      if (temp < minTemp)
      {
        minTemp = temp;
      }
      if (humidity < minHumidity)
      {
        minHumidity = humidity;
      }

      if (idealTempMin <= temp and temp <= idealTempMax)
      {
        readingsInRange = readingsInRange + 1;
      }

      tempReadings[readingIndex] = temp;
      humidityReadings[readingIndex] = humidity;
      readingIndex++;
      // 
      
      if (readingIndex == numReadingsToAverage ) {
//        // Calculate average temperature
//        float tempSum = 0;
//        for (int i = 0; i < numReadingsToAverage; i++) {
//          tempSum += tempReadings[i];
//        }
//        float averageTemp = tempSum / numReadingsToAverage;
//        tempAverages += String(averageTemp) + ",";
//
//        // Calculate average humidity
//        float humiditySum = 0;
//        for (int i = 0; i < numReadingsToAverage; i++) {
//          humiditySum += humidityReadings[i];
//        }
//        float averageHumidity = humiditySum / numReadingsToAverage;
//        humidityAverages += String(averageHumidity) + ",";
//
//        readingIndex = 0;
//        howmanyreadingsTaken = howmanyreadingsTaken+1;
        //        // Calculate average temperature
        
        float localtempmax = 0;
        float localtempmin = 100;
        for (int i = 0; i < numReadingsToAverage; i++) {
          if ( tempReadings[i] > localtempmax ) {
            localtempmax = tempReadings[i];
          }
          if ( tempReadings[i] < localtempmin ) {
            localtempmin = tempReadings[i];
          }
        }
        tempAverages += String(localtempmax) + ",";
        tempLows  += String(localtempmin) + ",";
        // Calculate average humidity
        float localhumiditymax = 0;
        float localhumiditymin = 100;
        for (int i = 0; i < numReadingsToAverage; i++) {
          //Serial.println("DEBUG");
         // Serial.println("Current:"+String(humidityReadings[i]));
          //Serial.println("Local:"+String(localhumiditymax));
          //Serial.println(localhumiditymax > humidityReadings[i]);

          //Serial.println("END DEBUG");
          if ( humidityReadings[i] > localhumiditymax ){
            localhumiditymax = humidityReadings[i];
          }
          if ( humidityReadings[i] < localhumiditymin ){

             localhumiditymin =  humidityReadings[i];
          }
        }
        //Serial.println(localhumiditymax);
        //Serial.println(localhumiditymin);
        humidityAverages += String(localhumiditymax) + ",";
        humidityLows += String(localhumiditymin) + ",";

        readingIndex = 0;
        howmanyreadingsTaken = howmanyreadingsTaken+1;
      }
      
      if (howmanyreadingsTaken == readingsShown) {
        Serial.println("STOP AFTER THIS LINERATION");
        break;
      }
      
      if (index == 2500) {
        Serial.println("STOP AFTER THIS LINERATION");
        break;
      }
    }

    file.close();
  } else {
    Serial.println("Error opening sensorData.txt");
  }

  // Remove the trailing comma from the averages strings
  tempAverages.remove(tempAverages.length() - 1);
  humidityAverages.remove(humidityAverages.length() - 1);
  tempLows.remove(tempLows.length() - 1);
  humidityLows.remove(humidityLows.length() - 1);
  // Write the averages to the JSON data
  json += "{\"temps\":[" + tempAverages + "],\"humidities\":[" + humidityAverages + "],\"humiditiesLows\":[" + humidityLows + "],\"tempLows\":[" + tempLows + "]";
  json += ",\"maxTemp\": ["+String(maxTemp)+"]"+",\"minTemp\": ["+String(minTemp)+"]"+",\"readingsInRange\": ["+String(readingsInRange)+"]"+",\"totalreadings\": ["+String(totalreadings)+"]"+",\"maxHumidity\": ["+String(maxHumidity)+"]"+",\"minHumidity\": ["+String(minHumidity)+"]";
  json += "}]";
  //Serial.println(json);
  //Serial.printf("maxTemp: %d, minTemp: %d, readingsInRange: %d, totalreadings: %d, maxHumidity: %d, minHumidity: %d\n", maxTemp, minTemp, readingsInRange, totalreadings, maxHumidity, minHumidity);
  return json;
}

void setup() {


  Serial.begin(115200);
  Serial.println();
  Serial.print("Configuring access point...");
  /* You can remove the password parameter if you want the AP to be sopen. */
  WiFi.softAP(ssid, password);

  if (!SPIFFS.begin()) {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  server.on("/SensorData.txt", HTTP_GET, [](AsyncWebServerRequest * request) {
    Serial.println("Downloading File");
    request->send(SPIFFS, "/SensorData.txt");
  });




  // RECIEVER FOR API FOR GRAPH DATA All
  server.on("/api/getGraphDataAll", HTTP_POST, [](AsyncWebServerRequest * request) {
    Serial.println("Here0");
    Serial.println(request->params());

    String json = getGraphData(50, 50);
    request->send(200, "application/json", json);
  });


  // RECIEVER FOR API FOR GRAPH DATA 30 DAYS
  server.on("/api/getGraphData30", HTTP_POST, [](AsyncWebServerRequest * request) {
    Serial.println("Here0");
    Serial.println(request->params());

    String json = getGraphData(30,60 );
    request->send(200, "application/json", json);
  });


  // RECIEVER FOR API FOR GRAPH DATA 7 DAYS
  server.on("/api/getGraphData7", HTTP_POST, [](AsyncWebServerRequest * request) {
    Serial.println(request->params());
    String json = getGraphData(7,42);
    request->send(200, "application/json", json);
  });

  // RECIEVER FOR API FOR GRAPH DATA 1 DAYS
  server.on("/api/getGraphData1", HTTP_POST, [](AsyncWebServerRequest * request) {
    Serial.println(request->params());
    String json = getGraphData(1, 48);
    request->send(200, "application/json", json);
  });

  // Route for root / web page


  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    Serial.println("Here_Index");
    request->send(SPIFFS, "/index.html");
  });

  server.on("/assets/bootstrap/css/bootstrap.min.css", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/bootstrap.min.css", "text/css");
  });

  server.on("/assets/fonts/fontawesome-all.min.css", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/fontawesome-all.min.css", "text/css");
  });


  server.on("/assets/fonts/line-awesome.min.css", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/line-awesome.min.css", "text/css");
  });

  server.on("/assets/css/styles.min.css", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/styles.min.css", "text/css");
  });

  //   server.on("/jquery.min.js", HTTP_GET, [](AsyncWebServerRequest *request){
  //   request->send(SPIFFS, "/jquery.min.js", "application/javascript");
  //});

  server.on("/index.js", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/index.js", "application/javascript");
  });

  server.on("/assets/bootstrap/js/bootstrap.min.js", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/bootstrap.min.js", "application/javascript");
  });

  server.on("/chart.min.js", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/chart.min.js", "application/javascript");
  });

  server.on("/assets/js/script.min.js", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/script.min.js", "application/javascript");
  });

  server.on("/assets/img/Logosmall.png", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/Logosmall.png", "image/png");
  });


  server.on("/assets/fonts/fa-solid-900.woff2", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/fa-solid-900.woff2", "font/woff2");
  });

  server.on("/assets/fonts/fa-brands-400.woff2", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/fa-brands-400.woff2", "font/woff2");
  });



  server.on("/assets/fonts/line-awesome.woff2", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/line-awesome.woff2", "font/woff2");
  });

  // Route to load style.css file
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/style.css", "text/css");
  });
  // Start server
  server.begin();
  Serial.println("ESP32 Web server started");
   pinMode(D6, OUTPUT); // Set D6 pin as output
}

void loop() {

   linecountFile = linecountFile +1;
  


      if (! sht31.begin(0x44)) {   // Set to 0x45 for alternate i2c addr
      Serial.println("Couldn't find SHT31");
      while (1) delay(1);
      }

  float temp = sht31.readTemperature();
  float hum = sht31.readHumidity();

//  if (! isnan(temp)) { 
//    Serial.print("Temperature(°C): "); 
//    Serial.print(temp); 
//    Serial.print("\t\t");
//  } else { 
//    Serial.println("Failed to read temperature!");
//  }
//  
//  if (! isnan(hum)) {  
//    Serial.print("Humidity(%): "); 
//    Serial.println(hum);
//  } else { 
//    Serial.println("Failed to read humidity!");
//  }


  File f = SPIFFS.open("/SensorData.txt", "a");
  f.printf("%d,%.2f,%.1f\n",linecountFile,temp,hum);
  f.close(); 
  Serial.printf("Writing to file:%d,%.2f,%.1f\n",linecountFile,temp,hum);
  
   if (temp > 25) { // Check if value2 is greater than value1
    digitalWrite(D6, HIGH); // Set D6 pin to HIGH
    Serial.println("Nest is too hot, TEC ON");
  } else {
    digitalWrite(D6, LOW); // Set D6 pin to LOW
     Serial.println("Nest is cool, TEC OFF");

     delay(1500);
  }
  
  delay(1000);

  
  
}
