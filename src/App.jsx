import { useState, useEffect, useRef } from 'react'
import { bibleData, testamentLabels } from './data/bibleData'
import BookList from './components/BookList'
import ChapterList from './components/ChapterList'
import ChapterReader from './components/ChapterReader'

export default function App() {
  const [view, setView] = useState('books') // books | chapters | reader
  const [bookId, setBookId] = useState(null)
  const [chapterNumber, setChapterNumber] = useState(null)
  const scrollRef = useRef(null)

  const currentBook = bibleData.find((b) => b.id === bookId) || null
  const currentChapter =
    currentBook?.chapters.find((c) => c.number === chapterNumber) || null

  // 视图切换时回到顶部
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [view, bookId, chapterNumber])

  function openBook(id) {
    setBookId(id)
    setView('chapters')
  }

  function openChapter(num) {
    setChapterNumber(num)
    setView('reader')
  }

  function backToBooks() {
    setView('books')
  }

  function backToChapters() {
    setView('chapters')
  }

  return (
    <div className="min-h-screen bg-parchment-50 flex justify-center">
      <div
        ref={scrollRef}
        className="w-full max-w-5xl h-screen overflow-y-auto relative"
      >
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-20 bg-parchment-50/90 backdrop-blur-md border-b border-parchment-200">
          <div className="flex items-center gap-3 px-4 h-14">
            {view !== 'books' && (
              <button
                onClick={view === 'reader' ? backToChapters : backToBooks}
                className="flex items-center justify-center w-9 h-9 -ml-2 rounded-full text-accent-dark active:bg-parchment-100 transition"
                aria-label="返回"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-lg font-semibold text-ink truncate">
                {view === 'books' && '圣经阅读'}
                {view === 'chapters' && currentBook?.name}
                {view === 'reader' && `${currentBook?.name} ${chapterNumber}章`}
              </h1>
              {(view === 'chapters' || view === 'reader') && currentBook && (
                <p className="text-[11px] text-ink-light truncate">
                  {testamentLabels[currentBook.testament]} · {currentBook.category}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="pb-16">
          {view === 'books' && <BookList books={bibleData} onOpen={openBook} />}

          {view === 'chapters' && currentBook && (
            <ChapterList book={currentBook} onOpen={openChapter} />
          )}

          {view === 'reader' && currentChapter && (
            <ChapterReader
              book={currentBook}
              chapter={currentChapter}
            />
          )}
        </main>

        {/* 底部章节切换（阅读页） */}
        {view === 'reader' && currentBook && (
          <ChapterNav
            book={currentBook}
            current={chapterNumber}
            onNavigate={openChapter}
          />
        )}
      </div>
    </div>
  )
}

// 章节上下导航
function ChapterNav({ book, current, onNavigate }) {
  const idx = book.chapters.findIndex((c) => c.number === current)
  const prev = idx > 0 ? book.chapters[idx - 1] : null
  const next = idx < book.chapters.length - 1 ? book.chapters[idx + 1] : null

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pb-4 z-10 pointer-events-none">
      <div className="flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-parchment-200 p-2 pointer-events-auto">
        <button
          disabled={!prev}
          onClick={() => prev && onNavigate(prev.number)}
          className="flex-1 flex items-center justify-center gap-1 h-10 rounded-xl text-sm font-medium text-accent-dark disabled:opacity-30 active:bg-parchment-100 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {prev ? `第${prev.number}章` : '已是首章'}
        </button>
        <div className="w-px h-6 bg-parchment-200" />
        <button
          disabled={!next}
          onClick={() => next && onNavigate(next.number)}
          className="flex-1 flex items-center justify-center gap-1 h-10 rounded-xl text-sm font-medium text-accent-dark disabled:opacity-30 active:bg-parchment-100 transition"
        >
          {next ? `第${next.number}章` : '已是末章'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
