export const FayverFlowLogo = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="flow_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>

    {/* Barra Vertical Principal */}
    <rect x="20" y="20" width="10" height="60" rx="5" fill="url(#flow_grad)" />

    {/* Barras Horizontales (Efecto Kanban) */}
    {/* Superior */}
    <rect x="35" y="20" width="45" height="15" rx="7.5" fill="#3B82F6" />
    {/* Media con un ligero hover interno o animación */}
    <rect x="35" y="42.5" width="32" height="15" rx="7.5" fill="#60A5FA" />
    {/* Inferior */}
    <rect x="35" y="65" width="20" height="15" rx="7.5" fill="#93C5FD" />
  </svg>
)
