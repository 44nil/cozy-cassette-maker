import { cn } from "@/lib/utils";

interface CassetteTapeProps {
  bodyColor?: string;
  labelColor?: string;
  isPlaying?: boolean;
  className?: string;
  title?: string;
}

export const CassetteTape = ({ 
  bodyColor = "#D4A574", 
  labelColor = "#F5E6D3", 
  isPlaying = false,
  className,
  title = "" 
}: CassetteTapeProps) => {
  const darkerBodyStroke = bodyColor === "#D4A574" ? "#8c6b4a" : "#2D2D2D";

  return (
    <svg
      viewBox="0 0 400 250"
      className={cn("w-full max-w-md drop-shadow-2xl", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="plasticGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bodyColor} stopOpacity="1" />
          <stop offset="100%" stopColor={bodyColor} style={{ filter: "brightness(0.85)" }} stopOpacity="1" />
        </linearGradient>
        
        <linearGradient id="windowReflection" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
        </linearGradient>

        <radialGradient id="reelGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
           <stop offset="80%" stopColor="#e0e0e0" />
           <stop offset="100%" stopColor="#bdbdbd" />
        </radialGradient>
      </defs>

      {/* GÖVDE */}
      <rect x="10" y="10" width="380" height="230" rx="14" fill="url(#plasticGradient)" stroke={darkerBodyStroke} strokeWidth="3" />

      {/* VİDALAR */}
      {[
        [30, 30], [370, 30],
        [30, 230], [370, 230],
        [200, 235]
      ].map((pos, i) => (
        <g key={i} transform={`translate(${pos[0]}, ${pos[1]})`}>
           <circle cx="0" cy="0" r="5" fill="#555" stroke="#333" strokeWidth="1"/>
           <path d="M-2 -2 L2 2 M-2 2 L2 -2" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      ))}

      <path d="M60 240 L340 240 L325 185 L75 185 Z" fill="#2a2a2a" opacity="0.9" />
      
      {/* ETİKET */}
      <path
        d="M 40 45 H 360 A 5 5 0 0 1 365 50 V 160 A 5 5 0 0 1 360 165 H 280 A 50 50 0 0 0 120 165 H 40 A 5 5 0 0 1 35 160 V 50 A 5 5 0 0 1 40 45 Z"
        fill={labelColor}
        stroke="#000000"
        strokeOpacity="0.1"
        strokeWidth="1"
      />
      <line x1="50" y1="70" x2="350" y2="70" stroke={darkerBodyStroke} strokeWidth="0.5" opacity="0.5" />
      <line x1="50" y1="95" x2="350" y2="95" stroke={darkerBodyStroke} strokeWidth="0.5" opacity="0.5" />

      {/* SOL MAKARA (DÖNER) */}
      <g transform="translate(120, 125)">
        <circle cx="0" cy="0" r="42" fill="#3D2817" stroke="#22150c" strokeWidth="1" />
        <g 
          className={isPlaying ? "animate-[spin_3s_linear_infinite]" : ""} 
          style={{ transformOrigin: "0px 0px" }}
        >
          <circle cx="0" cy="0" r="28" fill="none" stroke="url(#reelGradient)" strokeWidth="4" />
          <circle cx="0" cy="0" r="12" fill="#fff" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <rect key={angle} x="-3" y="-28" width="6" height="16" fill="#fff" transform={`rotate(${angle})`} rx="2"/>
          ))}
           <circle cx="0" cy="0" r="4" fill="#333" />
        </g>
      </g>
      
      {/* SAĞ MAKARA (DÖNER) */}
      <g transform="translate(280, 125)">
        <circle cx="0" cy="0" r="32" fill="#3D2817" stroke="#22150c" strokeWidth="1" />
        <g 
          className={isPlaying ? "animate-[spin_3s_linear_infinite]" : ""} 
          style={{ transformOrigin: "0px 0px" }}
        >
           <circle cx="0" cy="0" r="28" fill="none" stroke="url(#reelGradient)" strokeWidth="4" />
           <circle cx="0" cy="0" r="12" fill="#fff" />
           {[0, 60, 120, 180, 240, 300].map((angle) => (
            <rect key={`r-${angle}`} x="-3" y="-28" width="6" height="16" fill="#fff" transform={`rotate(${angle})`} rx="2"/>
          ))}
          <circle cx="0" cy="0" r="4" fill="#333" />
        </g>
      </g>

      <rect x="155" y="118" width="90" height="14" fill="#3D2817" />

      {/* PENCERE */}
      <path d="M 145 85 H 255 L 265 165 H 135 Z" fill="#90a4ae" opacity="0.25" stroke="#78909c" strokeWidth="1" />
      <path d="M 145 85 H 255 L 265 165 H 135 Z" fill="url(#windowReflection)" opacity="0.6" pointerEvents="none" />
      <line x1="190" y1="155" x2="190" y2="162" stroke="#fff" strokeWidth="1" opacity="0.8"/>
      <line x1="210" y1="155" x2="210" y2="162" stroke="#fff" strokeWidth="1" opacity="0.8"/>

      <rect x="80" y="188" width="240" height="12" fill="#2f1f13" />
      <circle cx="90" cy="194" r="6" fill="#ddd" stroke="#999" strokeWidth="1"/>
      <circle cx="310" cy="194" r="6" fill="#ddd" stroke="#999" strokeWidth="1"/>
      <rect x="185" y="188" width="30" height="10" fill="#d7ccc8" rx="2" stroke="#a1887f" strokeWidth="1" />
      <rect x="192" y="192" width="16" height="2" fill="#5d4037" rx="1" />

      {/* KASET ADI */}
      <text x="200" y="80" textAnchor="middle" fill="#2D2D2D" style={{ fontFamily: "'Rock Salt', cursive", fontSize: "20px", opacity: 0.85, transform: "rotate(-1deg)" }} className="pointer-events-none select-none">
        {title}
      </text>
      <text x="55" y="60" fill={darkerBodyStroke} fontSize="10" fontFamily="sans-serif" fontWeight="900" opacity="0.5">A</text>
      <text x="345" y="60" fill={darkerBodyStroke} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.5" textAnchor="end">60 MIN</text>
    </svg>
  );
};