<!DOCTYPE html>
<html>
<head>
    <title>Control the Crab Christmas Lights</title>
    <meta http-equiv="x-ua-compatible" content="IE=10">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/slider.css" rel="stylesheet">
    <link href="css/jquery.minicolors.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
    <script type='text/javascript' src="js/modernizr.js"></script>
    <script type="text/javascript" src="//use.typekit.net/irr2udn.js"></script>
    <script type="text/javascript">try{Typekit.load();}catch(e){}</script>

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

<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-561739-25', 'crabcreative.com');
    ga('send', 'pageview');

</script>

<div id="debugtxt">

</div>

<div id="header">
    <img src="images/header.png">
</div>

<div id="container">

    <div id="streamframeholder">
        <iframe id="streamframe" width="480" height="302"
                src="http://www.ustream.tv/embed/16427450?ub=85a901&amp;lc=85a901&amp;oc=ffffff&amp;uc=ffffff&amp;v=3&amp;wmode=direct"
                scrolling="no" frameborder="0" style="border: 0px none transparent;"></iframe>
        <span id="speedmessage">(Depending on the speed of your connection, your pattern may take a few seconds to appear)</span>
    </div>

    <div id="startscreen">
        <h2 class="text-center">Seasons Greetings!</h2>
        <h3>Our ever popular tree has <span id="queuelength">X people</span> waiting to take control.</h3>
        <h3>Why not join the queue and watch the stream while you wait?</h3>
        <!--<h3>You should be able to get in on the action in around <span class="timetogo"></span>.</h3>-->
        <button class="btn btn-default" id="btn_join">Click here to join the queue</button>
    </div>


    <div id="waitscreen">
        <h3 class="text-center">Almost there!</h3>
        <h3>Just <span id="queuepos"></span> people in front of you.</h3>
        <h3>Less than <span class="timetogo"></span> to go!</h3>
    </div>

    <div id="endscreen">
        <h3 class="text-center">Alas your time with our tree is up, although feel free to join the queue again!</h3>
        <button class="btn btn-default" id="btn_join2">Click here to join the queue</button>
    </div>




    <div id="creator">
        <div id="gradientHolder">
            <div class="canvasHolder">
                <canvas id="testCanvas" width="240" height="40"></canvas>
            </div>
            <div id="send_button_holder">
                <button id="btn_process" class="btn">SEND TO <span class="icon-christmastree"></span></button>
            </div>
            <div id="timeleft"><span class="icon-clock2"></span>&nbsp;&nbsp;<span id="timelefttxt"></span></div>
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
<script src="js/wsconnection.min.js"></script>
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



    <script src="js/main.min.js"></script>



</body>
</html>