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
  // Gövde renginin koyu tonunu hesapla (Konturlar için)
  const isTransparent = bodyColor.startsWith("rgba"); // Şeffaf kaset kontrolü
  const strokeColor = isTransparent ? "rgba(0,0,0,0.5)" : "#2D2D2D";

  return (
    <svg
      viewBox="0 0 400 250"
      className={cn("w-full max-w-md drop-shadow-2xl", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Plastik Gövde Dokusu */}
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bodyColor} stopOpacity="0.9" />
          <stop offset="50%" stopColor={bodyColor} stopOpacity="1" />
          <stop offset="100%" stopColor={bodyColor} stopOpacity="0.8" />
        </linearGradient>

        {/* Pencere Yansıması */}
        <linearGradient id="windowGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.2" />
        </linearGradient>

        {/* Makara Efekti */}
        <radialGradient id="reelSilver" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#bdbdbd" />
        </radialGradient>
      </defs>

      {/* --- 1. GÖVDE --- */}
      {/* Ana Kasa */}
      <path
        d="M 20 20 H 380 A 10 10 0 0 1 390 30 V 220 A 10 10 0 0 1 380 230 H 20 A 10 10 0 0 1 10 220 V 30 A 10 10 0 0 1 20 20 Z"
        fill="url(#bodyGradient)"
        stroke={strokeColor}
        strokeWidth="2"
      />

      {/* Alt Çıkıntı (Trapez Alan) */}
      <path
        d="M 50 230 L 350 230 L 340 190 H 60 L 50 230 Z"
        fill="rgba(0,0,0,0.2)"
        stroke="none"
      />

      {/* Vidalar (4 Köşe + 1 Alt Orta) */}
      {[
        [25, 35], [375, 35], 
        [25, 215], [375, 215], 
        [200, 210]
      ].map((pos, i) => (
        <g key={i} transform={`translate(${pos[0]}, ${pos[1]})`}>
          <circle cx="0" cy="0" r="5" fill="#555" stroke="#222" strokeWidth="1"/>
          <path d="M-3 0 H3 M0 -3 V3" stroke="#333" strokeWidth="1.5" strokeLinecap="round" transform="rotate(45)"/>
        </g>
      ))}

      {/* --- 2. ETİKET (STICKER) --- */}
      {/* Üst Kısım Şerit Etiket */}
      <rect
        x="35" y="35" width="330" height="135"
        rx="8"
        fill={labelColor}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
      />
      
      {/* Etiket Süslemeleri (Çizgiler) */}
      <line x1="45" y1="55" x2="355" y2="55" stroke={bodyColor} strokeWidth="4" opacity="0.3" />
      <line x1="45" y1="155" x2="355" y2="155" stroke={bodyColor} strokeWidth="12" opacity="0.2" />

      {/* --- 3. ORTA PENCERE VE MAKARALAR --- */}
      {/* Pencere Çerçevesi */}
      <path
        d="M 90 85 H 310 V 145 H 90 Z"
        fill="#2D2D2D"
        rx="5"
      />
      {/* Şeffaf Pencere */}
      <rect x="130" y="90" width="140" height="50" rx="2" fill="rgba(255,255,255,0.2)" />

      {/* SOL MAKARA */}
      <g transform="translate(115, 115)">
        {/* Bant (Kahverengi) */}
        <circle cx="0" cy="0" r="38" fill="#4A3B2D" />
        {/* Dönme Animasyonu */}
        <g className={isPlaying ? "animate-[spin_3s_linear_infinite]" : ""} style={{ transformOrigin: "0px 0px" }}>
          <circle cx="0" cy="0" r="22" fill="url(#reelSilver)" stroke="#666" strokeWidth="1" />
          {/* Dişliler */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path key={angle} d="M -3 -22 V -10 L 0 -6 L 3 -10 V -22 Z" fill="#fff" transform={`rotate(${angle})`} />
          ))}
        </g>
      </g>

      {/* SAĞ MAKARA */}
      <g transform="translate(285, 115)">
        {/* Bant (Daha az) */}
        <circle cx="0" cy="0" r="28" fill="#4A3B2D" />
        <g className={isPlaying ? "animate-[spin_3s_linear_infinite]" : ""} style={{ transformOrigin: "0px 0px" }}>
          <circle cx="0" cy="0" r="22" fill="url(#reelSilver)" stroke="#666" strokeWidth="1" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path key={angle} d="M -3 -22 V -10 L 0 -6 L 3 -10 V -22 Z" fill="#fff" transform={`rotate(${angle})`} />
          ))}
        </g>
      </g>

      {/* Aradaki Bant */}
      <rect x="140" y="108" width="120" height="14" fill="#4A3B2D" />

      {/* Pencere Üzerindeki Yazılar */}
      <text x="200" y="138" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="monospace" opacity="0.8">100 50 0</text>

      {/* --- 4. ALT MEKANİZMA --- */}
      {/* Manyetik Bant */}
      <rect x="90" y="195" width="220" height="12" fill="#291B12" />
      {/* Metal Baskı Parçası */}
      <rect x="185" y="195" width="30" height="12" fill="#D7CCC8" rx="2" />
      <rect x="192" y="200" width="16" height="3" fill="#5D4037" rx="1" />
      
      {/* Delikler */}
      <circle cx="130" cy="201" r="5" fill="#000" />
      <circle cx="270" cy="201" r="5" fill="#000" />

      {/* --- 5. KASET ADI --- */}
      <text
        x="200" 
        y="78" 
        textAnchor="middle" 
        fill="#2D2D2D" 
        style={{ 
          fontFamily: "'Patrick Hand', cursive", // El yazısı
          fontSize: "24px",
          fontWeight: "bold",
          opacity: 0.85,
          letterSpacing: "0.5px"
        }}
        className="pointer-events-none select-none"
      >
        {title}
      </text>

      {/* A Yüzü */}
      <text x="50" y="52" fill="#2D2D2D" fontSize="14" fontWeight="bold" opacity="0.5" fontFamily="sans-serif">A</text>
      <text x="350" y="52" textAnchor="end" fill="#2D2D2D" fontSize="10" fontWeight="bold" opacity="0.5" fontFamily="sans-serif">C-60</text>

    </svg>
  );
};