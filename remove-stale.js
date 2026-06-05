/* 从 i18n.js DICT 中安全移除不再使用的旧条目 */
const fs = require('fs');

const content = fs.readFileSync('js/i18n.js', 'utf8');

// 1. 读取 stale keys
const staleText = fs.readFileSync('stale-keys.txt', 'utf8');
const staleKeys = new Set();
// stale-keys.txt 中每行格式: "key内容"
const lines = staleText.split('\n');
for (const line of lines) {
  // 匹配带引号的 key
  const m = line.match(/^"((?:[^"\\]|\\.)*)"$/);
  if (m) staleKeys.add(m[1]);
}
// 也匹配不带引号的（脚本直接输出的）
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('DICT') && !trimmed.startsWith('HTML') && !trimmed.startsWith('Stale') && !trimmed.startsWith('===') && trimmed !== '') {
    // 尝试去掉首尾引号
    let key = trimmed;
    if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
    if (key) staleKeys.add(key);
  }
}

console.log(`Stale keys to remove: ${staleKeys.size}`);

// 2. 找到 DICT 的起止行
const allLines = content.split('\n');
let dictStart = -1;
let dictEnd = -1;
for (let i = 0; i < allLines.length; i++) {
  if (allLines[i].includes('var DICT = {')) dictStart = i;
  if (dictStart > -1 && i > dictStart && allLines[i].trim() === '};') {
    dictEnd = i;
    break;
  }
}
console.log(`DICT: lines ${dictStart+1} to ${dictEnd+1}`);

// 3. 逐行处理 DICT 部分
const before = allLines.slice(0, dictStart + 1);  // 包含 "var DICT = {"
const dictLines = allLines.slice(dictStart + 1, dictEnd);
const after = allLines.slice(dictEnd);  // 包含 "};"

let removed = 0;
let skipUntilEnd = false;
const newDict = [];

for (const line of dictLines) {
  if (skipUntilEnd) {
    // 跳过直到遇到逗号结束的 value
    if (line.trimEnd().endsWith('",') || line.trimEnd().endsWith('"')) {
      skipUntilEnd = false;
    }
    removed++;
    continue;
  }

  // 检查这行是否是 stale key 的开头
  const keyMatch = line.match(/^\s*"((?:[^"\\]|\\.)*?)"\s*:/);
  if (keyMatch && staleKeys.has(keyMatch[1])) {
    if (line.trimEnd().endsWith('",')) {
      // 单行条目，直接跳过
      removed++;
      continue;
    }
    // 多行条目
    skipUntilEnd = true;
    removed++;
    continue;
  }

  newDict.push(line);
}

// 4. 清理尾部多余逗号
// 找到 newDict 中最后一个实际条目行
let lastEntryIdx = -1;
for (let i = newDict.length - 1; i >= 0; i--) {
  if (newDict[i].trim() && !newDict[i].trim().startsWith('/*') && !newDict[i].trim().startsWith('//')) {
    lastEntryIdx = i;
    break;
  }
}
// 去掉最后一个条目的尾部逗号
if (lastEntryIdx >= 0) {
  const lastLine = newDict[lastEntryIdx];
  if (lastLine.trimEnd().endsWith('",')) {
    newDict[lastEntryIdx] = lastLine.trimEnd().slice(0, -1); // 去掉逗号
  }
}

const output = [...before, ...newDict, ...after].join('\n');
fs.writeFileSync('js/i18n.js', output, 'utf8');
console.log(`Removed ${removed} lines. New DICT entries: ~${dictKeysAfter}`);
console.log('Done');
