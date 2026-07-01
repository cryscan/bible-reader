import { useState, useRef } from 'react'
import { useHighlights } from '../hooks/useHighlights'

export default function ChapterReader({ book, chapter }) {
  const [bgExpanded, setBgExpanded] = useState(true)
  const [mobileView, setMobileView] = useState('verses')
  const [expanded, setExpanded] = useState({})
  const verseRefs = useRef({})

  const { addHighlight, removeHighlight, clearChapter, getVerseHighlights, count } = useHighlights(book.id, chapter.number)

  const toggleSection = (i) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))

  const hasSections = !!chapter.sections

  // 鼠标划选完成后触发高亮
  const handleVerseMouseUp = (verseNumber) => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) return
    const text = sel.toString().trim()
    if (!text) return
    // 确保选区在该节范围内
    const el = verseRefs.current[verseNumber]
    if (el) {
      const range = sel.getRangeAt(0)
      if (!el.contains(range.commonAncestorContainer)) return
    }
    addHighlight(verseNumber, text)
    sel.removeAllRanges()
  }

  // 渲染单节经文，把已高亮片段标记出来
  const renderVerseText = (verseNumber, text) => {
    const hl = getVerseHighlights(verseNumber)
    if (hl.length === 0) return text
    // 按出现位置找所有高亮片段
    const parts = []
    let remaining = text
    let offset = 0
    const all = []
    // 收集所有匹配位置
    for (const h of hl) {
      let from = 0
      while (true) {
        const idx = remaining.indexOf(h.text, from)
        if (idx === -1) break
        all.push({ start: idx + offset, end: idx + offset + h.text.length, id: h.id, text: h.text })
        from = idx + 1
      }
    }
    all.sort((a, b) => a.start - b.start)
    // 合并重叠
    const merged = []
    for (const seg of all) {
      if (merged.length && seg.start < merged[merged.length - 1].end) {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, seg.end)
        merged[merged.length - 1].ids.push(seg.id)
      } else {
        merged.push({ start: seg.start, end: seg.end, ids: [seg.id] })
      }
    }
    // 切分渲染
    let cur = 0
    for (const seg of merged) {
      if (seg.start > cur) {
        parts.push(<span key={`t${cur}`}>{text.slice(cur, seg.start)}</span>)
      }
      parts.push(
        <mark
          key={`h${seg.start}`}
          className="bg-amber-200/80 rounded px-0.5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            // 点击高亮片段：删除最后一个（简化为删除该区段关联的第一个）
            seg.ids.forEach((id) => removeHighlight(id))
          }}
        >
          {text.slice(seg.start, seg.end)}
        </mark>
      )
      cur = seg.end
    }
    if (cur < text.length) {
      parts.push(<span key={`t${cur}`}>{text.slice(cur)}</span>)
    }
    return parts
  }

  return (
    <div className="px-4 pt-5">
      {/* 章节标题（横跨全宽） */}
      <div className="mb-4">
        <p className="text-xs text-ink-light mb-1">{book.name} · 第 {chapter.number} 章</p>
        <h2 className="font-serif text-2xl font-semibold text-ink">{chapter.title}</h2>
      </div>

      {/* 移动端：经文/导读 切换 tab */}
      <div className="lg:hidden flex gap-2 mb-4 sticky top-14 z-10 -mx-4 px-4 py-2 bg-parchment-50/90 backdrop-blur-md">
        <button
          onClick={() => setMobileView('verses')}
          className={`flex-1 h-9 rounded-full text-sm font-medium transition ${
            mobileView === 'verses' ? 'bg-accent text-white' : 'bg-white text-ink-light border border-parchment-200'
          }`}
        >
          经文
        </button>
        <button
          onClick={() => setMobileView('insight')}
          className={`flex-1 h-9 rounded-full text-sm font-medium transition ${
            mobileView === 'insight' ? 'bg-accent text-white' : 'bg-white text-ink-light border border-parchment-200'
          }`}
        >
          导读
        </button>
      </div>

      {/* 左右分栏布局 */}
      <div className="lg:flex lg:gap-5 lg:items-start">
        {/* ============ 左：经文区 ============ */}
        <div className={`${mobileView === 'insight' ? 'hidden lg:block' : 'block'} lg:flex-1 lg:min-w-0`}>
          {/* 写作背景（可折叠） */}
          <div className="bg-gradient-to-br from-accent/8 to-parchment-100/60 rounded-2xl border border-parchment-200 overflow-hidden mb-5">
            <button
              onClick={() => setBgExpanded((v) => !v)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left active:bg-parchment-100/50 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
              <span className="text-sm font-semibold text-accent-dark flex-1">本章写作背景</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`text-ink-light transition-transform ${bgExpanded ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {bgExpanded && (
              <div className="px-4 pb-4">
                <p className="text-sm text-ink-light leading-relaxed border-t border-parchment-200 pt-3">
                  {chapter.background}
                </p>
              </div>
            )}
          </div>

          {/* 经文正文 */}
          <article className="bg-white rounded-2xl border border-parchment-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-parchment-200">
              <span className="font-serif text-sm font-semibold text-ink">经文</span>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <button
                    onClick={clearChapter}
                    className="text-[11px] text-ink-light active:text-rose-500 transition"
                  >
                    清空高亮
                  </button>
                )}
                <span className="text-[11px] text-ink-light">共 {chapter.verses.length} 节</span>
              </div>
            </div>
            <div className="verse-text font-serif text-ink text-[15px]">
              {chapter.verses.map((v) => (
                <p
                  key={v.number}
                  ref={(el) => (verseRefs.current[v.number] = el)}
                  onMouseUp={() => handleVerseMouseUp(v.number)}
                  className="mb-2.5 cursor-text select-text"
                >
                  <sup className="text-accent text-[11px] font-semibold mr-1 align-super">
                    {v.number}
                  </sup>
                  {renderVerseText(v.number, v.text)}
                </p>
              ))}
            </div>
            {/* 高亮使用提示 */}
            <div className="mt-4 pt-3 border-t border-parchment-200 text-[11px] text-ink-light flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
              用鼠标划选经文即可高亮，点击高亮处可取消
            </div>
          </article>
        </div>

        {/* ============ 右：导读区 ============ */}
        <div className={`${mobileView === 'verses' ? 'hidden lg:block' : 'block'} lg:w-2/5 lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto`}>
          <div className="space-y-3 lg:pb-4">
            <div className="flex items-center gap-2 px-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
              <span className="font-serif text-sm font-semibold text-accent-dark">本章导读</span>
            </div>

            {/* 总结（始终置顶展开） */}
            <div className="bg-gradient-to-br from-accent/10 to-parchment-100/60 rounded-2xl border border-parchment-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-4 rounded-full bg-accent" />
                <span className="text-sm font-semibold text-accent-dark">总结</span>
              </div>
              <p className="text-sm text-ink leading-relaxed">{chapter.summary}</p>
            </div>

            {/* 新模式：可折叠段落讲解 */}
            {hasSections &&
              chapter.sections.map((sec, i) => (
                <CollapsibleSection
                  key={i}
                  range={sec.range}
                  heading={sec.heading}
                  content={sec.content}
                  expanded={!!expanded[i]}
                  onToggle={() => toggleSection(i)}
                />
              ))}

            {/* 旧模式：主旨 / 意象 / 注释 */}
            {!hasSections && (
              <>
                {chapter.theme && (
                  <div className="bg-white rounded-2xl border border-parchment-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-4 rounded-full bg-accent" />
                      <span className="text-sm font-semibold text-accent-dark">核心主旨</span>
                    </div>
                    <div className="bg-accent/8 rounded-xl px-4 py-3 border-l-4 border-accent">
                      <p className="font-serif text-[15px] text-accent-dark font-medium leading-relaxed">
                        {chapter.theme}
                      </p>
                    </div>
                  </div>
                )}

                {chapter.imagery && (
                  <div className="bg-white rounded-2xl border border-parchment-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-4 rounded-full bg-accent" />
                      <span className="text-sm font-semibold text-accent-dark">关键意象</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {chapter.imagery.map((img, j) => (
                        <span key={j} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-parchment-100 text-sm text-ink">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {img}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {chapter.note && (
                  <div className="bg-white rounded-2xl border border-parchment-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-4 rounded-full bg-accent" />
                      <span className="text-sm font-semibold text-accent-dark">注释亮光</span>
                    </div>
                    <p className="text-sm text-ink leading-relaxed">{chapter.note}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 可折叠段落讲解组件
function CollapsibleSection({ range, heading, content, expanded, onToggle }) {
  return (
    <div className="bg-white rounded-2xl border border-parchment-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-3 text-left active:bg-parchment-100/50 transition"
      >
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-[11px] text-accent-dark font-medium shrink-0">
          {range}
        </span>
        <span className="text-sm font-semibold text-ink flex-1">{heading}</span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-ink-light transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-sm text-ink leading-relaxed border-t border-parchment-200 pt-3 whitespace-pre-line">
            {content}
          </p>
        </div>
      )}
    </div>
  )
}
