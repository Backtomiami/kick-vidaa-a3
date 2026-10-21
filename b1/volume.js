(function(){
'use strict';
var stage=document.getElementById('stage'),log=document.getElementById('log'),v=document.createElement('video');
function note(s){log.textContent=(s+'\n'+log.textContent).slice(0,6000);}
function channel(){var c=document.getElementById('channel').value.trim();if(!/^[a-zA-Z0-9_-]{1,60}$/.test(c)){note('Введите имя канала');return null;}return c;}
function stop(){if(returnTimer){clearTimeout(returnTimer);returnTimer=null;}var old=stage.querySelector('video');if(old){old.pause();old.removeAttribute('src');old.load();}stage.textContent='';}
var returnTimer=null;
function player(autoplay,muted){var c=channel();if(!c)return;stop();var f=document.createElement('iframe');f.title='Official Kick player';f.allow='autoplay; fullscreen';f.setAttribute('allowfullscreen','');f.src='https://player.kick.com/'+encodeURIComponent(c)+'?autoplay='+autoplay+'&muted='+muted;f.onload=function(){note('iframe load: НЕ доказательство видео. Ошибка внутри Kick недоступна из-за cross-origin.');};f.tabIndex=-1;stage.appendChild(f);document.getElementById('stop').focus();}
document.getElementById('manual').onclick=function(){player(false,false);};
document.getElementById('muted').onclick=function(){player(true,true);};
document.getElementById('sound').onclick=function(){player(true,false);};
document.getElementById('direct').onclick=function(){var c=channel();if(c)location.href='https://player.kick.com/'+encodeURIComponent(c)+'?autoplay=false&muted=false';};
document.getElementById('full').onclick=function(){var c=channel();if(c)location.href='https://kick.com/'+encodeURIComponent(c);};
document.getElementById('stop').onclick=stop;
document.getElementById('focusplayer').onclick=function(){var f=stage.querySelector('iframe');if(f){note('Фокус в Kick на 20 секунд; затем попытка вернуть верхние кнопки.');f.focus();f.contentWindow.focus();if(returnTimer)clearTimeout(returnTimer);returnTimer=setTimeout(function(){window.focus();document.getElementById('focusplayer').focus();note('Возврат фокуса к кнопкам');},20000);}};
document.getElementById('hls').onclick=function(){stop();var video=document.createElement('video');video.controls=true;video.setAttribute('playsinline','');stage.appendChild(video);['loadedmetadata','playing','waiting','stalled','error'].forEach(function(e){video.addEventListener(e,function(){note('HLS '+e+' ready='+video.readyState+' error='+(video.error?video.error.code:0)+' time='+video.currentTime);});});video.src='https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8';var p=video.play();if(p&&p.catch)p.catch(function(e){note('play rejected: '+e.name);});};
var mime='video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
note('UA: '+navigator.userAgent+'\nHTML video H264/AAC: '+v.canPlayType(mime)+'\nNative HLS: '+v.canPlayType('application/vnd.apple.mpegurl')+'\nMSE: '+!!window.MediaSource+'\nMSE H264/AAC: '+!!(window.MediaSource&&MediaSource.isTypeSupported&&MediaSource.isTypeSupported(mime))+'\nEME: '+!!navigator.requestMediaKeySystemAccess+'\nЭти признаки НЕ доказывают декодирование.');
document.addEventListener('keydown',function(e){if(e.target.tagName==='INPUT'){if(e.keyCode===40){e.preventDefault();document.getElementById('manual').focus();}return;}var els=Array.prototype.slice.call(document.querySelectorAll('input,button'));var i=els.indexOf(document.activeElement);if(e.keyCode>=37&&e.keyCode<=40){e.preventDefault();var d=(e.keyCode===37||e.keyCode===38)?-1:1;els[(i+d+els.length)%els.length].focus();}});
document.getElementById('channel').focus();
})();
