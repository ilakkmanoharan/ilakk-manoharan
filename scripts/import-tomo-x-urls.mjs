import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const username = 'ilakkManoharan';
export function postId(input) {
  const url = new URL(input);
  const match = url.pathname.match(/^\/ilakkManoharan\/status\/(\d+)\/?$/i);
  if (!['x.com', 'twitter.com'].includes(url.hostname) || !match || url.protocol !== 'https:') throw new Error('Expected a public @ilakkManoharan post URL');
  return match[1];
}
export function normalizePost(official, mirrored, id) {
  if (official.id_str !== id || official.user?.screen_name?.toLowerCase() !== username.toLowerCase()) throw new Error(`X could not verify post ${id}`);
  if (mirrored.id !== id || mirrored.author?.screen_name?.toLowerCase() !== username.toLowerCase() || !mirrored.text?.startsWith(official.text.slice(0, 100))) {
    // Link-only posts are expanded by the mirror; compare their original text.
    if (!/^https:\/\/t.co\/\w+$/.test(official.text) || mirrored.id !== id || mirrored.author?.screen_name?.toLowerCase() !== username.toLowerCase() || !mirrored.raw_text?.text?.startsWith(official.text)) throw new Error(`Full text did not match X post ${id}`);
  }
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(official.created_at));
  const links = [...new Set((mirrored.raw_text?.facets ?? []).filter(f => f.type === 'url').map(f => f.replacement).filter(url => /^https?:\/\//.test(url)))];
  return { id, date, createdAt: official.created_at, text: mirrored.text, summary: false, images: [], links,
    quotedUrl: mirrored.quote?.url ?? null,
    replyTo: mirrored.replying_to_status ? `https://x.com/${username}/status/${mirrored.replying_to_status}` : null,
  };
}
async function json(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Public X source returned HTTP ${response.status}`);
  return response.json();
}
async function main() {
  const urls = process.argv.slice(2);
  if (!urls.length) throw new Error('Usage: node scripts/import-tomo-x-urls.mjs https://x.com/ilakkManoharan/status/ID ...');
  const archive = new Map(JSON.parse(await readFile('content/tomo-posts.json', 'utf8')).map(post => [post.id, post]));
  for (const url of urls) {
    const id = postId(url);
    const [official, result] = await Promise.all([
      json(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=1`),
      json(`https://api.fxtwitter.com/${username}/status/${id}`),
    ]);
    if(result.code !== 200 || !result.tweet) throw new Error(`Full text unavailable for ${id}`);
    const post = normalizePost(official, result.tweet, id);
    for (const photo of official.photos ?? []) {
      const image = new URL(photo.url);
      if(image.hostname !== 'pbs.twimg.com' || image.protocol !== 'https:') throw new Error('Unexpected X image host');
      const name = `${id}-${basename(image.pathname)}`;
      if(!/^\d+-[\w.-]+\.(jpe?g|png|webp|gif)$/i.test(name)) throw new Error('Unexpected image filename');
      image.searchParams.set('name', 'orig');
      const response = await fetch(image, { redirect: 'error', signal: AbortSignal.timeout(30_000) });
      if(!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Could not download ${name}`);
      await mkdir('public/tomo/x', { recursive: true });
      await writeFile(`public/tomo/x/${name}`, Buffer.from(await response.arrayBuffer()));
      post.images.push({ src: `/tomo/x/${name}`, alt: photo.ext_alt_text || 'Illustration attached to this TOMO post' });
    }
    archive.set(id, { ...archive.get(id), ...post });
    console.log(`Imported ${id}: ${post.text.length} characters, ${post.images.length} images`);
  }
  const sorted = [...archive.values()].sort((a,b) => b.date.localeCompare(a.date) || (BigInt(a.id) < BigInt(b.id) ? 1 : -1));
  await writeFile('content/tomo-posts.json.tmp', JSON.stringify(sorted, null, 2)+'\n');
  await rename('content/tomo-posts.json.tmp', 'content/tomo-posts.json');
  console.log(`TOMO archive contains ${sorted.length} posts.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
