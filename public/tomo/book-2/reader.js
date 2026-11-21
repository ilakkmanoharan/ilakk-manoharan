const $ = id => document.getElementById(id);
const groups = [
 [
  "Opening",
  [
   [
    "Cover",
    1
   ],
   [
    "Dedication",
    2
   ],
   [
    "Title page",
    3
   ],
   [
    "Contents",
    4
   ],
   [
    "Contents (continued)",
    5
   ]
  ]
 ],
 [
  "I · Come Explore With Me",
  [
   [
    "Come explore with me",
    6
   ],
   [
    "The morning had room",
    7
   ],
   [
    "Breakfast belonged to the day",
    8
   ],
   [
    "Where the streets went",
    9
   ],
   [
    "The smallest beginning",
    10
   ],
   [
    "A small robot, a particular plant",
    11
   ],
   [
    "Many shapes of kindness",
    12
   ],
   [
    "A question in the field",
    13
   ],
   [
    "The classroom without a bell",
    14
   ],
   [
    "The garden listened",
    15
   ],
   [
    "An evening beside the water",
    16
   ],
   [
    "A table at the water",
    17
   ],
   [
    "The rain joined our afternoon",
    18
   ]
  ]
 ],
 [
  "II · The City Shares Its Secrets",
  [
   [
    "The intelligence of care",
    19
   ],
   [
    "The box beside the rosemary",
    20
   ],
   [
    "What, when, and how",
    21
   ],
   [
    "The map beneath the leaves",
    22
   ],
   [
    "A seed receives an address",
    23
   ],
   [
    "The joy of another question",
    24
   ],
   [
    "TOMO knew the way home",
    25
   ],
   [
    "Guardians of their patches",
    26
   ],
   [
    "A planetary nervous system",
    27
   ],
   [
    "The city kept enough memory",
    28
   ],
   [
    "How the beautiful stayed possible",
    29
   ],
   [
    "The first garden was smaller",
    30
   ]
  ]
 ],
 [
  "III · My Notebook Reaches The Stars",
  [
   [
    "Toward the stars",
    31
   ],
   [
    "The generation that planted departure",
    32
   ],
   [
    "Stations among the stars",
    33
   ],
   [
    "The things I want to carry",
    34
   ]
  ]
 ],
 [
  "IV · The Beautiful Things We Share",
  [
   [
    "A celebration with room for everyone",
    35
   ],
   [
    "The joy of being appreciated",
    36
   ],
   [
    "The bench beneath the fig tree",
    37
   ],
   [
    "What we can make possible",
    38
   ],
   [
    "The freedom to give kindly",
    39
   ],
   [
    "Make life beautiful",
    40
   ]
  ]
 ],
 [
  "Closing",
  [
   [
    "About this imagined city",
    41
   ],
   [
    "Back cover",
    42
   ]
  ]
 ]
];
const pageCount = 42;
let saved=1; try { saved=Number(localStorage.getItem('city-of-tomo-book-2-page'))||1; } catch {}
const fragment=location.hash.match(/^#page-(\d+)$/);
let current=Math.max(1,Math.min(pageCount,fragment?Number(fragment[1]):saved)), zoom=100, textMode=false, pages=null;
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
 $('page').src=`/tomo/book-2/assets/page-${current}.webp`;$('page').alt=`City of Tomo — page ${current}: ${active[0]}. Select Text view for readable text.`;
 $('text').textContent=pages?pages[current-1].text:'Loading book text…';
 $('position').textContent=active[0];$('page-number').value=current;
 $('previous').disabled=current===1;$('next').disabled=current===pageCount;
 $('progress-fill').style.width=`${current/pageCount*100}%`;document.querySelector('.progress').setAttribute('aria-valuenow',current);
 document.querySelectorAll('a.chapter').forEach(a=>{if(Number(a.dataset.page)===active[1])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(typeof refreshNarrationLabel==='function')refreshNarrationLabel();
 document.querySelector('.canvas').scrollTo(0,0);try{localStorage.setItem('city-of-tomo-book-2-page',current);}catch{}
 // Keep the next illustration ready without loading the entire book.
 if(current<pageCount){const preload=new Image();preload.src=`/tomo/book-2/assets/page-${current+1}.webp`;}
}
function go(page){if(typeof stopListening==='function')stopListening();current=Math.max(1,Math.min(pageCount,page));history.replaceState(null,'',`#page-${current}`);render();}
window.addEventListener('hashchange',()=>{const match=location.hash.match(/^#page-(\d+)$/);if(match)go(Number(match[1]));});
$('previous').onclick=()=>go(current-1);$('next').onclick=()=>go(current+1);
$('jump').onsubmit=e=>{e.preventDefault();if($('page-number').checkValidity())go(Number($('page-number').value));};
$('menu').onclick=()=>{const open=$('contents').classList.toggle('open');$('menu').setAttribute('aria-expanded',String(open));};
$('mode').onclick=()=>{textMode=!textMode;$('page').hidden=textMode;$('text').hidden=!textMode;$('mode').textContent=textMode?'Page view':'Text view';$('mode').setAttribute('aria-pressed',String(textMode));};
function resize(amount){zoom=Math.max(75,Math.min(175,zoom+amount));$('zoom').textContent=`${zoom}%`;$('page-shell').style.maxWidth=`${660*zoom/100}px`;$('text').style.fontSize=`${19*zoom/100}px`;$('smaller').disabled=zoom===75;$('larger').disabled=zoom===175;}
$('smaller').onclick=()=>resize(-25);$('larger').onclick=()=>resize(25);
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();go(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(current-1);}if(e.key==='Escape')closeMenu();});
$('page').onerror=()=>{$('error').hidden=false;};$('page').onload=()=>{$('error').hidden=true;};
fetch('/tomo/book-2/assets/book.json').then(r=>{if(!r.ok)throw new Error('Unable to load text');return r.json();}).then(data=>{pages=data;$('text').textContent=pages[current-1].text;}).catch(()=>{$('text').textContent='Text view could not be loaded. Please use Page view or download the PDF.';});
render();
