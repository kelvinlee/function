(function(){
if (typeof friendsData =="undefined") {

}
// 上面是数据
var config = {
		boxID:"autoTalkBox",
		valuepWrap:'autoTalkText',
		wrap:'recipientsTips',
		listWrap:"autoTipsUserList",
		position:'autoUserTipsPosition',
		positionHTML:'<span id="autoUserTipsPosition"><span style="white-space:pre-wrap;font-family:Tahoma,宋体;"> </span>123</span>',
		className:'autoSelected',
		nbsp:'<span class="nbsp" style="white-space:pre-wrap;"> </span>'
	};
	
var html = '<div id="autoTalkBox" style=" top:$top$px;left:$left$px; position:absolute;scroll-top:$SCTOP$px;"><span id="autoTalkText">'+config.positionHTML+'</span></div><div id="recipientsTips" class="recipients-tips"><ul id="autoTipsUserList"></ul></div>';
var listHTML = '<li><a title="$ACCOUNT$" rel="$ID$" >$NAME$(@$SACCOUNT$)</a></li>';


/*
 * D 基本DOM操作
 * $(ID)
 * DC(tn) TagName
 * EA(a,b,c,e)
 * ER(a,b,c)
 * BS()
 * FF
 */
var D = {
	$:function(ID){
		return document.getElementById(ID)
	},
	DC:function(tn){
		return document.createElement(tn);
	},
    EA:function(a, b, c, e) {
        if (a.addEventListener) {
            if (b == "mousewheel") b = "DOMMouseScroll";
            a.addEventListener(b, c, e);
            return true
        } else return a.attachEvent ? a.attachEvent("on" + b, c) : false
    },
    ER:function(a, b, c) {
        if (a.removeEventListener) {
            a.removeEventListener(b, c, false);
            return true
        } else return a.detachEvent ? a.detachEvent("on" + b, c) : false
    },
	BS:function(){
		var db=document.body,
			dd=document.documentElement,
			top = db.scrollTop+dd.scrollTop;
			left = db.scrollLeft+dd.scrollLeft;
		return { 'top':top , 'left':left };
	},
	
	FF:(function(){
		var ua=navigator.userAgent.toLowerCase();
		return /firefox\/([\d\.]+)/.test(ua);
	})()
};

/*
 * TT textarea 操作函数
 * info(t) 基本信息
 * getCursorPosition(t) 光标位置
 * setCursorPosition(t, p) 设置光标位置
 * add(t,txt) 添加内容到光标处
 */
var TT = {
	
	info:function(t){
		var o = t.getBoundingClientRect();
		var w = t.offsetWidth;
		var h = t.offsetHeight;
		return {top:o.top, left:o.left, width:w, height:h};
	},
	
	getCursorPosition: function(t){
		if (document.selection) {
			t.focus();
			var ds = document.selection;
			var range = null;
			range = ds.createRange();
			var stored_range = range.duplicate();
			stored_range.moveToElementText(t);
			stored_range.setEndPoint("EndToEnd", range);
			t.selectionStart = stored_range.text.length - range.text.length;
			t.selectionEnd = t.selectionStart + range.text.length;
			return t.selectionStart;
		} else return t.selectionStart
	},
	
	setCursorPosition:function(t, p){
		var n = p == 'end' ? t.value.length : p;
		if(document.selection){
			var range = t.createTextRange();
			range.moveEnd('character', -t.value.length);         
			range.moveEnd('character', n);
			range.moveStart('character', n);
			range.select();
		}else{
			t.setSelectionRange(n,n);
			t.focus();
		}
	},
	
	add:function (t, txt){
		var val = t.value;
		var wrap = wrap || '' ;
		if(document.selection){
			document.selection.createRange().text = txt;  
		} else {
			var cp = t.selectionStart;
			var ubbLength = t.value.length;
			t.value = t.value.slice(0,t.selectionStart) + txt + t.value.slice(t.selectionStart, ubbLength);
			this.setCursorPosition(t, cp + txt.length); 
		};
	},
	
	del:function(t, n){
		var p = this.getCursorPosition(t);
		var s = t.scrollTop;
		t.value = t.value.slice(0,p - n) + t.value.slice(p);
		this.setCursorPosition(t ,p - n);
		D.FF && setTimeout(function(){t.scrollTop = s},10);
		
	}

}


/*
 * DS 数据查找
 * inquiry(data, str, num) 数据, 关键词, 个数
 * 
 */

var DS = {
	inquiry:function(data, str, num){
		if(str == '') return friendsData.slice(0, num);

		var reg = new RegExp(str.toLowerCase(), 'i');
		var i = 0;
		//var dataUserName = {};
		var sd = [];

		while(sd.length < num && i < data.length){
			if(reg.test(data[i]['user'].toLowerCase())){
				sd.push(data[i]);
				//dataUserName[data[i]['user']] = true;
			}
			i++;
		}			
		return sd;
	}
}


/*
 * selectList
 * _this
 * index
 * list
 * selectIndex(code) code : e.keyCode
 * setSelected(ind) ind:Number
 */


var selectList = {
	_this:null,
	index:-1,
	list:null,
	selectIndex:function(code){
		if(D.$(config.wrap).style.display == 'none') return true;
		var i = selectList.index;
		switch(code){
		   case 40:
			 i = i + 1;
			 break
		   case 38:
			 i = i - 1;
			 break
		   case 13:
			return selectList._this.enter();
			break
		}

		i = i >= selectList.list.length ? 0 : i < 0 ? selectList.list.length-1 : i;
		return selectList.setSelected(i);
	},
	setSelected:function(ind){
		if(selectList.index >= 0) selectList.list[selectList.index].className = '';
		selectList.list[ind].className = config.className;
		selectList.index = ind;
		return false;
	}

}



/*
 *
 */
var AutoTips = function(A){
	var elem = A.id ? D.$(A.id) : A.elem;
	var checkLength = 20;
	var _this = {};
	var key = '';

	_this.start = function(){
		if(!D.$(config.boxID)){
			var h = html.slice();
			var info = TT.info(elem);
			var div = D.DC('DIV');
			var bs = D.BS();
			h = h.replace('$top$',(info.top + bs.top)).
					replace('$left$',(info.left + bs.left)).
					replace('$width$',info.width).
					replace('$height$',info.height).
					replace('$SCTOP$','0');
			div.innerHTML = h;
			document.body.appendChild(div);
		}else{
			_this.updatePosstion();
		}
	}
	
  	_this.keyupFn = function(e){
		
		var e = e || window.event;
		if(e){
			var code = e.keyCode;
			if(code == 38 || code == 40 || code == 13) {
				if(D.$(config.wrap).style.display != 'none'){
					if(code==13){
						_this.enter();
						
					}
					return false;
				}
			}else if(code == 27){
				_this.hide();
				return false;
			}
		}
		var cp = TT.getCursorPosition(elem);
		if(!cp) return _this.hide();
		var valuep = elem.value.slice(0, cp);
		var val = valuep.slice(-checkLength);
		var chars = val.match(/(\w+)?@(\w+)$|@$/); 
		if(chars == null) return _this.hide();
		var char = chars[2];  
		if (typeof char == "undefined") {
			char = "";
			D.$(config.valuepWrap).innerHTML = valuep.slice(0,valuep.length).replace(/\n/g,'<br/>').
											replace(/\s/g,config.nbsp) + config.positionHTML;
		}else{
			D.$(config.valuepWrap).innerHTML = valuep.slice(0,valuep.length - char.length).replace(/\n/g,'<br/>').
											replace(/\s/g,config.nbsp) + config.positionHTML;
		}
		_this.showList(char);
	}
	
	_this.showList = function(char){
		key = char; if (typeof char == "undefined") {key = ""; char ="";}
		var data = DS.inquiry(friendsData, char, 5); 
		var html = listHTML.slice();
		var h = '';
		var len = data.length;
		if(len == 0){_this.hide();return;}
		var reg = new RegExp("("+char+")","gi");
		//var em = '<em>'+ char +'</em>';
		for(var i=0; i<len; i++){
			var hm = data[i]['user'].replace(reg,"<em>$1</em>");
			h += html.replace(/\$ACCOUNT\$|\$NAME\$/g,data[i]['name']).
						replace('$SACCOUNT$',hm).replace('$ID$',data[i]['user']);
		}

		_this.updatePosstion();
		var p = D.$(config.position).getBoundingClientRect();
		var bs = D.BS();
		var d = D.$(config.wrap).style;
		d.top = p.top + 20 + bs.top + 'px';
		d.left = p.left - 5 + 'px';
		D.$(config.listWrap).innerHTML = h;
		_this.show();
		
	}
	
	
	_this.KeyDown = function(e){
		var e = e || window.event;
		var code = e.keyCode;
		if(code == 38 || code == 40 || code == 13){
			return selectList.selectIndex(code);
		}
		return true;
	}
	
	_this.updatePosstion = function(){
		var p = TT.info(elem);
		var bs = D.BS();
		var d = D.$(config.boxID).style;
		d.top = p.top + bs.top +'px';
		d.left = p.left + bs.left + 'px';
		// d.width = p.width+'px';
		// d.height = p.height+'px';
		D.$(config.boxID).scrollTop = elem.scrollTop;
	}
	
	_this.show = function(){
		selectList.list = D.$(config.listWrap).getElementsByTagName('li');
		selectList.index = -1;
		selectList._this = _this; 
		_this.cursorSelect(selectList.list);
		selectList.setSelected(0);
		elem.onkeydown = _this.KeyDown;
		D.$(config.wrap).style.display = 'block';	
	}
	
	_this.cursorSelect = function(list){
		for(var i=0; i<list.length; i++){
			list[i].onmouseover = (function(i){
				return function(){selectList.setSelected(i)};
			})(i);
			list[i].onclick = _this.enter;
		}
	}
	
	_this.hide = function(){
		selectList.list = null;
		selectList.index = -1;
		selectList._this = null;
		D.ER(elem, 'keydown', _this.KeyDown);
		D.$(config.wrap).style.display = 'none';
	}
	
	_this.bind = function(){
		
		elem.onkeyup = _this.keyupFn;
		elem.onmousedown = function(){_this.aa = setInterval(_this.keyupFn, 500)};
		elem.onclick = _this.keyupFn;
		elem.onblur = function(){setTimeout(_this.hide, 100)}
		elem.onmouseup = function(){
			if(_this.aa){
				clearInterval(_this.aa);
				_this.aa  = null;
			}
		};
		//elem.onkeyup= fn;
		//D.EA(elem, 'keyup', _this.keyupFn, false)
		//D.EA(elem, 'keyup', fn, false)
		//D.EA(elem, 'click', _this.keyupFn, false);
		//D.EA(elem, 'blur', function(){setTimeout(_this.hide, 100)}, false);
	}
	
	_this.enter = function(){
		TT.del(elem, key.length, key);
		TT.add(elem, selectList.list[selectList.index].getElementsByTagName('A')[0].rel+' ');
		_this.hide();
		return false;
	}
	
	return _this;
	
}

window.userAutoTips = function(args){
		var a = AutoTips(args);
			a.start();
			a.bind();
	}
		
})()

