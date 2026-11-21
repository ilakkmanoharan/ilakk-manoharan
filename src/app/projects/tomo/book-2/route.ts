const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>City of Tomo — Book 2</title>
<link rel="canonical" href="https://ilakk-manoharan.vercel.app/projects/tomo/book-2"><meta name="description" content="Read City of Tomo: A dream of a beautiful life, by Ilakkuvaselvi Manoharan.">
<link rel="stylesheet" href="/tomo/book/reader.css"><script src="/tomo/book-2/reader.js" defer></script>
<script src="/tomo/book/audio.js" defer></script>
</head>
<body>
<a class="skip" href="#reading">Skip to book</a>
<header><a class="brand" href="/startups" aria-label="Back to Startup Catalog">TOMO<span>BOOK 2</span></a><a class="download" href="/tomo/book-2/assets/city-of-tomo-2.pdf" download>Download PDF <span aria-hidden="true">↗</span></a></header>
<div class="layout">
<aside id="contents"><div class="intro"><p class="eyebrow">A DREAM OF A BEAUTIFUL LIFE</p><h1>City of Tomo</h1><p class="author">Ilakkuvaselvi Manoharan</p><p class="description">For the generation that plants,<br>and the generation that will travel among stars.</p></div><nav aria-label="Book contents" id="chapters"></nav><p class="hint">Your place is saved on this device.</p></aside>
<main id="reading" tabindex="-1"><div class="toolbar"><button id="menu" aria-expanded="false" aria-controls="contents">☰ <span>Contents</span></button><span id="position" aria-live="polite"></span><div class="view-controls"><button id="mode" aria-pressed="false">Text view</button><button id="smaller" aria-label="Zoom out">−</button><output id="zoom">100%</output><button id="larger" aria-label="Zoom in">+</button></div></div><div class="progress" role="progressbar" aria-label="Reading progress" aria-valuemin="1" aria-valuemax="42"><div id="progress-fill"></div></div><div class="canvas"><div id="page-shell"><img id="page" alt=""><article id="text" hidden></article></div><p id="error" hidden>The book could not be loaded. <a href="/tomo/book-2/assets/city-of-tomo-2.pdf">Open the PDF</a> to continue reading.</p></div><section class="audio-bar" aria-label="Listen to this page">
<div class="audio-actions"><button id="listen" aria-label="Read this page aloud" aria-pressed="false"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></svg><span id="listen-label">Read this page</span></button><button id="stop-listening" aria-label="Stop reading this page" disabled>Stop</button></div>
<div class="audio-settings"><label for="narrator">Voice</label><select id="narrator"><option>Loading device voices…</option></select><label for="audio-speed">Speed</label><select id="audio-speed"><option value="0.8">0.8×</option><option value="1" selected>1×</option><option value="1.2">1.2×</option><option value="1.5">1.5×</option></select></div>
<p id="audio-status" role="status" aria-live="polite">Device voice · Reads only this page</p>
</section><footer><button id="previous">← <span>Previous</span></button><form id="jump"><label for="page-number">Page</label><input id="page-number" type="number" min="1" max="42" value="1" aria-label="Go to page"><span>of 42</span><button class="sr-only" type="submit">Go</button></form><button id="next"><span>Next</span> →</button></footer></main>
</div>
</body></html>
`;

export function GET() {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
