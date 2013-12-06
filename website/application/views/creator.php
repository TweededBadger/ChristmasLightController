<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta http-equiv="x-ua-compatible" content="IE=10">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/slider.css" rel="stylesheet">
    <link href="css/jquery.minicolors.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
    <script type='text/javascript' src="js/modernizr.js"></script>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->

    <style>

    </style>
</head>


<body>

<div id="debugtxt">

</div>

<div id="container">
    <div id="startscreen">
        <h3 class="text-center">Welcome! There are currently <span id="queuelength">X people</span> in the queue.</h3>
        <button class="btn btn-default" id="btn_join">Click here to join the queue</button>
    </div>


    <div id="waitscreen">
        <h3 class="text-center">Time to wait! You are at position <span id="queuepos"></span> in the queue.</h3>
    </div>

    <div id="endscreen">
        <h3 class="text-center">Time's up! Feel free to  join the queue again!</h3>
        <button class="btn btn-default" id="btn_join2">Click here to join the queue</button>
    </div>


    <div id="streamframeholder">
        <iframe id="streamframe" width="480" height="302"
                src="http://www.ustream.tv/embed/16427450?ub=85a901&amp;lc=85a901&amp;oc=ffffff&amp;uc=ffffff&amp;v=3&amp;wmode=direct"
                scrolling="no" frameborder="0" style="border: 0px none transparent;"></iframe>
    </div>

    <div id="creator">
        <div id="gradientHolder">
            <div class="canvasHolder">
                <canvas id="testCanvas" width="240" height="40"></canvas>
            </div>
            <div id="send_button_holder">
                <button id="btn_process" class="btn">SEND COLOURS</button>
            </div>
            <div id="timeleft">X seconds remaining</div>
        </div>
        <div id="sliders">
        </div>
        <div>
            <button id="btn_add" class="btn">+</button>
        </div>
    </div>


</div>

<!--<iframe width="720" height="437" src="http://www.ustream.tv/embed/16427450?v=3&amp;wmode=direct" scrolling="no" frameborder="0" style="border: 0px none transparent;">    </iframe>-->
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="js/jquery-1.10.2.min.js"></script>
<!--<script src="js/jquery-ui-1.8.18.custom.min.js"></script>-->
<!-- Include all compiled plugins (below), or include individual files as needed -->
<!--<script src="js/bootstrap.min.js"></script>-->
<script src="js/jquery.minicolors.js"></script>
<script src="js/bootstrap-slider.js"></script>
<script src="js/tinycolor-min.js"></script>
<script src="js/socketio.js"></script>
<script src="js/wsconnection.js"></script>
<script src="js/cookies.min.js"></script>


<script type="text/javascript" src="js/createjs/events/Event.js"></script>
<script type="text/javascript" src="js/createjs/events/EventDispatcher.js"></script>
<script type="text/javascript" src="js/createjs/utils/IndexOf.js"></script>
<script type="text/javascript" src="js/easeljs/utils/UID.js"></script>
<!--<script type="text/javascript" src="js/easeljs/utils/Ticker.js"></script>-->
<script type="text/javascript" src="js/easeljs/geom/Matrix2D.js"></script>
<!--<script type="text/javascript" src="js/easeljs/geom/Point.js"></script>-->
<script type="text/javascript" src="js/easeljs/geom/Rectangle.js"></script>
<!--<script type="text/javascript" src="js/easeljs/display/Shadow.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/display/SpriteSheet.js"></script>-->
<script type="text/javascript" src="js/easeljs/display/Graphics.js"></script>
<script type="text/javascript" src="js/easeljs/display/DisplayObject.js"></script>
<script type="text/javascript" src="js/easeljs/display/Container.js"></script>
<script type="text/javascript" src="js/easeljs/display/Stage.js"></script>
<script type="text/javascript" src="js/easeljs/display/Bitmap.js"></script>
<!--<script type="text/javascript" src="js/easeljs/display/Sprite.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/display/BitmapAnimation.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/display/BitmapText.js"></script>-->
<script type="text/javascript" src="js/easeljs/display/Shape.js"></script>
<!--<script type="text/javascript" src="js/easeljs/display/Text.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/display/DOMElement.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/events/MouseEvent.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/filters/Filter.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/ui/ButtonHelper.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/ui/Touch.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/utils/SpriteSheetUtils.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/utils/SpriteSheetBuilder.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/filters/BlurFilter.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/filters/ColorMatrix.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/filters/ColorMatrixFilter.js"></script>-->
<!--<script type="text/javascript" src="js/easeljs/filters/AlphaMaskFilter.js"></script>-->


<script>


var stage;

