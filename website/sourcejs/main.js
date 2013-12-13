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


    //theLoc = $("#creator").offset().top;
//    theLoc = 50;
    $(window).scroll(function () {
        theLoc = $("#creator").offset().top;
        console.log(theLoc);
        if (theLoc >= $(window).scrollTop()) {
            //if($('#gradientHolder').hasClass('fixed')) {
            $('#gradientHolder').removeClass('fixed');
            $('#container').removeClass('fixed');
            $('#streamframeholder').removeClass('fixed');
            $('#sliders').removeClass('fixed');
            $('#creator').removeClass('fixed');
            //}
        } else {
            //if(!$('#gradientHolder').hasClass('fixed')) {
            $('#gradientHolder').addClass('fixed');
            $('#container').addClass('fixed');
            $('#streamframeholder').addClass('fixed');
            $('#sliders').addClass('fixed');
            $('#creator').addClass('fixed');
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
    var scale = 8;

    for(var j = 0; j < scale; j++) {
        for (var i = 0; i < 240/scale; i++) {

            var r = Math.round(data.data[i * 4* scale] * intensity);
            var g = Math.round(data.data[(i * 4* scale) + 1] * intensity);
            var b = Math.round(data.data[(i * 4* scale) + 2] * intensity);
            var a = Math.round(data.data[(i * 4* scale) + 3] * intensity);
            //console.log( r + "," + g + "," + b + "," + a);

            outstring += "i" + ((i + 1)+(j*240/scale)) + "r" + r + "g" + g + "b" + b;

        }
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
        '<button class="btn copy" data-id=' + count + ' data-type="copy" ><span class="icon-copy"></span></button>' +
        '<input id="' + cid + '" data-defaultvalue="' + startColor + '"/>' +
        '<button class="btn delete" data-id=' + count + ' data-type="delete" ><span class="icon-trash"></span></button>' +
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
    this.slider = null;
    this.colorpicker = null;
}

$(document).ready(init);