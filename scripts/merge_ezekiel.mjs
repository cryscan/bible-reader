import fs from 'node:fs'

const raw = JSON.parse(fs.readFileSync('src/data/ezekiel_raw.json', 'utf-8'))
const meta = (await import('../src/data/ezekiel_meta.js')).meta

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
  id: 'ezekiel',
  name: '以西结书',
  nameEn: 'Ezekiel',
  testament: 'old',
  category: '大先知书',
  author: '先知以西结（布西之子，祭司）',
  date: '约公元前593–571年',
  background:
    '《以西结书》出自被掳巴比伦的祭司以西结之手，蒙召于约雅斤被掳第五年（约593 BC），侍奉于迦巴鲁河边被掳者中间，与耶利米、但以理同为先知。全书以壮阔的异象著称：四活物与轮中套轮的荣耀宝座（1章）、守望者的呼召、圣殿中可憎之事的揭示、荣耀离开圣殿（10章），以及被掳第二十五年所见的"新圣殿异象"（40-48章）。核心信息有三：神因百姓背约而审判，却应许赐新心肉心与圣灵（11、36章）、以枯骨复活预表复国（37章）、并描绘从殿中流出的生命河（47章）。',
  chapters,
}

const output = `// 以西结书完整数据：经文(公有领域和合本CUV) + 灵修导读(原创)
export const ezekiel = ${JSON.stringify(book, null, 2)}
`
fs.writeFileSync('src/data/ezekiel.js', output, 'utf-8')
console.log('完成！共 ' + chapters.length + ' 章，已写入 src/data/ezekiel.js')
console.log('文件大小: ' + (fs.statSync('src/data/ezekiel.js').size / 1024).toFixed(1) + ' KB')
