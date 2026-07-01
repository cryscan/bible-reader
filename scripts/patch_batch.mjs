// 批量 patch 多章导读：从 batchN_data.mjs 导入，替换对应 meta 分片，重新生成 isaiah.js
import fs from 'node:fs'

const batchModule = await import('../src/data/batch7_data.mjs')
const batch = batchModule.batch7
console.log('本批章节数:', batch.length)

// 1. 按章号找到所在 meta 文件并替换
const metaFiles = {}
for (let i = 1; i <= 6; i++) {
  metaFiles[i] = fs.readFileSync(`src/data/isaiah_meta_${i}.js`, 'utf-8')
}

for (const ch of batch) {
  const secStr = ch.sec.map(s => `{r:'${s.r}',h:'${s.h}',c:'${s.c}'}`).join(',')
  const newLine = `{n:${ch.n},t:'${ch.t}',b:'${ch.b}',su:'${ch.su}',sec:[${secStr}],},\n`
  let found = false
  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp(`\\{n:${ch.n},[^\\n]*\\},\\n`)
    if (regex.test(metaFiles[i])) {
      metaFiles[i] = metaFiles[i].replace(regex, newLine)
      fs.writeFileSync(`src/data/isaiah_meta_${i}.js`, metaFiles[i], 'utf-8')
      console.log(`  第${ch.n}章 -> meta_${i}.js`)
      found = true
      break
    }
  }
  if (!found) console.log(`  第${ch.n}章 未找到旧条目!`)
}

// 2. 重新合并生成 isaiah.js
const raw = JSON.parse(fs.readFileSync('src/data/isaiah_raw.json', 'utf-8'))
const allMeta = []
for (let i = 1; i <= 6; i++) {
  const m = await import(`../src/data/isaiah_meta_${i}.js`)
  allMeta.push(...Object.values(m)[0])
}

const chapters = raw.chapters.map((ch) => {
  const m = allMeta.find((x) => x.n === ch.number)
  if (!m) throw new Error('第' + ch.number + '章缺导读')
  const result = { number: ch.number, title: m.t, background: m.b, verses: ch.verses }
  if (m.sec) {
    result.summary = m.su
    result.sections = m.sec.map(s => ({ range: s.r, heading: s.h, content: s.c }))
  } else {
    result.summary = m.s
    result.theme = m.th
    result.imagery = m.im
    result.note = m.no
  }
  return result
})

const existingIsaiah = await import('../src/data/isaiah.js')
const bookMeta = existingIsaiah.isaiah
const book = { ...bookMeta, chapters }
const output = '// 以赛亚书完整数据：经文(公有领域和合本CUV) + 灵修导读(原创)\nexport const isaiah = ' + JSON.stringify(book, null, 2) + '\n'
fs.writeFileSync('src/data/isaiah.js', output, 'utf-8')
console.log('完成！共', chapters.length, '章, 大小:', (fs.statSync('src/data/isaiah.js').size / 1024).toFixed(1), 'KB')
const newCount = chapters.filter(c => c.sections).length
console.log(`新格式: ${newCount}章, 旧格式: ${chapters.length - newCount}章`)
