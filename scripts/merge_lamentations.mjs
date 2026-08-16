import fs from 'node:fs'

const raw = JSON.parse(fs.readFileSync('src/data/lamentations_raw.json', 'utf-8'))
const meta = (await import('../src/data/lamentations_meta.js')).meta

console.log('导读章节数:', meta.length)

const chapters = raw.chapters.map((ch) => {
  const m = meta.find((x) => x.n === ch.number)
  if (!m) throw new Error('第' + ch.number + '章缺导读')
  return {
    number: ch.number,
    title: m.t,
    background: m.b,
    verses: ch.verses,
    summary: m.s,
    sections: m.sections,
  }
})

const book = {
  id: 'lamentations',
  name: '耶利米哀歌',
  nameEn: 'Lamentations',
  testament: 'old',
  category: '大先知书',
  author: '先知耶利米（传统归名）',
  date: '约公元前586–585年',
  background:
    '《耶利米哀歌》是耶路撒冷于公元前586年陷落、圣殿被焚、百姓被掳之后所作的哀悼诗集，传统归于先知耶利米名下（参代下35:25）。全书五章：首四章为希伯来字母诗（每节以连续字母开头），第三章以每段三节共66节的特殊形式写成，第五章为整齐的22节祷告。诗人以拟人笔法哀叹孤城之痛，却在第3章迸出"我们不至消灭，是出于耶和华诸般的慈爱"的盼望，于审判中仍仰望神的信实。',
  chapters,
}

const output = `// 耶利米哀歌完整数据：经文(公有领域和合本CUV) + 灵修导读(原创)
export const lamentations = ${JSON.stringify(book, null, 2)}
`
fs.writeFileSync('src/data/lamentations.js', output, 'utf-8')
console.log('完成！共 ' + chapters.length + ' 章，已写入 src/data/lamentations.js')
console.log('文件大小: ' + (fs.statSync('src/data/lamentations.js').size / 1024).toFixed(1) + ' KB')
