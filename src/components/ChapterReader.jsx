import { useState } from 'react'

export default function ChapterReader({ book, chapter }) {
  const [bgExpanded, setBgExpanded] = useState(false)
  const [mobileView, setMobileView] = useState('verses')
  const [expanded, setExpanded] = useState({})

  const toggleSection = (i) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))

  const hasSections = !!chapter.sections

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
              <span className="text-[11px] text-ink-light">共 {chapter.verses.length} 节</span>
            </div>
            <div className="verse-text font-serif text-ink text-[15px]">
              {chapter.verses.map((v) => (
                <p key={v.number} className="mb-2.5">
                  <sup className="text-accent text-[11px] font-semibold mr-1 align-super">
                    {v.number}
                  </sup>
                  {v.text}
                </p>
              ))}
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
