(function($) { 
    $.fn.extend({
    	"gDrop":function(options){  
            options = $.extend({
                drag:false,
                data:[],
                DropClass:"drop-moving",
                DragClass:"",
                onlyID:"gDropModel",
                zIndexs:99999,
                followParent:true,
                show:false,
                speedtime:400, 
                animateback:false,
                end:function(){return false;}       //放开鼠标后执行 . 成功时返回{x:"10px",y:"10px"}坐标系.
            }, options );  
            // ondragstart="return false" 增加到body中. 防止系统img可以拖拽
            function init () { 
                bind(); 
            }
            function checkon() {
            	var success = false;
            	if (options.drag) {
            		success = true;
            	} 
            	var back = options.end.call({who:$who,success:success}); 
            	if ( back ) {
            		$("#"+defaultID).removeClass(options.DropClass+"-moving").animate({left:back.x+"px",top:back.y+"px"},options.speedtime,function(){
            			$(this).remove();
            		});
            	}else if (options.animateback) {
            		$("#"+defaultID).removeClass(options.DropClass+"-moving").animate({left:dx+"px",top:dy+"px"},options.speedtime,function(){
            			$(this).remove();
            		});
            	}else{ 
            		$("#"+defaultID).remove();
            	}
            }
            function bind() { 
                var xx = 0;
                var yy = 0;
                $this.unbind("mousedown").bind("mousedown",function(e){  
                	if ($(this).attr("data-gdrop")!="true") {
                	$who = $(this);
                    var $bottle_clone = jQuery("<div>").addClass(options.DropClass).addClass(options.DropClass+"-moving").css({"position":"absolute","z-index":options.zIndexs}).attr("id",options.onlyID+"-btn"+$("."+options.DropClass).length).append($(this).clone());
                    defaultID = $bottle_clone.attr("id");
                    if (options.followParent) {
                    	$bottle_clone.css({width:$(this).width()+"px",height:$(this).height()+"px"});
                    }
                    dx = $(this).offset().left;
                    dy = $(this).offset().top;
                    //$bottle_clone.css({left:$(this).offset().left+"px",top:$(this).offset().top+"px"});
                    $e.append($bottle_clone);
                    orix = $(this).css("left");
                    oriy = $(this).css("top"); 
                    xx = e.offsetX || e.pageX-$(this).offset().left;
                    yy = e.offsetY || e.pageY-$(this).offset().top; 
                    console.log(xx+" - "+yy);
                    }
                });
                $(document).unbind("mousemove").bind("mousemove",function(e){
                    if ($("."+options.DropClass).length>0 && $("#"+defaultID).is("."+options.DropClass+"-moving")) {
                        var $xy = $e.offset();
                        var $left = (e.pageX-$xy.left)-xx;
                        var $top = (e.pageY-$xy.top)-yy; 
                        $("#"+defaultID).css({left:$left,top:$top}); 
                    }
                });
                $(document).unbind("mouseup").bind("mouseup",function(){
                	if ($("."+options.DropClass+"-moving").length>0) {
                    	checkon();
                    }
                });
            }
            //初始化
            var orix = 0;
            var oriy = 0;
            var dx = 0;
            var dy = 0;
            var defaultID = "";
            var $who ;
            var $this = $(this); 
            var $e = $("body"); 

            init();
            return this;
        }

    }); 
})(jQuery);