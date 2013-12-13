var socket;
var joinedQueue = false;
var inQ = 0;
var active = false;
var joinedbefore = false;
initSocket = function() {
//    socket = io.connect(':5000/');
    socket = io.connect('http://arcane-reaches-8269.herokuapp.com/');
    socket.on('pingback', function (data) {
        inQ = data.queuelength;
        if (inQ == 1){
            $("#queuelength").html(inQ +" person");
        } else {
            $("#queuelength").html(inQ +" people");
        }
        $("#startscreen").fadeIn();

        console.log(data);
        var idcookie = Cookies.get("userid");
        console.log("COOKIE: " + idcookie)
        idcookie = undefined;
        if (idcookie == undefined) {
//            socket.emit('newuser',function(data){
//                console.log(data);
//                Cookies.set("userid",data.id);
//                //newuserdata(data);
//                // submitNameForm();
//            });
        } else {
            socket.emit('existinguser',idcookie,function(founduser,data){
                if (!founduser) {
                    Cookies.set("userid",data.id);
//                    $("#userName").val(data.name == 'Anonymous' ? "" : data.name);
//                    $("#userInitials").val(data.initials == '' ? "" : data.initials);
                    newuserdata(data);
                    console.log(data);
                }else {
                    console.log(data);
                    newuserdata(data);
                }
            });
        }
    });

    socket.on("userstatus", function (data) {
        //console.log(data);
        newuserdata(data);
        debug("Q:"+data.queueposition,true);
        debug("a:"+data.active);
        debug("tl:"+data.timeleft);

    });

}
var sending = false;

sendColorString = function(str) {



        if (active && !sending) {
            sending = true;
            $("#btn_process").html('SENDING..');
            $("#speedmessage").fadeIn();
            socket.emit('userevent',{type:"colourstring",data:str} ,function(data) {
                console.log(data);

                setTimeout(function() {
                    $("#btn_process").html('SENT!');
                    setTimeout(function() {
                    $("#btn_process").html('SEND TO <span class="icon-christmastree"></span>');
                    },1000);
                    sending = false;
                },5000);



            });
        }


}

newuserdata = function(data) {
    $("#queuepos").html(data.queueposition+1);

    $(".timetogo").html(getTimeString(data.queuetimeleft+(data.queueposition*60*4000)));

    var secondsleft = Math.round(data.timeleft/1000);
    if (secondsleft <0)secondsleft = 0;
    $("#timelefttxt").html(secondsleft + "");
    if (data.active) {
        if (!active) {
            active = true;
            $("#startscreen").stop().hide();
            $("#endscreen").stop().hide();
            $("#waitscreen").stop().hide();
            $("#creator").fadeIn();

            $('#container').addClass('create');

            if (!joinedbefore) {
                joinedbefore = true;
                addcolour();
                addcolour();
            }
        }
    } else {
        if (active) {
            active = false;
            joinedQueue = false;
            $("#creator").hide();
            $('#container').removeClass('create');
            $("#endscreen").delay(510).fadeIn();
        }
    }

}


joinQueue = function() {
    if (!joinedQueue) {
        $("#startscreen").hide();
        $("#endscreen").hide();
        $("#waitscreen").delay(510).fadeIn();
        joinedQueue = true;
        socket.emit('newuser',function(data){
            console.log(data);
            Cookies.set("userid",data.id);
            newuserdata(data);
            // submitNameForm();
        });
    }
}

function getTimeString(ts) {
    var date = new Date(ts);
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    var milliseconds = Math.round(Number(date.getMilliseconds()/10)).toString();
    var mt = minutes;
    if (mt.length == 1) mt = "0"+mt;
    var st = seconds;
    if (st.length == 1) st = "0"+st;
    var mit = milliseconds;
    if (mit.length == 1) mit = "0"+mit;

    var ts = "";

    if (minutes > 0) ts += minutes + " minute";
    if (minutes > 1) ts += "s";
    if (minutes > 0) ts += " & ";
    if (seconds > 0) ts += seconds + " second";
    if (seconds > 1) ts += "s";

    return ts;

}