export default function ChapterList({ book, onOpen }) {
  return (
    <div className="px-4 pt-5">
      {/* 卷背景卡片 */}
      <div className="bg-gradient-to-br from-accent/10 to-parchment-100 rounded-2xl border border-parchment-200 p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>
          <span className="text-xs font-semibold text-accent-dark tracking-wide">写作背景</span>
        </div>
        <h2 className="font-serif text-xl font-semibold text-ink mb-1.5">{book.name}</h2>
        <p className="text-sm text-ink-light leading-relaxed mb-3">{book.background}</p>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="px-2 py-1 rounded-md bg-white/70 text-ink-light">作者：{book.author}</span>
          <span className="px-2 py-1 rounded-md bg-white/70 text-ink-light">成书：{book.date}</span>
        </div>
      </div>

      {/* 章节列表标题 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-base font-semibold text-ink">章节目录</h3>
        <span className="text-xs text-ink-light">共 {book.chapters.length} 章</span>
      </div>

      {/* 章节网格 */}
      <div className="grid grid-cols-2 gap-3">
        {book.chapters.map((ch) => (
          <button
            key={ch.number}
            onClick={() => onOpen(ch.number)}
            className="text-left bg-white rounded-xl border border-parchment-200 p-3 active:bg-parchment-100 active:scale-[0.98] transition shadow-sm"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-serif text-2xl font-semibold text-accent leading-none">
                {ch.number}
              </span>
              <span className="text-[10px] text-ink-light">章</span>
            </div>
            <p className="text-sm font-medium text-ink line-clamp-1">{ch.title}</p>
            <p className="text-[11px] text-ink-light mt-1 line-clamp-2 leading-snug">
              {ch.theme}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
