$(window).load(function() { 
    $('.btn').jhButton({ 
        fx : 'shine',
        fxAlpha : 0.18,
        fxColor : '#FFFFFF',
        crystal : 'curve',
        crystalAlpha : 0.2,
        crystalColor : '#FFFFFF',
        iconColor : 'auto',
        iconsPath : 'jhb-icons/',
        iconTint : true 
    });
});
$(document).ready(function(){
    initSlidesAnchors(); 
    $('#demoHome').gradientCreator({
        gradient: '0% #02CDE8,50% #9303e6,100% #000',
        width: 500 
    });
});
function viewCode(link)
{
    if ($(link).next('.code').css('display') == 'block')
    {
        $(link).next('.code').slideUp(500);
        $(link).html('View source code');
    }
    else
    {
        $(link).next('.code').slideDown(500);
        $(link).html('Hide source code');
    }
}
function initSlidesAnchors()
{
    $('a[href*=#]').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
            && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target
            || $('[name=' + this.hash.slice(1) +']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body')
                .animate({
                    scrollTop: targetOffset
                }, 500);
                return false;
            }
        }
    });
}
function isCanvasSupported ()
{
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));  
};