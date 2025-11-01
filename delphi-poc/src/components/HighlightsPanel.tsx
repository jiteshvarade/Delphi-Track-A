import { useState, useEffect } from 'react'
import { highlightsStorage, type Highlight } from '../utils/highlightsStorage'

interface HighlightsPanelProps {
  articleId: string
  selectedText: string
  onHighlight: (color: Highlight['color'], note: string) => void
  onClose: () => void
}

const colorClasses = {
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
  green: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  pink: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700',
}

const colorLabels = {
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  pink: 'Pink',
}

export default function HighlightsPanel({ articleId, selectedText, onHighlight, onClose }: HighlightsPanelProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [selectedColor, setSelectedColor] = useState<Highlight['color']>('yellow')
  const [note, setNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')

  useEffect(() => {
    loadHighlights()
  }, [articleId])

  const loadHighlights = () => {
    setHighlights(highlightsStorage.getHighlights(articleId))
  }

  const handleSave = () => {
    if (!selectedText.trim()) return
    
    onHighlight(selectedColor, note)
    setNote('')
    loadHighlights()
    onClose()
  }

  const handleDelete = (id: string) => {
    highlightsStorage.deleteHighlight(id)
    loadHighlights()
  }

  const handleUpdateNote = (id: string) => {
    highlightsStorage.updateHighlight(id, { note: editNote })
    setEditingId(null)
    setEditNote('')
    loadHighlights()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose}>
      <div 
        data-highlights-panel="true"
        className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-[500px] bg-white dark:bg-black shadow-2xl border-t md:border-t-0 md:border-l border-gray-200 dark:border-zinc-800 flex flex-col rounded-t-2xl md:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Highlights</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {highlights.length} saved {highlights.length === 1 ? 'highlight' : 'highlights'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* New Highlight Form */}
        {selectedText && (
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Text:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic border-l-2 border-gray-400 dark:border-gray-600 pl-3 mb-4 line-clamp-3">
              {selectedText}
            </p>

            {/* Color Selector */}
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Highlight Color:</p>
              <div className="flex gap-2">
                {(Object.keys(colorClasses) as Highlight['color'][]).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`flex-1 px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                      selectedColor === color 
                        ? `${colorClasses[color]} border-gray-900 dark:border-white` 
                        : `${colorClasses[color]} border-transparent hover:border-gray-400`
                    }`}
                  >
                    {colorLabels[color]}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 mb-3"
              rows={2}
            />

            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Save Highlight
            </button>
          </div>
        )}

        {/* Saved Highlights List */}
        <div className="flex-1 overflow-y-auto p-4">
          {highlights.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">No highlights yet</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select text to create your first highlight</p>
            </div>
          ) : (
            <div className="space-y-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className={`p-4 rounded-lg border ${colorClasses[highlight.color]}`}
                >
                  <p className="text-sm text-gray-900 dark:text-white mb-2 font-medium line-clamp-3">
                    "{highlight.text}"
                  </p>
                  
                  {editingId === highlight.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateNote(highlight.id)}
                          className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-xs rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {highlight.note && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">
                          Note: {highlight.note}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(highlight.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(highlight.id)
                              setEditNote(highlight.note)
                            }}
                            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(highlight.id)}
                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
