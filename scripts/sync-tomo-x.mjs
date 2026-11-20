import { copyFile, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const username = "ilakkManoharan";
const archivePath = "content/tomo-posts.json";
const cursorPath = "content/tomo-x-cursor.json";
const mediaPath = "public/tomo/x";
const archive = JSON.parse(await readFile(archivePath, "utf8"));
const posts = new Map(archive.map((post) => [post.id, post]));
const terms = /\bTOMO\b|world[ -]as[ -]a[ -]graph(?: database)?|planetary nervous system|23873426|\/projects\/tomo\b/i;
const dateParts = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
});
const source = process.argv[2];

async function saveJson(path, value) {
  await writeFile(path + ".tmp", JSON.stringify(value, null, 2) + "\n");
  await rename(path + ".tmp", path);
}

function addPost(id, timestamp, text, images) {
  const parts = Object.fromEntries(dateParts.formatToParts(new Date(timestamp)).map(({ type, value }) => [type, value]));
  posts.set(id, { id, date: `${parts.year}-${parts.month}-${parts.day}`, text, images });
}

function matches(id, text, related = []) {
  return posts.has(id) || terms.test(text) || related.some((parent) => posts.has(parent));
}

async function storeImage(id, name, alt, save) {
  if (!/^\d+$/.test(id) || !/^[\w.-]+\.(jpe?g|png|webp|gif)$/i.test(name)) {
    throw new Error("Unexpected X image filename");
  }
  const file = `${id}-${name}`;
  await mkdir(mediaPath, { recursive: true });
  await save(`${mediaPath}/${file}.tmp`);
  await rename(`${mediaPath}/${file}.tmp`, `${mediaPath}/${file}`);
  return { src: `/tomo/x/${file}`, alt: alt || "Image attached to this X post" };
}

async function importExport(root) {
  const files = await readdir(resolve(root, "data"));
  const rows = [];
  for (const name of files.filter((name) => /^tweets(?:-part\d+)?\.js$/.test(name))) {
    const input = await readFile(resolve(root, "data", name), "utf8");
    rows.push(...JSON.parse(input.slice(input.indexOf("=") + 1).trim().replace(/;$/, "")));
  }
  if (!rows.length) throw new Error("No posts found in the X export");
  rows.sort((a, b) => new Date(a.tweet.created_at) - new Date(b.tweet.created_at));
  for (const { tweet } of rows) {
    const id = tweet.id_str;
    const text = tweet.full_text;
    const related = [tweet.in_reply_to_status_id_str, tweet.quoted_status_id_str];
    if (!text || text.startsWith("RT @") || !matches(id, text, related)) continue;
    const images = [];
    const media = tweet.extended_entities?.media ?? tweet.entities?.media ?? [];
    for (const item of media.filter((item) => item.type === "photo")) {
      const name = basename(new URL(item.media_url_https).pathname);
      images.push(await storeImage(id, name, item.ext_alt_text, (path) =>
        copyFile(resolve(root, "data", "tweets_media", `${id}-${name}`), path)));
    }
    addPost(id, tweet.created_at, text, images.length ? images : posts.get(id)?.images ?? []);
  }
}

async function api(path, params = {}) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) throw new Error("Set X_BEARER_TOKEN to use the X API");
  const query = new URLSearchParams(params);
  const response = await fetch(`https://api.x.com/2/${path}?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`X API returned HTTP ${response.status}`);
  const result = await response.json();
  if (result.errors?.length) throw new Error("X API returned incomplete results");
  return result;
}

async function syncTimeline() {
  const { data: user } = await api(`users/by/username/${username}`, { "user.fields": "protected" });
  if (user.protected) throw new Error("The X account is protected");
  const cursor = await readFile(cursorPath, "utf8").then(JSON.parse).catch((error) => {
    if (error.code !== "ENOENT") throw error;
    return {};
  });
  const params = {
    max_results: "100",
    exclude: "retweets",
    "tweet.fields": "created_at,conversation_id,note_tweet,referenced_tweets,entities",
    expansions: "attachments.media_keys",
    "media.fields": "url,preview_image_url,alt_text",
  };
  if (cursor.sinceId) params.since_id = cursor.sinceId;
  const rows = [];
  let newestId;
  do {
    const result = await api(`users/${user.id}/tweets`, params);
    newestId ??= result.meta?.newest_id;
    for (const post of result.data ?? []) {
      rows.push({ post, media: result.includes?.media ?? [] });
    }
    if (!result.meta?.next_token) break;
    params.pagination_token = result.meta?.next_token;
  } while (true);
  if (cursor.sinceId && rows.length >= 3200) {
    throw new Error("Timeline window may have been exceeded. Backfill from an X export.");
  }

  for (const { post, media } of rows.reverse()) {
    const text = post.note_tweet?.text ?? post.text;
    const links = (post.note_tweet?.entities?.urls ?? post.entities?.urls ?? []).map((link) => link.expanded_url).join(" ");
    if (!matches(post.id, `${text} ${links}`, [post.conversation_id, ...(
      post.referenced_tweets ?? []
    ).map((reference) => reference.id)])) continue;
    const images = [];
    for (const item of media.filter((item) => post.attachments?.media_keys?.includes(item.media_key))) {
      const image = new URL(item.url ?? item.preview_image_url);
      if (image.protocol !== "https:" || image.hostname !== "pbs.twimg.com") throw new Error("Unexpected X media host");
      images.push(await storeImage(post.id, basename(image.pathname), item.alt_text, async (path) => {
        const response = await fetch(image, { redirect: "error", signal: AbortSignal.timeout(30000) });
        if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
          throw new Error(`Could not download an image for post ${post.id}`);
        }
        await writeFile(path, Buffer.from(await response.arrayBuffer()));
      }));
    }
    addPost(post.id, post.created_at, text, images.length ? images : posts.get(post.id)?.images ?? []);
  }
  return newestId;
}

const sinceId = source ? await importExport(source) : await syncTimeline();
const sorted = [...posts.values()].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id, "en", { numeric: true }));
await saveJson(archivePath, sorted);
if (sinceId) await saveJson(cursorPath, { sinceId });
console.log(`TOMO archive contains ${sorted.length} posts.`);
