import { useState } from 'react'
import { testamentLabels } from '../data/bibleData'

export default function BookList({ books, onOpen }) {
  const [filter, setFilter] = useState('all') // all | old | new

  const filtered = books.filter((b) => filter === 'all' || b.testament === filter)
  const oldBooks = books.filter((b) => b.testament === 'old')
  const newBooks = books.filter((b) => b.testament === 'new')

  return (
    <div className="px-4 pt-5">
      {/* 欢迎语 */}
      <div className="mb-5">
        <h2 className="font-serif text-2xl font-semibold text-ink mb-1">开始阅读</h2>
        <p className="text-sm text-ink-light leading-relaxed">
          选择一卷书，在每一章的开头阅读写作背景，正文可随时点击「导读」查看概括、主旨与意象。
        </p>
      </div>

      {/* 旧约/新约筛选 */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all', label: '全部' },
          { key: 'old', label: '旧约' },
          { key: 'new', label: '新约' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 h-9 rounded-full text-sm font-medium transition ${
              filter === t.key
                ? 'bg-accent text-white'
                : 'bg-white text-ink-light border border-parchment-200 active:bg-parchment-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 书卷列表 */}
      <div className="space-y-3">
        {filtered.map((book) => (
          <button
            key={book.id}
            onClick={() => onOpen(book.id)}
            className="w-full text-left bg-white rounded-2xl border border-parchment-200 p-4 active:bg-parchment-100 transition shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-semibold text-ink">{book.name}</h3>
                <p className="text-xs text-ink-light mt-0.5">
                  {book.nameEn} · {book.author}
                </p>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-parchment-100 text-[11px] font-medium text-accent-dark">
                {testamentLabels[book.testament]}
              </span>
            </div>
            <p className="text-sm text-ink-light leading-relaxed line-clamp-2">
              {book.background}
            </p>
            <div className="flex items-center gap-3 mt-3 text-[11px] text-ink-light">
              <span className="flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
                {book.category}
              </span>
              <span className="flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {book.chapters.length} 章
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 提示 */}
      <div className="mt-6 mb-2 text-center text-[11px] text-ink-light">
        <p>当前为示例书卷，后续可扩展更多经卷内容</p>
        <p className="mt-1">旧约 {oldBooks.length} 卷 · 新约 {newBooks.length} 卷</p>
      </div>
    </div>
  )
}
