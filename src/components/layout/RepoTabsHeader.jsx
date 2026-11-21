import { useRef } from 'react'
import Icon from '../ui/Icon'

export default function RepoTabsHeader({ tabs, activeId, onChange, label = 'Secciones del repositorio' }) {
  const tabRefs = useRef({})

  const handleKeyDown = (event, index) => {
    let nextIndex = null
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    if (nextIndex === null) return

    let checked = 0
    while (tabs[nextIndex]?.disabled && checked < tabs.length) {
      if (event.key === 'ArrowRight') nextIndex = (nextIndex + 1) % tabs.length
      else if (event.key === 'ArrowLeft') nextIndex = (nextIndex - 1 + tabs.length) % tabs.length
      else nextIndex = null
      checked += 1
    }
    if (nextIndex === null || tabs[nextIndex]?.disabled) return

    event.preventDefault()
    const nextTab = tabs[nextIndex]
    onChange(nextTab.id)
    tabRefs.current[nextTab.id]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-1 overflow-x-auto border-b border-slate-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab, index) => {
        const selected = activeId === tab.id
        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[tab.id] = node
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`relative flex shrink-0 items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors after:absolute after:inset-x-2 after:bottom-0 after:border-b-2 ${
              selected
                ? 'text-brand after:border-brand'
                : 'text-slate-600 after:border-transparent hover:text-slate-900'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {tab.icon ? <Icon name={tab.icon} className="h-4 w-4" /> : null}
            {tab.label}
            {typeof tab.count === 'number' ? (
              <span className="rounded-full bg-slate-200/70 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
