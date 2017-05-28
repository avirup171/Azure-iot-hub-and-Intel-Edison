/*
 * Blank IoT Node.js starter app.
 *
 * Use this template to start an IoT Node.js app on any supported IoT board.
 * The target board must support Node.js. It is helpful if the board includes
 * support for I/O access via the MRAA and UPM libraries.
 *
 * <https://software.intel.com/en-us/xdk/docs/using-templates-nodejs-iot>
 */

/* spec jslint and jshint lines for desired JavaScript linting */
/* see http://www.jslint.com/help.html and http://jshint.com/docs */
/* jslint node:true */
/* jshint unused:true */

"use strict" ;


var mraa = require("mraa") ;
var sense= new mraa.Aio(0);
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

//
//
//
var connectionString="HostName=mcu.azure-devices.net;DeviceId=edisonAvirup;SharedAccessKey=LXyvqh0UMIwnBsYIpbkOF4NhTO6wyGveSy/NcFy4pig=";
var client = Client.fromConnectionString(connectionString, Protocol);
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
    });
  }
};
client.open(connectCallback);




function lightRead()
{
    var lightVal= sense.read();
    //console.log(lightVal);
    var obj= {"lightVal":lightVal};
    var json= JSON.stringify(obj);
    var message = new Message(json);
    client.sendEvent(message, printResultFor('send'));
    console.log(json);
    setInterval(lightRead,10000);
}
lightRead();
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}