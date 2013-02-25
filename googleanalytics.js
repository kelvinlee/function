/**
*    Google Analytics.
*	 Test how to use this. V1.0
*	 
*/
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-35826929-2']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

  
  Gtrack = function(){
	  this.tE = function(category, action, opt_label, opt_value, opt_noninteraction){ 
		  _gaq.push(['_trackEvent', category, action, opt_label]);
	  };
  };
  $Gtrack = new Gtrack();
  $(document).ready(function() { 
  	 $('.google').die('click').live('click',function(){
       if ($(this).attr('data-event') != "undefined" || $(this).attr('data-event') != "") {
  	 	 eval($(this).attr('data-event'));
  	 	 settimeouturl(this);
	  	 return false;
       }
  	 });
  });
  function settimeouturl(o) {
  	  setTimeout(function(){
  	  	  //alert('跳转...');
	  	  window.location.href = $(o).attr('href');
  	  }, 100);
  }