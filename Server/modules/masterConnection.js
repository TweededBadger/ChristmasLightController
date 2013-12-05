var events = require( "events" );
var constants = require("./constants");
var net = require('net');

var server;
var masterSocket;

events.EventEmitter.call(this);

var MasterConnection = function() {
    var self = this;

    MasterConnection.prototype.sendData = function(type,data) {
        if (masterSocket) {
            var sendObject = new Object();
            sendObject.data = data;
            sendObject.type = type;
            masterSocket.write(JSON.stringify(sendObject));
        } else {
//            console.log("No Master Connection Available")
        }
    }

    startConnection = function() {
        server = net.createServer();
        server.on('listening',function(){
            console.log("TCP Listening");
        });
        server.on('connection',function(sock){
            console.log("New TCP Connection");
            masterSocket = sock;
            sock.setNoDelay(true);
            sock.setEncoding('ascii');
            sock.on('data', function(data) {
                try {
                    var parsedData = JSON.parse(data);
                    self.emit("tcpdata",parsedData);
                } catch (x) {
                    console.log("TCP INPUT DATA ERROR:");
                    console.log(x)
                }
            });
            sock.on('end', function(data) {
                console.log("Socket Ended");
                try {
                    sock.end();
                    masterSocket = null;
                }
                catch(x) {
                    lg('on end' + x);
                }
            });
            sock.on('error', function(err) {
                lg(err);
            });
            sock.on('close', function(data) {
                console.log("Socket Closed");
                try {
                    sock.end();
                    masterSocket = null;
                }
                catch(x) {
                    lg(x);
                }
                try {
                    sock.destroy();
                }
                catch(x) {
                    lg('on close' + x);
                }
            });

        });
        server.listen(constants.TCPPORT, constants.TCPIP);
    }
}

MasterConnection.prototype = new events.EventEmitter;
//MasterConnection.prototype.sendData = MasterConnection.sendData;
module.exports = MasterConnection;

MasterConnection.prototype.init = function() {
    startConnection();
}
function lg(str) {
    console.log(str);
}


