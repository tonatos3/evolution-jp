/*
 jQuery PowerTip Plugin v1.1.0
 http://stevenbenner.github.com/jquery-powertip/
 Copyright 2012 Steven Benner (http://stevenbenner.com/)
 Released under the MIT license.
 <https://raw.github.com/stevenbenner/jquery-powertip/master/LICENSE.txt>
*/
(function(c){function w(b,c,m){function j(h,d){e();b.data("hasActiveHover")||(h?(d&&b.data("forcedOpen",!0),m.showTip(b)):(a.popOpenImminent=!0,i=setTimeout(function(){i=null;var g=Math.abs(a.previousX-a.currentX),d=Math.abs(a.previousY-a.currentY);g+d<c.intentSensitivity?m.showTip(b):(a.previousX=a.currentX,a.previousY=a.currentY,j())},c.intentPollInterval)))}function e(){i=clearTimeout(i)}var i=null;return{show:j,hide:function(h){e();b.data("hasActiveHover")&&(a.popOpenImminent=!1,b.data("forcedOpen",
!1),h?m.hideTip(b):i=setTimeout(function(){i=null;m.hideTip(b)},c.closeDelay))},cancel:e}}function y(b){function u(g){if(g.data("hasActiveHover"))if(a.isPopOpen)a.isClosing||m(a.activeHover),d.delay(100).queue(function(a){u(g);a()});else{g.trigger("powerTipPreRender");var p=g.data("powertip"),r=g.data("powertiptarget"),s=g.data("powertipjq"),f=r?c("#"+r):[];if(p)d.html(p);else if(s&&0<s.length)d.empty(),s.clone(!0,!0).appendTo(d);else if(f&&0<f.length)d.html(c("#"+r).html());else return;g.trigger("powerTipRender");
j.on("closePowerTip",function(){g.data("displayController").hide(!0)});a.activeHover=g;a.isPopOpen=!0;d.data("followMouse",b.followMouse);d.data("mouseOnToPopup",b.mouseOnToPopup);if(b.followMouse)e();else{var t=d.outerWidth(),k=d.outerHeight(),q,o,l;b.smartPlacement?(p=c.fn.powerTip.smartPlacementLists[b.placement],c.each(p,function(a,b){q=i(g,b,t,k);o=b;var d=q,c=n.scrollLeft(),f=n.scrollTop(),p=n.width(),h=n.height(),e=[];d.y<f&&e.push("top");d.y+k>f+h&&e.push("bottom");d.x<c&&e.push("left");d.x+
t>c+p&&e.push("right");l=e;if(0===l.length)return!1})):(q=i(g,b.placement,t,k),o=b.placement);d.addClass(o);h(q.x,q.y);a.isFixedPopOpen=!0}d.fadeIn(b.fadeInTime,function(){a.desyncTimeout||(a.desyncTimeout=setInterval(x,500));g.trigger("powerTipOpen")})}}function m(g){a.isClosing=!0;g.data("hasActiveHover",!1);g.data("forcedOpen",!1);a.activeHover=null;a.isPopOpen=!1;a.desyncTimeout=clearInterval(a.desyncTimeout);j.off("closePowerTip");d.fadeOut(b.fadeOutTime,function(){a.isClosing=!1;a.isFixedPopOpen=
!1;d.removeClass();h(a.currentX+b.offset,a.currentY+b.offset);g.trigger("powerTipClose")})}function x(){if(a.isPopOpen&&!a.isClosing){var b=!1;!1===a.activeHover.data("hasActiveHover")?b=!0:!o(a.activeHover)&&(!a.activeHover.is(":focus")&&!a.activeHover.data("forcedOpen"))&&(d.data("mouseOnToPopup")?o(d)||(b=!0):b=!0);b&&m(a.activeHover)}}function e(){if(a.isPopOpen&&!a.isFixedPopOpen||a.popOpenImminent&&!a.isFixedPopOpen&&d.data("hasMouseMove")){var g=n.scrollTop(),c=n.width(),i=n.height(),e=d.outerWidth(),
f=d.outerHeight(),j=0,k=0,j=e+a.currentX+b.offset<c?a.currentX+b.offset:c-e,k=f+a.currentY+b.offset<g+i?a.currentY+b.offset:g+i-f;h(j,k)}}function i(a,d,c,i){var f=a.offset(),e=a.outerWidth(),a=a.outerHeight(),k=0,h=0;switch(d){case "n":k=f.left+e/2-c/2;h=f.top-i-b.offset;break;case "e":k=f.left+e+b.offset;h=f.top+a/2-i/2;break;case "s":k=f.left+e/2-c/2;h=f.top+a+b.offset;break;case "w":k=f.left-c-b.offset;h=f.top+a/2-i/2;break;case "nw":k=f.left-c+20;h=f.top-i-b.offset;break;case "ne":k=f.left+e-
20;h=f.top-i-b.offset;break;case "sw":k=f.left-c+20;h=f.top+a+b.offset;break;case "se":k=f.left+e-20,h=f.top+a+b.offset}return{x:Math.round(k),y:Math.round(h)}}function h(a,b){d.css("left",a+"px");d.css("top",b+"px")}var d=c("#"+b.popupId);0===d.length&&(d=c("<div></div>",{id:b.popupId}),0===l.length&&(l=c("body")),l.append(d));if(b.followMouse){if(!d.data("hasMouseMove"))j.on({mousemove:e,scroll:e});d.data("hasMouseMove",!0)}if(b.followMouse||b.mouseOnToPopup)d.on({mouseenter:function(){(d.data("followMouse")||
d.data("mouseOnToPopup"))&&a.activeHover&&a.activeHover.data("displayController").cancel()},mouseleave:function(){d.data("mouseOnToPopup")&&a.activeHover&&a.activeHover.data("displayController").hide()}});return{showTip:function(a){a.data("hasActiveHover",true);d.queue(function(b){u(a);b()})},hideTip:m}}function v(b){a.currentX=b.pageX;a.currentY=b.pageY}function o(b){var c=b.offset();return a.currentX>=c.left&&a.currentX<=c.left+b.outerWidth()&&a.currentY>=c.top&&a.currentY<=c.top+b.outerHeight()}
var j=c(document),n=c(window),l=c("body"),a={isPopOpen:!1,isFixedPopOpen:!1,isClosing:!1,popOpenImminent:!1,activeHover:null,currentX:0,currentY:0,previousX:0,previousY:0,desyncTimeout:null,mouseTrackingActive:!1};c.fn.powerTip=function(b){if(!this.length)return this;var n=c.extend({},c.fn.powerTip.defaults,b),m=new y(n),l=0,e=0;a.mouseTrackingActive||(a.mouseTrackingActive=!0,c(function(){l=j.scrollLeft();e=j.scrollTop()}),j.on({mousemove:v,scroll:function(){var b=j.scrollLeft(),c=j.scrollTop();
b!==l&&(a.currentX+=b-l,l=b);c!==e&&(a.currentY+=c-e,e=c)}}));this.each(function(){var a=c(this),b=a.data("powertip"),d=a.data("powertipjq"),e=a.data("powertiptarget"),j=a.attr("title");if(!b&&!e&&!d&&j){a.data("powertip",j);a.removeAttr("title")}a.data("displayController",new w(a,n,m))});return this.on({mouseenter:function(b){v(b);a.previousX=b.pageX;a.previousY=b.pageY;c(this).data("displayController").show()},mouseleave:function(){c(this).data("displayController").hide()},focus:function(){var a=
c(this);o(a)||a.data("displayController").show(true)},blur:function(){c(this).data("displayController").hide(true)}})};c.fn.powerTip.defaults={fadeInTime:200,fadeOutTime:100,followMouse:!1,popupId:"powerTip",intentSensitivity:7,intentPollInterval:100,closeDelay:100,placement:"n",smartPlacement:!1,offset:10,mouseOnToPopup:!1};c.fn.powerTip.smartPlacementLists={n:["n","ne","nw","s"],e:"e ne se w nw sw n s e".split(" "),s:["s","se","sw","n"],w:"w nw sw e ne se n s w".split(" "),nw:"nw w sw n s se nw".split(" "),
ne:"ne e se n s sw ne".split(" "),sw:"sw w nw s n ne sw".split(" "),se:"se e ne s n nw se".split(" ")};c.powerTip={showTip:function(a){c.powerTip.closeTip();a=a.first();o(a)||a.data("displayController").show(!0,!0)},closeTip:function(){j.triggerHandler("closePowerTip")}}})(jQuery);