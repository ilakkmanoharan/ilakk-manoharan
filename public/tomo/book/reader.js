const $ = id => document.getElementById(id);
const groups = [
 ['Opening', [['Cover',1],['Dedication',2],['Contents',3]]],
 ['I · A place to wake up', [['A place to wake up',5],['The morning had room',6],['Breakfast belonged to the day',7],['Where the streets went',8],['A small robot, a particular plant',10],['Many shapes of kindness',11],['The classroom without a bell',13],['The garden listened',14],['A table at the water',16],['The rain arrived early',17]]],
 ['II · How the place remembers', [['How the place remembers',18],['The box beside the rosemary',19],['What, when, and how',20],['The map beneath the leaves',21],['A seed receives an address',22],['The garden that could say perhaps',23],['The afternoon the radio went quiet',24],['Guardians of their patches',25],['A planetary nervous system',26],['The city kept enough memory',27],['How the beautiful stayed possible',28],['The first garden was smaller',29]]],
 ['III · Beyond the horizon', [['Beyond the horizon',30],['The generation that planted departure',31],['Stations in the dark',32],['The things we chose to carry',33]]],
 ['IV · What remains between us', [['The old habit at the table',34],['Glory with nowhere to buy a gate',35],['The person on the bench',36],['From comparing to contributing',37],['The gate that was gone',38],['Make life beautiful',39],['Closing pages',40]]]
];
let saved=1; try { saved=Number(localStorage.getItem('city-of-tomo-page'))||1; } catch {}
const fragment=location.hash.match(/^#page-(\d+)$/);
let current=Math.max(1,Math.min(41,fragment?Number(fragment[1]):saved)), zoom=100, textMode=false, pages=null;
const entries=groups.flatMap(g=>g[1]);
for(const [title,chapters] of groups){
 const heading=document.createElement('h2'); heading.textContent=title; $('chapters').append(heading);
 for(const [name,page] of chapters){
  const link=document.createElement('a');link.className='chapter';link.href=`#page-${page}`;link.dataset.page=page;
  const label=document.createElement('span');label.textContent=name;const num=document.createElement('small');num.textContent=page;link.append(label,num);$('chapters').append(link);
  link.addEventListener('click',()=>closeMenu());
 }
}
function closeMenu(){$('contents').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}
function render(){
 const active=entries.filter(e=>e[1]<=current).at(-1);
 $('page').src=`/tomo/book/assets/page-${current}.webp`;$('page').alt=`City of Tomo — page ${current}: ${active[0]}. Select Text view for readable text.`;
 $('text').textContent=pages?pages[current-1].text:'Loading book text…';
 $('position').textContent=active[0];$('page-number').value=current;
 $('previous').disabled=current===1;$('next').disabled=current===41;
 $('progress-fill').style.width=`${current/41*100}%`;document.querySelector('.progress').setAttribute('aria-valuenow',current);
 document.querySelectorAll('a.chapter').forEach(a=>{if(Number(a.dataset.page)===active[1])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(typeof refreshNarrationLabel==='function')refreshNarrationLabel();
 document.querySelector('.canvas').scrollTo(0,0);try{localStorage.setItem('city-of-tomo-page',current);}catch{}
 // Keep the next illustration ready without loading the entire book.
 if(current<41){const preload=new Image();preload.src=`/tomo/book/assets/page-${current+1}.webp`;}
}
function go(page){if(typeof stopListening==='function')stopListening();current=Math.max(1,Math.min(41,page));history.replaceState(null,'',`#page-${current}`);render();}
window.addEventListener('hashchange',()=>{const match=location.hash.match(/^#page-(\d+)$/);if(match)go(Number(match[1]));});
$('previous').onclick=()=>go(current-1);$('next').onclick=()=>go(current+1);
$('jump').onsubmit=e=>{e.preventDefault();if($('page-number').checkValidity())go(Number($('page-number').value));};
$('menu').onclick=()=>{const open=$('contents').classList.toggle('open');$('menu').setAttribute('aria-expanded',String(open));};
$('mode').onclick=()=>{textMode=!textMode;$('page').hidden=textMode;$('text').hidden=!textMode;$('mode').textContent=textMode?'Page view':'Text view';$('mode').setAttribute('aria-pressed',String(textMode));};
function resize(amount){zoom=Math.max(75,Math.min(175,zoom+amount));$('zoom').textContent=`${zoom}%`;$('page-shell').style.maxWidth=`${660*zoom/100}px`;$('text').style.fontSize=`${19*zoom/100}px`;$('smaller').disabled=zoom===75;$('larger').disabled=zoom===175;}
$('smaller').onclick=()=>resize(-25);$('larger').onclick=()=>resize(25);
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();go(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(current-1);}if(e.key==='Escape')closeMenu();});
$('page').onerror=()=>{$('error').hidden=false;};$('page').onload=()=>{$('error').hidden=true;};
fetch('/tomo/book/assets/book.json').then(r=>{if(!r.ok)throw new Error('Unable to load text');return r.json();}).then(data=>{pages=data;$('text').textContent=pages[current-1].text;}).catch(()=>{$('text').textContent='Text view could not be loaded. Please use Page view or download the PDF.';});
render();