var rect;
var count = 0;
var colors = [];
var theLoc;
init = function () {

    stage = new createjs.Stage("testCanvas");
    rect = new createjs.Shape();
    rect.graphics.beginLinearGradientFill(["rgba(255,0,0,1)", "rgba(0,255,0,1)"], [0, 1], 0, 0, 240, 0).drawRect(0, 0, 240, 100);
    stage.addChild(rect);

    stage.update();

    $("#btn_add").click(addcolour);
    $("#btn_process").click(processColor);
    $("#btn_join").click(joinQueue);
    $("#btn_join2").click(joinQueue);


    $("#sliders").delegate("button", "click", function (event) {

        var type = $(this).data("type");
        var id = $(this).data("id");
        switch (type) {
            case "delete":
                removeColour(id);
                break;
            case "copy":
                addcolour(null, $("#cp" + id).val(), id);
                break
        }
    });


//        theLoc = $('#sliders').position().top;
    theLoc = 5;
    $(window).scroll(function () {
        if (theLoc >= $(window).scrollTop()) {
            //if($('#gradientHolder').hasClass('fixed')) {
            $('#gradientHolder').removeClass('fixed');
            $('#container').removeClass('fixed');
            $('#streamframeholder').removeClass('fixed');
            //}
        } else {
            //if(!$('#gradientHolder').hasClass('fixed')) {
            $('#gradientHolder').addClass('fixed');
            $('#container').addClass('fixed');
            $('#streamframeholder').addClass('fixed');
            //}
        }
    });

    initSocket();
}

debug = function (str, clear) {
    if (clear) $("#debugtxt").html('');
    $("#debugtxt").html($("#debugtxt").html() + "<br>" + str);
}

var intensity = 0.3;
processColor = function () {
    rect.cache(0, 0, 240, 100);
    var data = rect.cacheCanvas.getContext("2d").getImageData(0, 0, 240, 1);

    var outstring = "";

    for (var i = 0; i < 240; i++) {

        var r = Math.round(data.data[i * 4] * intensity);
        var g = Math.round(data.data[(i * 4) + 1] * intensity);
        var b = Math.round(data.data[(i * 4) + 2] * intensity);
        var a = Math.round(data.data[(i * 4) + 3] * intensity);
        //console.log( r + "," + g + "," + b + "," + a);

        outstring += "i" + (i + 1) + "r" + r + "g" + g + "b" + b;

    }
    console.log(outstring);

//    $.post("data/set?val=" + outstring, function () {
//        //alert( "success" );
//    });

    sendColorString(outstring);

}
removeColour = function (id) {
    var toremove;
    for (var o in colors) {
        console.log(colors[o]);
        console.log(o);
        if (colors[o].id == id) toremove = o;
    }
    colors.splice(toremove, 1);
    $("#h" + id).remove();
    slide();
}
addcolour = function (e, colorvalue, copyid) {
    var id = "slider" + count;
    var cid = "cp" + count;
    var pid = "p" + count;
    var hid = "h" + count;
    var startColor = "#000000";
    if (colorvalue) {
        startColor = colorvalue;
    } else {
        startColor = tinycolor.random().toHexString();
        console.log(tinycolor.random().toHexString());
    }

    $.minicolors.defaults.defaultValue = startColor;

    console.log(startColor);

    sliderhtml = '<div class="sliderholder"  id="' + hid + '" >' +
            '<div class="triangle"></div> ' +
            '<button class="btn copy" data-id=' + count + ' data-type="copy" ><span class="glyphicon glyphicon-book"></span></button>' +
            '<input id="' + cid + '" data-defaultvalue="' + startColor + '"/>' +
            '<button class="btn delete" data-id=' + count + ' data-type="delete" ><span class="glyphicon glyphicon-remove"></span></button>' +
            '<div><input id="' + id + '" data-slider-id="the' + id + '" type="text" data-slider-tooltip="hide" data-slider-min="0" data-slider-max="240" data-slider-step="1" data-slider-value="0"/></div></div>'

    if (copyid) {
        $(sliderhtml).insertAfter("#h" + copyid);
    } else {
        $("#sliders").append($(sliderhtml));
        window.scrollTo(0, document.body.scrollHeight);
    }


    //$( "<p>Test</p>" ).insertAfter( ".inner" );


    var s = $("#" + id).slider({value:Math.random() * 255}).on('slide', slide).data('slider');

    var cp = $("#" + cid).minicolors({
                change:function (hex, opacity) {
                    //console.log(hex + ' - ' + opacity);
                    slide();
                }  }
    );


    var c = new SColor();
    c.slider = s;
    c.holder = $("#" + hid);
    c.colorpicker = cp;
    c.id = count;
    colors.push(c);
    count++;

    slide();
}

slide = function () {
//        var r = s.getValue()/240;
//        var r2 = s2.getValue()/240;
    rect.uncache();
    var gradients = buildGradientArray();
    var colors = buildColorArray();

    rect.graphics.clear();
    rect.graphics.beginLinearGradientFill(colors, gradients, 0, 0, 240, 0).drawRect(0, 0, 240, 120);


    stage.update();
}

buildGradientArray = function () {
    var garray = [];
    for (var o in colors) {
        var val = colors[o].slider.getValue() / 240;
        garray.push(val);
    }
    return garray;
}
buildColorArray = function () {
    var carray = [];
    for (var o in colors) {
        var val = colors[o].colorpicker.val();
        carray.push(val);
        $(colors[o].slider.handle1).css("background-color", colors[o].colorpicker.val());
        $(colors[o].slider.handle1).css("background-image", "none");

        $(colors[o].holder).find(".triangle").css("border-color", colors[o].colorpicker.val() + " transparent transparent transparent");

        // .sliderholder .triangle

    }
    return carray;

}

SColor = function () {
    this.slider;
    this.colorpicker;
}

$(document).ready(init);


</script>
</body>
</html>