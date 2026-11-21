import { useEffect, useId, useRef } from 'react'
import Icon from './Icon'

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const isOutside = (event, dialog) => {
  if (!dialog) return false
  const rect = dialog.getBoundingClientRect()
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
}

export default function Modal({ isOpen, onClose, title, description, children, footer, size = 'md' }) {
  const dialogRef = useRef(null)
  const pressedOutside = useRef(false)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onPointerDown={(event) => {
        pressedOutside.current = isOutside(event, dialogRef.current)
      }}
      onPointerUp={(event) => {
        if (pressedOutside.current && isOutside(event, dialogRef.current)) onClose()
        pressedOutside.current = false
      }}
      className={`modal-window m-auto w-[calc(100%-2rem)] rounded-md border border-slate-300 bg-white p-0 text-slate-900 shadow-2xl ${sizes[size]}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-300 bg-slate-50 px-5 py-4">
        <div>
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="max-h-[60dvh] overflow-y-auto overscroll-contain px-5 py-4">{children}</div>

      {footer ? (
        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-300 bg-slate-50 px-5 py-3">
          {footer}
        </div>
      ) : null}
    </dialog>
  )
}
