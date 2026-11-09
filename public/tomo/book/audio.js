// Uses only installed, local device voices. No speech API or book-text upload.
const speech = window.speechSynthesis;
let narrationState = 'idle', narrationVersion = 0, narrationChunks = [], narrationIndex = 0;
let activeUtterance = null, deviceVoices = [];
function refreshNarrationLabel(message) {
 const label = {idle:'Read this page',playing:'Pause',paused:'Resume'}[narrationState];
 $('listen-label').textContent = label;
 $('listen').setAttribute('aria-label', `${label}, page ${current}`);
 $('listen').setAttribute('aria-pressed', String(narrationState === 'playing'));
 $('stop-listening').disabled = narrationState === 'idle';
 $('audio-status').textContent = message || `Device voice · Reads only page ${current}`;
}
function stopListening() {
 narrationVersion++;
 if(speech) { speech.cancel(); speech.resume(); }
 activeUtterance = null;
 narrationState = 'idle'; narrationChunks = []; narrationIndex = 0;
 refreshNarrationLabel();
}
function loadDeviceVoices() {
 const selected = $('narrator').value;
 deviceVoices = speech.getVoices().filter(v=>v.localService && /^en(?:-|_)/i.test(v.lang));
 $('narrator').replaceChildren();
 for(const voice of deviceVoices){
  const option=document.createElement('option');option.value=voice.voiceURI;
  option.textContent=`${voice.name} (${voice.lang})`;$('narrator').append(option);
 }
 if(deviceVoices.some(v=>v.voiceURI===selected))$('narrator').value=selected;
 if(!deviceVoices.length){
  const option=document.createElement('option');option.textContent='No local English voice';$('narrator').append(option);
 }
 $('listen').disabled = !deviceVoices.length;
 $('narrator').disabled = !deviceVoices.length;
 if(!deviceVoices.length)refreshNarrationLabel('No local English voice found. Install an English voice in your device’s speech settings, then reload.');
 else refreshNarrationLabel();
}
function speakNext(version) {
 if(version !== narrationVersion) return;
 if(narrationIndex >= narrationChunks.length){
  narrationState='idle';activeUtterance=null;
  refreshNarrationLabel(`Finished page ${current}. Turn the page to continue.`);return;
 }
 const utterance = new SpeechSynthesisUtterance(narrationChunks[narrationIndex]);
 activeUtterance=utterance;
 utterance.voice=deviceVoices.find(v=>v.voiceURI===$('narrator').value) || deviceVoices[0];
 utterance.lang=utterance.voice.lang;
 utterance.rate=Number($('audio-speed').value);
 utterance.onend=()=>{if(version!==narrationVersion)return;narrationIndex++;if(narrationState==='playing')speakNext(version);};
 utterance.onerror=event=>{if(version!==narrationVersion || event.error==='interrupted' || event.error==='canceled')return;stopListening();refreshNarrationLabel('This voice could not play. Try a different installed voice.');};
 speech.speak(utterance);
}
function pageNarrationChunks(text) {
 // Keep utterances short to avoid browser limits on long narration.
 const cleaned=text.replace(/\nCITY OF TOMO\n\d+\s*$/i,'').replace(/^(I{1,3}|IV) · [^\n]+\n\d+\n/,'').replace(/\s+/g,' ').trim();
 const words=cleaned.split(' '), chunks=[];let chunk='';
 for(const word of words){if(chunk.length+word.length>180){chunks.push(chunk);chunk='';}chunk+=(chunk?' ':'')+word;}
 if(chunk)chunks.push(chunk);return chunks;
}
$('listen').onclick=()=>{
 if(!speech || !deviceVoices.length)return;
 if(narrationState==='playing'){speech.pause();narrationState='paused';refreshNarrationLabel(`Device voice · Page ${current} paused`);return;}
 if(narrationState==='paused'){
  narrationState='playing';speech.resume();
  if(!speech.speaking && narrationIndex<narrationChunks.length)speakNext(narrationVersion);
  refreshNarrationLabel(`Device voice · Reading page ${current}`);return;
 }
 if(!pages){refreshNarrationLabel('Book text is still loading. Please try again in a moment.');return;}
 stopListening();narrationChunks=pageNarrationChunks(pages[current-1].text);
 narrationState='playing';refreshNarrationLabel(`Device voice · Reading page ${current}`);speakNext(narrationVersion);
};
$('stop-listening').onclick=stopListening;
$('narrator').onchange=stopListening;
// Rate changes apply from the next short passage, preserving the current position.
$('audio-speed').onchange=()=>{if(narrationState!=='idle')refreshNarrationLabel('New speed applies at the next passage.');};
window.addEventListener('pagehide',stopListening);
if(speech && 'SpeechSynthesisUtterance' in window){
 loadDeviceVoices();speech.addEventListener('voiceschanged',loadDeviceVoices);
} else {
 $('listen').disabled=true;$('narrator').disabled=true;$('audio-speed').disabled=true;
 refreshNarrationLabel('Read aloud is not supported in this browser. Try Safari, Chrome, or Edge.');
}
