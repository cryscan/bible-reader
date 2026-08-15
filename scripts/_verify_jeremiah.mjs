import { jeremiah } from '../src/data/jeremiah.js'
console.log('id:', jeremiah.id, '| 章数:', jeremiah.chapters.length)
const bad = jeremiah.chapters.filter(
  (c) => !c.title || !c.background || !c.summary || !c.theme || !c.imagery || !c.note || !c.verses || !c.verses.length
)
console.log('字段缺失的章:', bad.map((c) => c.number))
const sample = jeremiah.chapters.slice(0, 5).map((c) => `第${c.number}章:${c.verses.length}节`)
console.log('前5章:', sample.join('  '))
const last = jeremiah.chapters[jeremiah.chapters.length - 1]
console.log('末章:', last.number, last.title, '| 节数:', last.verses.length)
