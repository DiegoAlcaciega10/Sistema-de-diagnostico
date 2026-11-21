export default function PageHeader({ eyebrow, title, emphasis, suffix, description, actions }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-300 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand">{eyebrow}</p> : null}
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">
          {title} {emphasis ? <span className="text-brand">{emphasis}</span> : null} {suffix}
        </h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}
