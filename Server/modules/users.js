var functions = require("./functions.js");
var constants = require("./constants");
var io;
var events = require( "events" );

events.EventEmitter.call(this);

var usersObject = new Object();
var sockets = new Object();

var idnum = 1;



var Users = function() {
    var self = this;
    self.currentMode = 'start';
    self.gamestate = new Object();
//    usersObject = new Object();

    setupSocket = function() {
        io.sockets.on('connection', function (socket) {


            sockets[socket.id] = socket;

            console.log("new connection");
            socket.join("room");
            socket.emit('pingback', {
                mode:self.currentMode
            });


            socket.on('test', function () {
                /*var user = usersObject[socket.userid];
                if (user) {
                    user.data.quizlives = 0;
                    self.sendDataToMaster("userdata",self.users);
                }*/

                socket.emit("status",1);

            });


            socket.on('action',function(data){
                console.log("MASTER CONTROLS");
                console.log(data);
                self.emit("mastercontrol",data);
            });

            socket.on('masterdata',function(data){
                console.log("MASTER DATA");
                console.log(data);
                self.emit("masterdata",data);
            });


            socket.on('registermaster',function(data){
                console.log("REGISTER MASTER");
                socket.join("master");

                self.sendDataToMaster("userdata",self.users);

            });
            socket.on('userdata', function (data) {
                if (data.type) {
                    var user = usersObject[socket.userid];
                    if (user) {
                        user.data[data.type] = data.data;
                        self.emit("userdata",user,data.type,data.data);
                    } else {
                        console.log("user doesn't exist!")
                    }
                } else {
                    console.log("not valid user data");
                }
            });
            socket.on('userevent', function (data) {
                if (data.type) {
                    console.log("USER EVENT");
                    console.log(data);

                    var user = usersObject[socket.userid];
                    self.emit("userevent",user,data.type,data.data);
                } else {
                    console.log("not valid event data");
                }
            });
            socket.on('userdetails', function (data) {
                if (data.name) {
                    var user = usersObject[socket.userid];
                    if (user) {
                        user.name = data.name;
                        user.initials = data.initials.toUpperCase();
//                        user.initials = user.idnum.toString();
                        self.emit("userdetails",user,data);
                    } else {
                        console.log("user doesn't exist!")
                    }
                }
            });
            socket.on('newuser', function (fn) {
                console.log("Brand new user");
                var newuser = createNewUser(socket);
                fn(newuser);
                self.emit("newuser",newuser);
            });
            socket.on('existinguser', function (idfromcookie,fn) {
                var olduser = usersObject[idfromcookie];
                if (olduser == undefined) {
                    console.log("Old user doesn't exist. Create new one.");
                    fn(false,createNewUser(socket));
                } else {
                    console.log("Found user!");
                    olduser.socket = socket.id;
                    olduser.connected = true;
                    socket.userid = olduser.id;
                    fn(false,olduser);
                }
                console.log(usersObject);
            });
            socket.on('disconnect', function (data) {
                console.log("user disconnected: " +socket.userid);
                delete sockets[socket.id];
                if (socket.userid != undefined) {
                    var disconnectedUser = usersObject[socket.userid];
                    if (disconnectedUser) {
                        disconnectedUser.connected = false;
                        disconnectedUser.disconnectedtime = new Date().getTime();
                    }
                }
            });
        });
    }
    destroyUser = function(user) {
        console.log("Destroying User:")
        console.log(user)
        user.socket = undefined;
        delete usersObject[user.id];
        self.emit("disconnecteduser",user);
    }

    tick = function() {
        checkUserConnections();
        //console.log(usersObject);
//        self.emit("test",true);
    }

    checkUserConnections = function() {
        var currenttime = new Date().getTime();
        for (var index in usersObject) {
            var user = usersObject[index];
            if (!user.connected) {
                var dtime = currenttime -user.disconnectedtime;
                if (dtime > constants.usertimeout) {
                    destroyUser(user);
                }
            }
        }
//        console.log("Users: "+Object.keys(usersObject).length);
    }

    createNewUser = function(socket) {
        var user = new User();
        user.socket = socket.id;
        user.id = functions.randomString(20);
        user.idnum = idnum;
        idnum++;
        socket.userid = user.id;
        usersObject[user.id] = user;
        sockets[socket.id] = socket;
        return user;
    }

    Users.prototype.sendDataToUser = function(userid,type,data) {
        var user = usersObject[userid];
        if(user) {
            if (user.connected) {
                var usersocket = sockets[user.socket];
                usersocket.emit(type,data);
            }
        }
    }
    Users.prototype.sendDataToAllUsers = function(type,data) {
        io.sockets.in('room').emit(type,data);
    }
    Users.prototype.sendDataToMaster = function(type,data) {
        io.sockets.in('master').emit(type,data);
    }

    User = function() {
        this.name = 'Anonymous';
        this.initials = '';
        this.socket;
        this.id;
        this.data = new Object();
        this.disconnectedtime;
        this.connected = true;
        this.idnum = 0;
        this.data.avatarid = 0;


        this.data.quizlives = constants.STARTQUIZLIVES;
    }

    setInterval(tick,1000);

    //QUIZ STUFF

    Users.prototype.resetAllLives = function() {
        for (var u in usersObject) {
            var user = usersObject[u];
            user.data.quizlives = constants.STARTQUIZLIVES;
            var usersocket = sockets[user.socket];
            if (usersocket) {
                usersocket.emit("userstatus",user);
            } else {
                console.log("No socket for user!")
            }
        }
    }

    Users.prototype.getWinner = function() {
        var usersleft = 0;
        var winner = false;
        for (var u in usersObject) {
            var user = usersObject[u];
            if (user.data.quizlives >0) {
                usersleft++;
                winner = user;
            }
        }

        return winner;
    }
    Users.prototype.checkQuizAnswers = function(question) {
        //io.sockets.in('room').emit(type,data);

        var usersleft = 0;

        for (var u in usersObject) {
            var user = usersObject[u];
            if (!user.data.quizscore) {
                user.data.quizscore = 0;
            }
            if (user.data.quizanswer) {
                if (user.data.quizanswer.aid == question.aid &&
                    user.data.quizanswer.qid == question.id ) {
                    user.data.quizscore++;
                } else if (user.data.quizanswer.qid == question.id){
                    user.data.quizlives--;
                }
                user.data.quizanswer = undefined;
            } else {
                user.data.quizlives--;
            }

            if (user.data.quizlives <0) user.data.quizlives = 0;

            if (user.data.quizlives >0) usersleft ++;

            var usersocket = sockets[user.socket];
            if (usersocket) {
                usersocket.emit("userstatus",user);
            } else {
                console.log("No socket for user!")
            }
        }
        self.gamestate.usersleft = usersleft;

        return usersleft;
    }



}

Users.prototype = new events.EventEmitter;
Users.prototype.users = usersObject;
module.exports = Users;

Users.prototype.init = function(_io) {
   io = _io;
    io.set('log level', 1);
   setupSocket();
}






//module.exports = controller;