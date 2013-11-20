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
    <script type='text/javascript' src="js/modernizr.js"></script>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->

    <style>
        body {
            margin: 1em;
        }
        #sliders {
            width: 100%;
        }
        #slider {
            width: 200px;
        }
        .slider {
            width: 90% !important;
        }
        #testCanvas {
            width: 90%;
            /*max-width: 600px;*/
        }
        
        .minicolors-theme-default .minicolors-input {
            height: 30px;
            width: 0px;
            display: inline-block;
            padding-left: 26px;
        }
    </style>
</head>


<body>
<div class="canvasHolder">
    <canvas id="testCanvas" width="240" height="40"></canvas>
</div>
<div id="sliders">

</div>
<div>
    <button id="btn_add">+</button>
</div>


<div>
    <button id="btn_process">MAGIC!</button>
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


<script type="text/javascript" src="js/createjs/events/Event.js"></script>
<script type="text/javascript" src="js/createjs/events/EventDispatcher.js"></script>
<script type="text/javascript" src="js/createjs/utils/IndexOf.js"></script>
<script type="text/javascript" src="js/easeljs/utils/UID.js"></script>
<script type="text/javascript" src="js/easeljs/utils/Ticker.js"></script>
<script type="text/javascript" src="js/easeljs/geom/Matrix2D.js"></script>
<script type="text/javascript" src="js/easeljs/geom/Point.js"></script>
<script type="text/javascript" src="js/easeljs/geom/Rectangle.js"></script>
<script type="text/javascript" src="js/easeljs/display/Shadow.js"></script>
<script type="text/javascript" src="js/easeljs/display/SpriteSheet.js"></script>
<script type="text/javascript" src="js/easeljs/display/Graphics.js"></script>
<script type="text/javascript" src="js/easeljs/display/DisplayObject.js"></script>
<script type="text/javascript" src="js/easeljs/display/Container.js"></script>
<script type="text/javascript" src="js/easeljs/display/Stage.js"></script>
<script type="text/javascript" src="js/easeljs/display/Bitmap.js"></script>
<script type="text/javascript" src="js/easeljs/display/Sprite.js"></script>
<script type="text/javascript" src="js/easeljs/display/BitmapAnimation.js"></script>
<script type="text/javascript" src="js/easeljs/display/BitmapText.js"></script>
<script type="text/javascript" src="js/easeljs/display/Shape.js"></script>
<script type="text/javascript" src="js/easeljs/display/Text.js"></script>
<script type="text/javascript" src="js/easeljs/display/DOMElement.js"></script>
<script type="text/javascript" src="js/easeljs/events/MouseEvent.js"></script>
<script type="text/javascript" src="js/easeljs/filters/Filter.js"></script>
<script type="text/javascript" src="js/easeljs/ui/ButtonHelper.js"></script>
<script type="text/javascript" src="js/easeljs/ui/Touch.js"></script>
<script type="text/javascript" src="js/easeljs/utils/SpriteSheetUtils.js"></script>
<script type="text/javascript" src="js/easeljs/utils/SpriteSheetBuilder.js"></script>
<script type="text/javascript" src="js/easeljs/filters/BlurFilter.js"></script>
<script type="text/javascript" src="js/easeljs/filters/ColorMatrix.js"></script>
<script type="text/javascript" src="js/easeljs/filters/ColorMatrixFilter.js"></script>
<script type="text/javascript" src="js/easeljs/filters/AlphaMaskFilter.js"></script>


<script>



    var stage;

    var rect;
    var count = 0;
    var colors = [];
    init = function() {

        

        stage = new createjs.Stage("testCanvas");
        rect = new createjs.Shape();
        rect.graphics.beginLinearGradientFill(["rgba(255,0,0,1)","rgba(0,255,0,1)"], [0, 1], 0, 0, 240, 0).drawRect(0, 0, 240, 100);
        stage.addChild(rect);

        stage.update();

        $("#btn_add").click(addcolour);
        $("#btn_process").click(processColor);
        
        
        $("#sliders").delegate("button", "click", function (event) {
            
            
            var id = $(this).data("id");
            
            
           addcolour(null,$("#cp"+id).val());
        
        });
    }

    processColor = function() {
        rect.cache(0, 0, 240, 100);
        var data = rect.cacheCanvas.getContext("2d").getImageData(0, 0, 240, 1);

        var outstring = "";

        for (var i = 0; i < 240; i++) {



            var r = data.data[i*4];
            var g = data.data[(i*4)+1];
            var b = data.data[(i*4)+2];
            var a = data.data[(i*4)+3];
            //console.log( r + "," + g + "," + b + "," + a);

            outstring += "i"+(i+1)+"r"+r+"g"+g+"b"+b;

        }
        console.log(outstring);
        
        $.post( "data/set?val="+outstring, function() {
            alert( "success" );
          });
    }

    addcolour = function(e,colorvalue) {
        var id = "slider"+count;
        var cid = "cp"+count;
        var pid = "p"+count;
        var startColor = "#000000";
        if (colorvalue) startColor = colorvalue;
        
        $.minicolors.defaults.defaultValue = startColor;
        
        console.log(startColor);
        $( "#sliders" ).append( $( '<div class="sliderholder"><input id="'+cid+'" data-defaultvalue="'+startColor+'"/><input id="'+id+'" data-slider-id="the'+id+'" type="text" data-slider-tooltip="hide" data-slider-min="0" data-slider-max="240" data-slider-step="1" data-slider-value="0"/><button class="btn" data-id='+count+' ><span class="glyphicon glyphicon-book"></span></button></div>' ) );
        var s = $("#"+id).slider().on('slide', slide).data('slider');

        var cp = $("#"+cid).minicolors();



        var c = new SColor();
        c.slider = s;
        c.colorpicker = cp;
        colors.push(c);
        count++;
    }

    slide = function() {
//        var r = s.getValue()/240;
//        var r2 = s2.getValue()/240;
        rect.uncache();
        var gradients = buildGradientArray();
        var colors = buildColorArray();

        rect.graphics.clear();
        rect.graphics.beginLinearGradientFill(colors, gradients, 0, 0, 240, 0).drawRect(0, 0, 240, 120);


        stage.update();
    }

    buildGradientArray = function() {
        var garray = [];
        for (var o in colors) {
            var val = colors[o].slider.getValue()/240;
           garray.push(val);
        }
        return garray;
    }
    buildColorArray = function() {
        var carray = [];
        for (var o in colors) {
            var val = colors[o].colorpicker.val();
            carray.push(val);
        }
        return carray;

    }

    SColor = function() {
        this.slider;
        this.colorpicker;
    }

    $(document).ready(init);


</script>
</body>
</html>v