import fs from 'node:fs'

// 1. 读取42章新导读
const ch42 = JSON.parse(fs.readFileSync('src/data/ch42_new.json', 'utf-8'))

// 2. patch isaiah_meta_4.js：替换42章条目
const meta4Path = 'src/data/isaiah_meta_4.js'
let meta4 = fs.readFileSync(meta4Path, 'utf-8')

// 构建新的42章条目行（新格式用 su + sec）
const secStr = ch42.sec.map(s => `{r:'${s.r}',h:'${s.h}',c:'${s.c}'}`).join(',')
const newLine = `{n:42,t:'${ch42.t}',b:'${ch42.b}',su:'${ch42.su}',sec:[${secStr}],},\n`

// 用正则替换42章旧条目（从 {n:42, 到行尾的 },）
meta4 = meta4.replace(/\{n:42,[^\n]*\},\n/, newLine)
fs.writeFileSync(meta4Path, meta4, 'utf-8')
console.log('isaiah_meta_4.js 已更新42章')

// 3. 重新合并生成 isaiah.js
const raw = JSON.parse(fs.readFileSync('src/data/isaiah_raw.json', 'utf-8'))
const modules = []
for (let i = 1; i <= 6; i++) {
  const m = await import('../src/data/isaiah_meta_' + i + '.js')
  modules.push(...Object.values(m)[0])
}
console.log('导读章节数:', modules.length)

const chapters = raw.chapters.map((ch) => {
  const m = modules.find((x) => x.n === ch.number)
  if (!m) throw new Error('第' + ch.number + '章缺导读')
  const result = {
    number: ch.number,
    title: m.t,
    background: m.b,
    verses: ch.verses,
  }
  // 新格式：有 sec 字段时用 sections + summary
  if (m.sec) {
    result.summary = m.su
    result.sections = m.sec.map(s => ({ range: s.r, heading: s.h, content: s.c }))
  } else {
    // 旧格式
    result.summary = m.s
    result.theme = m.th
    result.imagery = m.im
    result.note = m.no
  }
  return result
})

const book = {
  id: 'isaiah',
  name: '以赛亚书',
  nameEn: 'Isaiah',
  testament: 'old',
  category: '大先知书',
  author: '先知以赛亚（亚摩斯之子）',
  date: '约公元前740–680年',
  background: '《以赛亚书》是旧约先知书中篇幅最长、神学最宏大的一卷，出自南国犹大先知以赛亚之手。全书前39章重在审判与历史，后27章重在安慰与救赎，故被称为第五福音书。',
  chapters,
}

const output = '// 以赛亚书完整数据：经文(公有领域和合本CUV) + 灵修导读(原创)\nexport const isaiah = ' + JSON.stringify(book, null, 2) + '\n'
fs.writeFileSync('src/data/isaiah.js', output, 'utf-8')
console.log('完成！共', chapters.length, '章, 大小:', (fs.statSync('src/data/isaiah.js').size / 1024).toFixed(1), 'KB')

// 验证42章结构
const ch42Check = chapters.find(c => c.number === 42)
console.log('42章有 sections:', !!ch42Check.sections, ', 段数:', ch42Check.sections ? ch42Check.sections.length : 0)
console.log('42章 summary 前40字:', ch42Check.summary.substring(0, 40))
