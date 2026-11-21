import Icon from './Icon'

const variants = {
  primary: 'bg-brand text-white border border-brand hover:bg-brand-deep disabled:bg-brand/40 disabled:border-brand/40',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-rose-600 text-white border border-rose-600 hover:bg-rose-700',
  outline: 'bg-white text-brand border border-brand/40 hover:bg-indigo-50',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  children,
  type = 'button',
  ...props
}) {
  const sizes = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
  const iconNode = icon ? <Icon name={icon} className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} /> : null

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes} ${className}`}
      {...props}
    >
      {iconPosition === 'left' && iconNode}
      {children}
      {iconPosition === 'right' && iconNode}
    </button>
  )
}
