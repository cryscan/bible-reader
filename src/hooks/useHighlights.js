import { useState, useEffect, useCallback } from 'react'

// 经文高亮状态管理：按 书卷id:章号 存储已高亮的文本片段
// 持久化到 localStorage，刷新/重开仍保留
// 通过鼠标划选文本触发高亮

const STORAGE_KEY = 'bible-highlights'

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // 忽略写入错误
  }
}

function chapterKey(bookId, chapterNumber) {
  return `${bookId}:${chapterNumber}`
}

// 生成唯一 id
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function useHighlights(bookId, chapterNumber) {
  const [highlights, setHighlights] = useState([])

  // 加载本章高亮
  useEffect(() => {
    const all = loadAll()
    setHighlights(all[chapterKey(bookId, chapterNumber)] || [])
  }, [bookId, chapterNumber])

  // 添加高亮片段
  const addHighlight = useCallback(
    (verseNumber, text) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const key = chapterKey(bookId, chapterNumber)
      setHighlights((prev) => {
        // 避免重复
        if (prev.some((h) => h.verse === verseNumber && h.text === trimmed)) {
          return prev
        }
        const next = [...prev, { id: uid(), verse: verseNumber, text: trimmed }]
        const all = loadAll()
        all[key] = next
        saveAll(all)
        return next
      })
    },
    [bookId, chapterNumber]
  )

  // 删除单个高亮
  const removeHighlight = useCallback(
    (id) => {
      const key = chapterKey(bookId, chapterNumber)
      setHighlights((prev) => {
        const next = prev.filter((h) => h.id !== id)
        const all = loadAll()
        if (next.length === 0) {
          delete all[key]
        } else {
          all[key] = next
        }
        saveAll(all)
        return next
      })
    },
    [bookId, chapterNumber]
  )

  // 清空本章高亮
  const clearChapter = useCallback(() => {
    const key = chapterKey(bookId, chapterNumber)
    setHighlights([])
    const all = loadAll()
    delete all[key]
    saveAll(all)
  }, [bookId, chapterNumber])

  // 获取某节的高亮片段
  const getVerseHighlights = useCallback(
    (verseNumber) => highlights.filter((h) => h.verse === verseNumber),
    [highlights]
  )

  const count = highlights.length

  return { highlights, addHighlight, removeHighlight, clearChapter, getVerseHighlights, count }
}
