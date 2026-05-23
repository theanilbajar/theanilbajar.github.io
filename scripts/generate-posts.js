import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.resolve(__dirname, '..', 'content', 'posts');
const outputFile = path.resolve(__dirname, '..', 'src', 'data', 'posts.json');

function parseFrontMatter(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontMatter = {};
  const fmLines = match[1].split('\n');
  for (const line of fmLines) {
    const parts = line.match(/^\s*(\w+):\s*(.+)$/);
    if (parts) {
      let value = parts[2].trim();
      // Handle arrays like tags: ['LLM', 'Gemini']
      if (value.startsWith('[') || value.startsWith('[\'')) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          value = value.replace(/['\[\]]/g, '').split(',').map(s => s.trim());
        }
      }
      // Handle quoted strings
      if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      frontMatter[parts[1].trim()] = value;
    }
  }

  return {
    frontMatter,
    content: match[2].trim()
  };
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname, { recursive: true });
}

if (!fs.existsSync(postsDir)) {
  console.log(`Posts directory not found: ${postsDir}`);
  console.log('Creating empty posts.json...');
  ensureDirectoryExistence(outputFile);
  fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
  process.exit(0);
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
const posts = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  const parsed = parseFrontMatter(raw);
  if (!parsed) {
    console.warn(`Skipping ${file}: could not parse front matter`);
    continue;
  }

  const { frontMatter, content } = parsed;
  if (frontMatter.draft === true || frontMatter.draft === 'true') {
    console.log(`Skipping draft: ${file}`);
    continue;
  }

  posts.push({
    id: slugify(frontMatter.title),
    title: frontMatter.title || '',
    date: frontMatter.date || new Date().toISOString(),
    tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : (frontMatter.tags || []),
    content
  });
}

// Sort by date descending (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

ensureDirectoryExistence(outputFile);
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`Generated ${posts.length} posts -> src/data/posts.json`);