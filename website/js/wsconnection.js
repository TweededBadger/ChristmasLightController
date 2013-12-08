var socket;
var joinedQueue = false;
var inQ = 0;
var active = false;
initSocket = function() {
    socket = io.connect(':7676/');
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
//        idcookie = undefined;
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


sendColorString = function(str) {
    if (active) {
        socket.emit('userevent',{type:"colourstring",data:str} ,function(data) {
            console.log(data);
        });
    }
}

newuserdata = function(data) {
    $("#queuepos").html(data.queueposition+1);
    var secondsleft = Math.round(data.timeleft/1000);
    if (secondsleft <0)secondsleft = 0;
    $("#timeleft").html(secondsleft + " seconds left");
    if (data.active) {
        if (!active) {
            active = true;
            $("#startscreen").fadeOut(500);
            $("#endscreen").fadeOut(500);
            $("#waitscreen").fadeOut(500);
            $("#creator").delay(510).fadeIn();

            $('#container').addClass('create');

        }
    } else {
        if (active) {
            active = false;
            joinedQueue = false;
            $("#creator").fadeOut(500);
            $('#container').removeClass('create');
            $("#endscreen").delay(510).fadeIn();
        }
    }

}


joinQueue = function() {
    if (!joinedQueue) {
        $("#startscreen").fadeOut(500);
        $("#endscreen").fadeOut(500);
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