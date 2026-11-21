export default function GhBox({
  as: Tag = 'section',
  title,
  subtitle,
  actions,
  footer,
  className = '',
  bodyClassName = '',
  children,
  ...props
}) {
  return (
    <Tag className={`overflow-hidden rounded-md border border-slate-300 bg-white ${className}`} {...props}>
      {title || actions ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 bg-slate-50 px-4 py-3">
          <div className="min-w-0">
            {title ? <h3 className="text-sm font-semibold text-slate-900">{title}</h3> : null}
            {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={bodyClassName || 'p-4'}>{children}</div>
      {footer ? <div className="border-t border-slate-300 bg-slate-50 px-4 py-3">{footer}</div> : null}
    </Tag>
  )
}
