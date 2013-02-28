(function($) { 
    $.fn.extend({
        //图片加载插件,简易.
        "geasyload":function(options){  
            options = $.extend({  
                progressnum:0,
                data:[],
                delay:400,
                progress:function(){},  //进度条事件.
                end:function(){},       //加载结束后调用.
                before:function(){}     //加载开始前调用.
            }, options ); 
            this.over = function(a) {   //关闭加载
                options.data = [];
                options.end.call(this);
            } 
            function init () { 
                createandload();
                options.before.call(this);
            }
            function createandload() { 
                var $main = jQuery("<div>").css({width:"0px",height:"0px",overflow:"hidden",position:"absolute",top:"-200px"});
                for (var i = options.data.length - 1; i >= 0; i--) {
                    var img = new Image();
                    img.onload = function(){
                        options.progressnum++;
                        options.progress(options.progressnum,(options.progressnum/options.data.length)*100);
                        if (options.progressnum>=options.data.length){
                            setTimeout(function(){options.end.call()},options.delay);
                        }
                    };
                    img.onerror = function(){ 
                        //if ($(this).attr("error")=="true") {
                        //    debug("second loading fiald");
                            options.progressnum++;
                            options.progress(options.progressnum,(options.progressnum/options.data.length)*100);
                        //    return false;
                        //}
                        //this.src = this.src;
                        //$(this).attr("error","true");
                        //此处注释掉的是防加载失败,二次刷新,但是IE8往下不支持,容易卡死. (所以非IE8以上兼容的项目不要使用)
                    }
                    img.onabort = function(){ 
                        options.progressnum++;
                        options.progress(options.progressnum,(options.progressnum/options.data.length)*100);
                    }
                    img.src = options.data[i].url; 
                    $main.append(img);
                };
                $e.append($main);
            } 
            //初始化
            var $e = $(this);
            init();
            return this;
        }
 }); 
})(jQuery); 