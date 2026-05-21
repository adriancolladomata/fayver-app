import { useEffect } from 'react'
import { useLists } from '../context/ListContext'

export const ActivitySidebar = () => {
  const { activities, isHistoryOpen, setIsHistoryOpen } = useLists()

  // Cerrar el panel si se pulsa la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsHistoryOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsHistoryOpen])

  return (
    <>
      {/* Fondo sutil semitransparente con desenfoque de fondo */}
      {isHistoryOpen && (
        <div
          className='absolute inset-0 bg-black/10 backdrop-blur-xs z-30 transition-opacity duration-300'
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Panel lateral deslizable y responsivo */}
      <div
        className={`
          absolute right-4 z-40 bg-white shadow-2xl border border-neutral-200 rounded-xl p-5 flex flex-col
          transition-all duration-300 ease-in-out
          
          /* Margen superior del 4% y separación inferior del suelo */
          top-[4%] bottom-4 
          
          /* Ancho responsivo: 90% del ancho visible en móvil, 320px fijos en escritorio */
          w-[85vw] sm:w-80
          
          /* Animación de entrada/salida y control de clics fantasmas */
          ${isHistoryOpen ? 'translate-x-0 opacity-100' : 'translate-x-[110%] opacity-0 pointer-events-none'}
        `}
      >
        {/* Cabecera interna */}
        <div className='flex justify-between items-center pb-3 border-b border-neutral-100'>
          <div>
            <h3 className='font-bold text-neutral-800 text-sm sm:text-base flex items-center gap-2'>
              Historial Reciente
            </h3>
            <p className='text-[12px] text-neutral-400 mt-0.5'>Controla tus actividades</p>
          </div>
          <button
            onClick={() => setIsHistoryOpen(false)}
            className='text-neutral-400 hover:text-neutral-600 font-bold p-1 transition-colors cursor-pointer text-xs'
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del scroll con los registros de actividad */}
        <div className='flex-1 overflow-y-auto py-3 space-y-2.5 custom-scrollbar pr-1'>
          {activities.length === 0 ? (
            <div className='text-center py-12 text-neutral-500 space-y-1.5'>
              <p className='text-sm font-semibold'>Tablón sin movimientos</p>
              <p className='text-[12px] text-neutral-400 px-4'>Las acciones que realices en esta sesión aparecerán aquí.</p>
            </div>
          ) : (
            activities.map(act => (
              <div
                key={act.id}
                className='text-[12px] bg-neutral-50/80 p-3 rounded-lg border border-neutral-100 shadow-2xs hover:bg-neutral-50 transition-colors animate-in fade-in slide-in-from-bottom-1 duration-200'
              >
                <p className='text-neutral-600 leading-relaxed font-medium break-words'>{act.text}</p>
                <span className='text-[11px] text-neutral-400 block mt-1.5 text-right font-mono'>{act.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
