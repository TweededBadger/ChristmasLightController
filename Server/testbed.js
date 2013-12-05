//var Test = require("./testmodule.js");
//
//var t = new Test();
//
//console.log(t.something);
//
//t.on("test",function(data){
//    console.log(data);
//})
//
//t.init();

//var Quiz = require('./modules/quiz.js');
//
//var q = new Quiz();
//q.init();

var cp = require('child_process');

var exec = cp.exec;
var p = exec('ZombieAttack.exe');

setInterval(function() {
        console.log(p);
        process.kill(p.pid);

    }
    ,
3000);