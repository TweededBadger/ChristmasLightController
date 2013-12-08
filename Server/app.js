var express =require('express');
var app = express()
    ,server = require('http').createServer(app)
    ,io = require('socket.io').listen(server);
var Users = require('./modules/users.js');
var MasterConnection = require('./modules/masterConnection.js');
var Quiz = require('./modules/quiz.js');

server.listen(7676);
app.use(express.static(__dirname + '/html'));

app.get('/colour', function(req, res){
    res.send(currentString);
});


var u = new Users();
u.init(io);

var currentString = "hello";

u.on('newuser',function(data){
    u.sendDataToMaster("userdata", u.users);
});
u.on('userdata',function(data){
    u.sendDataToMaster("userdata", u.users);
});
u.on('userevent',function(user,type,data){
//    u.sendDataToMaster("userevent", {
//        user:user,
//        type:type,
//        data:data
//    });

    if (type == "colourstring") {
        if (user.active) {
        console.log("NEW COLOUR STRING: " + data);
            currentString = data;
        } else {
            console.log("I REFUSE THIS COLOUR STRING!!!")
        }
    }

});
u.on('userdetails',function(data){
    u.sendDataToMaster("userdata", u.users);
});
u.on('disconnecteduser',function(data){

    m.sendData("userleft",data.id);
    u.sendDataToMaster("userleft",data.id);
    u.sendDataToMaster("userdata", u.users);
});
u.on("mastercontrol",function(data){
    switch(data) {
        case "test":
            var newquestion = q.getRandomQuestion();
            u.sendDataToAllUsers("question",newquestion);
        break;
        case "sendanswer":
            u.sendDataToAllUsers("answer", q.currentQuestion);
            u.checkQuizAnswers(q.currentQuestion);
            u.sendDataToMaster("userdata", u.users);
        break;
        case "startautoquiz":

            if (!q.autoquiz) {
                u.resetAllLives();
                u.sendDataToMaster("userdata", u.users);
                q.startAutoQuiz();
            }
         break;
        case "quizmode":
            u.sendDataToAllUsers("changemode", {mode:"quiz"});
            u.currentMode = "quiz";
         break;
        case "joystickmode":
            u.sendDataToAllUsers("changemode", {mode:"joystick"});
            u.currentMode = "joystick";
        break;
        case "vwmode":
            u.sendDataToAllUsers("changemode", {mode:"vw"});
            u.currentMode = "vw";
            break;
        case "startmode":
            u.sendDataToAllUsers("changemode", {mode:"start"});
            u.currentMode = "start";
            break;
        case "endmode":
            u.sendDataToAllUsers("changemode", {mode:"end"});
            u.currentMode = "end";
            break;
        case "hrmode":
            u.sendDataToAllUsers("changemode", {mode:"rain"});
            u.currentMode = "rain";
            break;
        case "startgame":
            var exec = require('child_process').exec;
            exec('ZombieAttack.exe');
        break;
    }
});

u.on("masterdata",function(data){
    switch(data.type) {
        case "voteoptions":
            console.log("Send vote data to all users");
            u.sendDataToAllUsers("voteoptions", data.data);
        break;
    }
});


var m = new MasterConnection();
m.init();

tick = function(){
//    console.log(u.users);
//    var temparray = new Array();
//    for (userIndex in u.users) {
//        var obj = new Object();
//        var user = u.users[userIndex];
//        obj.sid = user.id;
//        obj.id = user.idnum;
//        obj.initials = user.initials;
//        if (user.data.joystickPosition) {
//            obj.x = user.data.joystickPosition.x;
//            obj.y = user.data.joystickPosition.y;
//        } else {
//            obj.x = 0;
//            obj.y = 0;
//        }
//        temparray.push(obj);
//    }
//    m.sendData("positions",temparray);
    u.checkQueue();

}

m.on("tcpdata",function(data){
    console.log("New TCP DATA");
    console.log(data);
    if (!data.event) return;
    switch (data.event) {
        case "newzombie":
            u.sendDataToUser(data.socketid,"status",1);
            break;
        case "winner":
            u.sendDataToUser(data.socketid,"status",2);
            break;
        case "resetall":
            u.sendDataToAllUsers("status",0)
            break;
    }

});

setInterval(tick,
    1000);
//    1000/30);


var q = new Quiz();
q.init();

q.on("gotquestions",function(){
    //q.getRandomQuestion();
});


q.on("newquestion",function(question){
    u.sendDataToAllUsers("question",question);
});
q.on("questiontimeup",function(){

    var usersleft = u.checkQuizAnswers(q.currentQuestion);
    console.log(usersleft + " USERS LEFT");
    if (usersleft <= 1) {
        q.autoquiz = false;
        var winner = u.getWinner();
        u.sendDataToMaster('quizwinner',winner);
    }

    u.sendDataToAllUsers("answer", q.currentQuestion);
    u.sendDataToMaster("userdata", u.users);
});