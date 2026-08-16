import fs from 'node:fs'

const raw = JSON.parse(fs.readFileSync('src/data/jeremiah_raw.json', 'utf-8'))
const meta1 = (await import('../src/data/jeremiah_meta_1.js')).meta1
const meta2 = (await import('../src/data/jeremiah_meta_2.js')).meta2

const allMeta = [...meta1, ...meta2]
console.log('导读章节数:', allMeta.length)

const chapters = raw.chapters.map((ch) => {
  const m = allMeta.find((x) => x.n === ch.number)
  if (!m) throw new Error('第' + ch.number + '章缺导读')
  return {
    number: ch.number,
    title: m.t,
    background: m.b,
    verses: ch.verses,
    summary: m.s,
    theme: m.th,
    imagery: m.im,
    note: m.no,
  }
})

const book = {
  id: 'jeremiah',
  name: '耶利米书',
  nameEn: 'Jeremiah',
  testament: 'old',
  category: '大先知书',
  author: '先知耶利米（希勒家之子，亚拿突祭司）',
  date: '约公元前627–580年',
  background:
    '《耶利米书》出自南国犹大"流泪的先知"耶利米之手，侍奉横跨约西亚、约雅敬、西底家诸王，直至耶路撒冷于公元前586年陷落、百姓被掳巴比伦。他蒙召于约西亚十三年(约627 BC)，一生传讲悔改与审判，却屡遭逼迫、囚禁、被投淤泥井，甚至被迫随余民逃往埃及。全书以"拔出、拆毁、毁坏、倾覆，又要建立、栽植"为双重使命：前25章多论对犹大与耶路撒冷的审判，26–45章为围绕陷落的历史叙事，46–51章是列国审判的神谕，52章为历史附录。书中最耀眼的应许是"新约"——神要将律法写在人心版上，并赐下"公义的苗裔"(耶和华我们的义)。',
  chapters,
}

const output = `// 耶利米书完整数据：经文(公有领域和合本CUV) + 灵修导读(原创)
export const jeremiah = ${JSON.stringify(book, null, 2)}
`
fs.writeFileSync('src/data/jeremiah.js', output, 'utf-8')
console.log('完成！共 ' + chapters.length + ' 章，已写入 src/data/jeremiah.js')
console.log('文件大小: ' + (fs.statSync('src/data/jeremiah.js').size / 1024).toFixed(1) + ' KB')
