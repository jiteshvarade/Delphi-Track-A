interface SelectionPopupProps {
  onExplain: () => void
  onRephrase: () => void
  onCite: () => void
}

export default function SelectionPopup({ onExplain, onRephrase, onCite }: SelectionPopupProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-2 flex gap-2 shadow-lg">
      <button
        onClick={onExplain}
        className="px-3 py-1 text-sm text-white hover:bg-gray-700 rounded transition-colors"
      >
        Explain
      </button>
      <button
        onClick={onRephrase}
        className="px-3 py-1 text-sm text-white hover:bg-gray-700 rounded transition-colors"
      >
        Rephrase
      </button>
      <button
        onClick={onCite}
        className="px-3 py-1 text-sm text-white hover:bg-gray-700 rounded transition-colors"
      >
        Cite
      </button>
    </div>
  )
}
