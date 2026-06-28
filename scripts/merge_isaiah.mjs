import fs from 'node:fs'

const raw = JSON.parse(fs.readFileSync('src/data/isaiah_raw.json', 'utf-8'))
const meta1 = (await import('../src/data/isaiah_meta_1.js')).meta1
const meta2 = (await import('../src/data/isaiah_meta_2.js')).meta2
const meta3 = (await import('../src/data/isaiah_meta_3.js')).meta3
const meta4 = (await import('../src/data/isaiah_meta_4.js')).meta4
const meta5 = (await import('../src/data/isaiah_meta_5.js')).meta5
const meta6 = (await import('../src/data/isaiah_meta_6.js')).meta6

const allMeta = [...meta1, ...meta2, ...meta3, ...meta4, ...meta5, ...meta6]
console.log('导读章节数:', allMeta.length)

const chapters = raw.chapters.map((ch) => {
  const m = allMeta.find((x) => x.n === ch.number)
  if (!m) throw new Error('第' + ch.number + '章缺导读')
  return {
    number: ch.number,
    title: m.t,
    background: m.b,
    summary: m.s,
    theme: m.th,
    imagery: m.im,
    note: m.no,
    verses: ch.verses,
  }
})

const book = {
  id: 'isaiah',
  name: '以赛亚书',
  nameEn: 'Isaiah',
  testament: 'old',
  category: '大先知书',
  author: '先知以赛亚（亚摩斯之子）',
  date: '约公元前740–680年',
  background: '《以赛亚书》是旧约先知书中篇幅最长、神学最宏大的一卷，出自南国犹大先知以赛亚之手。他于乌西雅王驾崩那年在圣殿中见异象蒙召（约公元前740年），历经约坦、亚哈斯、希西家、玛拿西诸王，侍奉约四十年。全书前39章重在审判与历史，后27章重在安慰与救赎，故被称为"第五福音书"。',
  chapters,
}

const output = `// 以赛亚书完整数据：经文(公有领域和合本CUV) + 灵修导读(原创)\nexport const isaiah = ${JSON.stringify(book, null, 2)}\n`
fs.writeFileSync('src/data/isaiah.js', output, 'utf-8')
console.log('完成！共 ' + chapters.length + ' 章，已写入 src/data/isaiah.js')
console.log('文件大小: ' + (fs.statSync('src/data/isaiah.js').size / 1024).toFixed(1) + ' KB')
