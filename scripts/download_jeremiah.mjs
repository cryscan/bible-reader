// 下载耶利米书全部52章经文，繁体转简体，解析为JSON
// 数据来源: ROLOD-assistant/bible (公有领域中文和合本 CUV)
import https from 'node:https'
import fs from 'node:fs'
import * as OpenCC from 'opencc-js'

const converter = OpenCC.Converter({ from: 'tw', to: 'cn' })

function fetch(url, retries = 5) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const req = https.get(
        url,
        { headers: { 'User-Agent': 'codebuddy' }, timeout: 20000 },
        (res) => {
          if (res.statusCode !== 200) {
            res.resume()
            return reject(new Error('HTTP ' + res.statusCode))
          }
          let data = ''
          res.on('data', (chunk) => (data += chunk))
          res.on('end', () => resolve(data))
        }
      )
      req.on('timeout', () => req.destroy(new Error('timeout')))
      req.on('error', (e) => {
        if (n <= 1) return reject(e)
        console.log(`    重试(${n - 1})...`)
        setTimeout(() => attempt(n - 1), 1000)
      })
    }
    attempt(retries)
  })
}

function parseChapter(md, chapterNum) {
  const verses = []
  const lines = md.split('\n')
  for (const line of lines) {
    const m = line.match(/^(\d+)\.\s+(.*)/)
    if (m) {
      verses.push({
        number: parseInt(m[1], 10),
        text: converter(m[2].trim()),
      })
    }
  }
  return { number: chapterNum, verses }
}

async function main() {
  const base = 'https://raw.githubusercontent.com/ROLOD-assistant/bible/main/zh-CUV/'
  const bookDir = '耶利米書'
  const chapters = []
  for (let i = 1; i <= 52; i++) {
    const fileName = String(i).padStart(3, '0') + '.md'
    const url = base + encodeURIComponent(bookDir) + '/' + fileName
    process.stdout.write(`  第${i}章...`)
    try {
      const md = await fetch(url)
      const ch = parseChapter(md, i)
      chapters.push(ch)
      console.log(` ${ch.verses.length}节 OK`)
    } catch (e) {
      console.log(` 失败: ${e.message}`)
    }
    if (i % 5 === 0) await new Promise((r) => setTimeout(r, 800))
  }
  const out = {
    book: '耶利米书',
    nameEn: 'Jeremiah',
    totalChapters: chapters.length,
    chapters,
  }
  fs.writeFileSync('src/data/jeremiah_raw.json', JSON.stringify(out, null, 2), 'utf-8')
  console.log(`\n完成！共 ${chapters.length} 章，已写入 src/data/jeremiah_raw.json`)
}

main().catch(console.error)
