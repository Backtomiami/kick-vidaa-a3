(function(){
'use strict';
var stage=document.getElementById('stage'),status=document.getElementById('status');
function stop(){stage.textContent='';status.textContent='Остановлено';}
function player(){
 var c=document.getElementById('channel').value.trim();
 if(!/^[a-zA-Z0-9_-]{1,60}$/.test(c)){status.textContent='Введите имя канала';return;}
 stop();
 var f=document.createElement('iframe');
 f.title='Official Kick player';
 f.allow='autoplay; fullscreen';
 f.setAttribute('allowfullscreen','');
 f.src='https://player.kick.com/'+encodeURIComponent(c)+'?autoplay=true&muted=false';
 f.onload=function(){status.textContent='Плеер загружен. Проверьте изображение и звук.';};
 f.tabIndex=-1;
 stage.appendChild(f);
 document.getElementById('stop').focus();
}
document.getElementById('sound').onclick=player;
document.getElementById('stop').onclick=stop;
document.addEventListener('keydown',function(e){
 if(e.target.tagName==='INPUT'){if(e.keyCode===40){e.preventDefault();document.getElementById('sound').focus();}return;}
 var els=Array.prototype.slice.call(document.querySelectorAll('input,button'));
 var i=els.indexOf(document.activeElement);
 if(e.keyCode>=37&&e.keyCode<=40){e.preventDefault();var d=(e.keyCode===37||e.keyCode===38)?-1:1;els[(i+d+els.length)%els.length].focus();}
});
document.getElementById('channel').focus();
})();
