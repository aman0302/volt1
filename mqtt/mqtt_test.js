var mqtt = require('mqtt');

function mqtt_start() {
    console.log("calling mqtt");
    var client = mqtt.connect('mqtt://test.mosquitto.org');




            client.subscribe('/fvolt/sensor');

            client.publish('/fvolt/sensor', 'works');



// listen to messages coming from the mqtt broker
    client.on('message', function (topic, payload, packet) {

        console.log(topic + '=' + payload);

    });


    client.on('message', function(topic, message) {

        //console.log(message);

        console.log(topic + '=' + message);

    });

    client.on('connect', function() {
        console.log('MQTT client connected to IBM IoT Cloud.');

    });
    //handle error on connection to broker
    client.on('error', function(err) {
        console.error('client error' + err);
    });
    //handle disconnect to broker
    client.on('close', function() {
        console.log('client closed');
    });
    //handle reconnect on connection to broker
    client.on('reconnect', function(err) {
        console.error('reconnection happened');

    });

}

mqtt_start();