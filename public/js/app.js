function headerfixed(param){
    var data = $.extend({},{"addclass" : "enable-bg","hideondown":false},{});
    var scrollpos = [];
    var dostuff = function(param){
        var scrolltop = $(window).scrollTop();
        var h = param.height();
        $("body").css({
            "padding-top" : h+"px" 
        });
        var top = "0px";
        if(String(data.hideondown).match(/true/ig)){
            if(scrollpos.length > 2 && scrollpos[1] < scrolltop){
                top = -h+"px";
                scrollpos.pop();
            }
        }
        param.css({
            "top" : top
        });
        if($(".header-touch").length){
            $(".header-touch").css({ "margin-top":-h, "padding-top":h+50 });
        }
        if(scrolltop>h){
            param.addClass(data.addclass);
        }else{
            param.removeClass(data.addclass);
        }
        scrollpos.unshift(scrolltop);

    };
    dostuff(param);
    $(window).on("scroll",function(){
        dostuff(param);
    });
};
function urlSetting(){
    
}
$(document).ready(function(){
    headerfixed($(".header-main"));
    urlSetting();
});