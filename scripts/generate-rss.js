import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsFile = path.resolve(__dirname, '..', 'src', 'data', 'posts.json');
const outputFile = path.resolve(__dirname, '..', 'public', 'feed.xml');

const siteUrl = 'https://theanilbajar.github.io';
const siteTitle = "Anil's Blog";
const siteDesc = "Sharing my learnings and new research notes.";

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&' + 'amp;')
    .replace(/</g, '&' + 'lt;')
    .replace(/>/g, '&' + 'gt;')
    .replace(/"/g, '&' + 'quot;')
    .replace(/'/g, '&' + 'apos;');
}

if (!fs.existsSync(postsFile)) {
  console.log('posts.json not found. Run generate-posts.js first.');
  process.exit(0);
}

const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));

const items = posts.map(post => {
  const date = new Date(post.date).toUTCString();
  const contentSnippet = post.content.replace(/<[^>]*>/g, '').substring(0, 500);
  return `
  <entry>
    <id>${escapeXml(siteUrl)}/posts/${escapeXml(post.id)}</id>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(siteUrl)}/posts/${escapeXml(post.id)}"/>
    <updated>${date}</updated>
    <published>${date}</published>
    <summary type="text">${escapeXml(contentSnippet)}...</summary>
    ${post.tags.map(tag => `<category term="${escapeXml(tag)}"/>`).join('\n    ')}
  </entry>`;
}).join('\n');

const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteTitle)}</title>
  <subtitle>${escapeXml(siteDesc)}</subtitle>
  <link href="${escapeXml(siteUrl)}/feed.xml" rel="self"/>
  <link href="${escapeXml(siteUrl)}"/>
  <updated>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</updated>
  <id>${escapeXml(siteUrl)}/</id>
  <author>
    <name>Anil Kumar</name>
  </author>${items}
</feed>`;

fs.writeFileSync(outputFile, feed);
console.log('Generated RSS feed -> public/feed.xml');