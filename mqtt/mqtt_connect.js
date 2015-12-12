
var net = require('net');
var mqtt = require('mqtt');

// create a socket object that listens on port 5000
var io = require('socket.io').listen(5000);

// create an mqtt client object and connect to the mqtt broker

function mqtt_start() {
    console.log("calling mqtt");
    var client = mqtt.connect('mqtt://test.mosquitto.org');



    io.sockets.on('connection', function (socket) {
        // socket connection indicates what mqtt topic to subscribe to in data.topic
        socket.on('subscribe', function (data) {

            console.log('Subscribing to ' + data.topic);
            socket.join(data.topic);
            client.subscribe(data.topic);
        });
        // when socket connection publishes a message, forward that message
        // the the mqtt broker
        socket.on('publish', function (data) {

            console.log('Publishing to ' + data.topic);
            client.publish(data.topic, data.payload);
        });
    });



// listen to messages coming from the mqtt broker
    client.on('message', function (topic, payload, packet) {

        console.log(topic + '=' + payload);
        io.sockets.emit('mqtt', {
            'topic': String(topic),
            'payload': String(payload)
        });
    });

/*
    client.on('message', function(topic, message) {

        //console.log(message);

        console.log(topic + '=' + message);
        io.sockets.in(topic).emit('mqtt',{'topic': String(topic), 'payload':String(message)});
    });
*/
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

exports.mqtt_start= mqtt_start;
