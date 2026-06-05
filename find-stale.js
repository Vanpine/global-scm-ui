/* 查找 i18n.js DICT 中不再被任何 HTML 引用的旧条目 */
const fs = require('fs');
const path = require('path');

// 1. 读取 DICT 所有 key
const i18nContent = fs.readFileSync('js/i18n.js', 'utf8');
const dictKeys = new Set();
const keyRegex = /"((?:[^"\\]|\\.)*?)"\s*:/g;
let m;
while ((m = keyRegex.exec(i18nContent)) !== null) {
  dictKeys.add(m[1]);
}

// 2. 提取所有 HTML 中的中文文本
const dir = '.';
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const allTextNodes = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(dir, file), 'utf8');
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  const textRegex = />([^<]+)</g;
  let tm;
  while ((tm = textRegex.exec(cleaned)) !== null) {
    const trimmed = tm[1].trim();
    if (trimmed && /[一-鿿]/.test(trimmed) && trimmed.length < 500) {
      allTextNodes.add(trimmed);
    }
  }
}

// 3. 找出 DICT 中有但 HTML 中没有的（旧条目）
const stale = [];
for (const key of dictKeys) {
  if (!allTextNodes.has(key)) {
    stale.push(key);
  }
}

stale.sort((a, b) => a.length - b.length);

console.log(`DICT entries: ${dictKeys.size}`);
console.log(`HTML Chinese texts: ${allTextNodes.size}`);
console.log(`Stale (no longer in HTML): ${stale.length}\n`);

for (const text of stale) {
  const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  console.log(`"${escaped}"`);
}
