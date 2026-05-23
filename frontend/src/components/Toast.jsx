export const Toast = ({ message, type, visible }) => {
  // Muestra un toast en pantalla solo si hay mensaje y está activo
  if (!visible || !message) return null

  const config = type === 'error'
    ? {
      borderColor: 'border-rose-100',
      iconBg: 'bg-rose-50 text-rose-600',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    : {
      borderColor: 'border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-600',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }

  return (
    <div className='fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 sm:px-0 pointer-events-none'>
      <div className={`flex items-start gap-3 p-4 rounded-xl border bg-white shadow-xl shadow-slate-900/5 pointer-events-auto transition-all duration-300 ${config.borderColor}`}>
        <div className={`flex-shrink-0 p-1.5 rounded-lg ${config.iconBg}`}>
          {config.icon}
        </div>
        <div className='flex-1 pt-0.5 min-w-0'>
          <p className='text-sm font-medium text-slate-800 leading-5'>{message}</p>
        </div>
      </div>
    </div>
  )
}
