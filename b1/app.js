(function(){'use strict';
var $=function(id){return document.getElementById(id);},mode='home',current='',returnFocus='open',items=[],favs=[],filter='';
try{favs=JSON.parse(localStorage.getItem('kick-b1-favorites')||'[]');if(!Array.isArray(favs))favs=[];favs=favs.filter(valid);}catch(e){favs=[];}
function valid(s){return typeof s==='string'&&/^[a-zA-Z0-9_-]{1,60}$/.test(s);}
function say(s){$('status').textContent=s;}
function save(){try{localStorage.setItem('kick-b1-favorites',JSON.stringify(favs));say('Избранное сохранено на этом ТВ');}catch(e){say('Хранилище недоступно: избранное сохранится только до закрытия');}}
function toggle(s){if(!valid(s)){say('Введите имя канала, а не адрес сайта');return;}var i=favs.indexOf(s);if(i<0)favs.push(s);else favs.splice(i,1);save();$('star').textContent=favs.indexOf(current)<0?'В избранное':'Убрать из избранного';}
function node(tag,text){var e=document.createElement(tag);if(text)e.textContent=text;return e;}
function card(x,i){var b=node('button');b.className='card';b.id='card-'+i;
 if(x.thumbnail&&/^https:\/\//.test(x.thumbnail)){var img=node('img');img.src=x.thumbnail;img.alt='';img.onerror=function(){this.style.display='none';};b.appendChild(img);}
 b.appendChild(node('strong',x.slug));b.appendChild(node('span',x.title||'Открыть официальный плеер'));
 b.appendChild(node('small',(x.category||'Категория неизвестна')+' · '+(typeof x.viewers==='number'?x.viewers+' зрителей на момент обновления':'Зрители: нет данных')));
 b.appendChild(node('small',x.live===true?'Был в эфире при обновлении каталога':'Статус эфира неизвестен'));
 b.onclick=function(){play(x.slug);};return b;}
function render(){var grid=$('grid');grid.textContent='';$('heading').textContent={home:'Ваши каналы',search:'Поиск канала',favorites:'Избранное',categories:'Категории'}[mode];$('keyboard').hidden=mode!=='search';
 var list=items.slice();favs.forEach(function(s){if(!list.some(function(x){return x.slug===s;}))list.push({slug:s});});
 if(mode==='favorites')list=list.filter(function(x){return favs.indexOf(x.slug)>=0;});
 if(mode==='search'&&$('query').value)list=list.filter(function(x){return (x.slug+' '+(x.title||'')).toLowerCase().indexOf($('query').value.toLowerCase())>=0;});
 if(mode==='categories'&&!filter){var cats=[];items.forEach(function(x){if(x.category&&cats.indexOf(x.category)<0)cats.push(x.category);});cats.forEach(function(c,i){var b=node('button',c);b.id='category-'+i;b.onclick=function(){filter=c;render();focusFirst();};grid.appendChild(b);});if(!cats.length)grid.appendChild(node('p','Категории появятся после подключения каталога.'));return;}
 if(filter)list=list.filter(function(x){return x.category===filter;});
 list.forEach(function(x,i){grid.appendChild(card(x,i));});if(!list.length)grid.appendChild(node('p',mode==='favorites'?'Здесь появятся добавленные вами каналы.':'Введите имя канала или добавьте его в избранное.'));}
function focusFirst(){var b=$('grid').querySelector('button');(b||$('open')).focus();}
function screen(m){mode=m;filter='';render();}
function play(slug){if(!valid(slug)){say('Введите имя канала латиницей');return;}returnFocus=document.activeElement.id||'open';current=slug;$('browse').hidden=true;document.querySelector('nav').hidden=true;$('playback').hidden=false;$('playing').textContent=slug;$('stage').textContent='';
 var f=node('iframe');f.title='Official Kick player';f.allow='autoplay; fullscreen';f.setAttribute('allowfullscreen','');f.src='https://player.kick.com/'+encodeURIComponent(slug)+'?autoplay=true&muted=false';f.tabIndex=-1;$('stage').appendChild(f);$('back').focus();$('star').textContent=favs.indexOf(slug)<0?'В избранное':'Убрать из избранного';say('Проверьте изображение и звук. Громкость регулируется кнопками ТВ.');history.pushState({player:true},'');}
function leave(){if(!$('playback').hidden){$('stage').textContent='';$('playback').hidden=true;$('browse').hidden=false;document.querySelector('nav').hidden=false;render();($(returnFocus)||$('open')).focus();say('');return true;}if(filter){filter='';render();focusFirst();return true;}if(mode!=='home'){screen('home');$('home').focus();return true;}return false;}
$('back').onclick=function(){history.back();};window.addEventListener('popstate',leave);
['home','search','favorites','categories'].forEach(function(m){$(m).onclick=function(){screen(m);if(m==='search')$('query').focus();};});
$('open').onclick=function(){play($('query').value.trim());};$('save').onclick=function(){toggle($('query').value.trim());render();};$('star').onclick=function(){toggle(current);};$('query').oninput=function(){if(mode==='search')render();};
'abcdefghijklmnopqrstuvwxyz0123456789_-'.split('').concat(['⌫','Очистить']).forEach(function(k){var b=node('button',k);b.onclick=function(){var v=$('query').value;$('query').value=k==='⌫'?v.slice(0,-1):k==='Очистить'?'':(v+k).slice(0,60);render();};$('keyboard').appendChild(b);});
document.addEventListener('keydown',function(e){var key=e.keyCode;
 if(key===461||key===10009||(key===8&&e.target.tagName!=='INPUT')||key===27){if(!$('playback').hidden){e.preventDefault();history.back();}else if(leave())e.preventDefault();return;}
 if(key<37||key>40)return;if(e.target.tagName==='INPUT'&&(key===37||key===39))return;
 var a=document.activeElement,r=a.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,best=null,score=Infinity;
 Array.prototype.forEach.call(document.querySelectorAll('button,input'),function(b){if(b===a||!b.offsetWidth||!b.offsetHeight)return;var q=b.getBoundingClientRect(),dx=q.left+q.width/2-cx,dy=q.top+q.height/2-cy,forward=key===37?-dx:key===39?dx:key===38?-dy:dy,side=key===37||key===39?Math.abs(dy):Math.abs(dx);if(forward<=1)return;var s=forward+side*3;if(s<score){score=s;best=b;}});
 e.preventDefault();if(best){best.focus();best.scrollIntoView({block:'nearest'});}
});
render();$('home').focus();
var xhr=new XMLHttpRequest();xhr.open('GET','catalog.json');xhr.onload=function(){try{var d=JSON.parse(xhr.responseText);if(!d.updated_at||!Array.isArray(d.channels))return;items=d.channels.filter(function(x){return x&&valid(x.slug);});$('notice').textContent='Снимок каталога: '+d.updated_at+'. Текущий статус может измениться.';render();}catch(e){say('Каталог недоступен; ручной запуск работает.');}};xhr.onerror=function(){say('Каталог недоступен; ручной запуск работает.');};xhr.send();
})();
