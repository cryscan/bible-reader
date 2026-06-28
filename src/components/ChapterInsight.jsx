import { useEffect } from 'react'

export default function ChapterInsight({ book, chapter, onClose }) {
  // 锁定背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      {/* 抽屉面板 */}
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-parchment-50 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        {/* 顶部把手 + 关闭 */}
        <div className="shrink-0 pt-3 pb-2 px-4 border-b border-parchment-200 bg-parchment-50">
          <div className="sm:hidden w-10 h-1 rounded-full bg-parchment-200 mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] text-ink-light">{book.name} · 第 {chapter.number} 章</p>
              <h3 className="font-serif text-lg font-semibold text-ink truncate">
                {chapter.title} · 导读
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-parchment-100 text-ink-light active:bg-parchment-200 transition shrink-0"
              aria-label="关闭"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* 内容滚动区 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {chapter.sections ? (
            <>
              {/* 新模式：总结 + 分段落讲解 */}
              <Section title="总结">
                <p className="text-sm text-ink leading-relaxed">{chapter.summary}</p>
              </Section>
              {chapter.sections.map((sec, i) => (
                <Section key={i} title={sec.heading} badge={sec.range}>
                  <p className="text-sm text-ink leading-relaxed">{sec.content}</p>
                </Section>
              ))}
            </>
          ) : (
            <>
              {/* 旧模式：概括 + 主旨 + 意象 + 注释 */}
              <Section title="章节概括">
                <p className="text-sm text-ink leading-relaxed">{chapter.summary}</p>
              </Section>

              <Section title="核心主旨">
                <div className="bg-accent/8 rounded-xl px-4 py-3 border-l-4 border-accent">
                  <p className="font-serif text-[15px] text-accent-dark font-medium leading-relaxed">
                    {chapter.theme}
                  </p>
                </div>
              </Section>

              <Section title="关键意象">
                <div className="flex flex-wrap gap-2">
                  {chapter.imagery.map((img, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-parchment-200 text-sm text-ink"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {img}
                    </span>
                  ))}
                </div>
              </Section>

              {chapter.note && (
                <Section title="注释亮光">
                  <div className="bg-parchment-100/60 rounded-xl px-4 py-3 border border-parchment-200">
                    <p className="text-sm text-ink leading-relaxed">{chapter.note}</p>
                  </div>
                </Section>
              )}
            </>
          )}

          {/* 写作背景（两种模式都有） */}
          <Section title="写作背景">
            <p className="text-sm text-ink-light leading-relaxed">{chapter.background}</p>
          </Section>
        </div>

        {/* 底部操作 */}
        <div className="shrink-0 px-4 py-3 border-t border-parchment-200 bg-parchment-50">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-accent text-white font-medium active:bg-accent-dark transition"
          >
            继续阅读
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, badge, children }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="w-1 h-4 rounded-full bg-accent" />
        <h4 className="text-sm font-semibold text-accent-dark">{title}</h4>
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-accent/10 text-[11px] text-accent-dark font-medium">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}
