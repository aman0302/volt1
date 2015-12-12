var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt');

// create a socket object that listens on port 5000
var io = require('socket.io').listen(5000);

// create an mqtt client object and connect to the mqtt broker

function mqtt_start() {
    console.log("calling mqtt");
    var client = mqtt.connect('mqtt://broker.mqttdashboard.com');
    client.options.reconnectPeriod = 0;


    io.sockets.on('connection', function (socket) {
        // socket connection indicates what mqtt topic to subscribe to in data.topic
        socket.on('subscribe', function (data) {

            console.log('Subscribing to ' + data.topic);
            socket.join(data.topic);
            client.subscribe(data.topic);
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


    client.on('message', function(topic, message) {

        //console.log(message);
        //sys.puts(topic+'='+message);
        console.log(topic + '=' + message);
        io.sockets.in(topic).emit('mqtt',{'topic': String(topic), 'payload':String(message)});
    });


}


exports.mqtt_subscribe= mqtt_subscribe;
