import { cn } from "@/lib/utils";

interface CassetteTapeProps {
  bodyColor?: string;
  labelColor?: string;
  isPlaying?: boolean;
  className?: string;
}

export const CassetteTape = ({ 
  bodyColor = "#D4A574", 
  labelColor = "#F5E6D3",
  isPlaying = false,
  className 
}: CassetteTapeProps) => {
  return (
    <svg
      viewBox="0 0 400 250"
      className={cn("w-full max-w-md", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main cassette body */}
      <rect
        x="20"
        y="20"
        width="360"
        height="210"
        rx="10"
        fill={bodyColor}
        stroke="#5D4E37"
        strokeWidth="3"
      />
      
      {/* Label area */}
      <rect
        x="40"
        y="40"
        width="320"
        height="110"
        rx="5"
        fill={labelColor}
        stroke="#5D4E37"
        strokeWidth="2"
      />
      
      {/* Left reel */}
      <g className={isPlaying ? "animate-reel origin-center" : ""} style={{ transformOrigin: "120px 185px" }}>
        <circle cx="120" cy="185" r="35" fill="#3D3D3D" stroke="#2D2D2D" strokeWidth="2" />
        <circle cx="120" cy="185" r="15" fill="#1D1D1D" />
        {/* Reel teeth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect
            key={angle}
            x="117"
            y="165"
            width="6"
            height="10"
            fill="#2D2D2D"
            transform={`rotate(${angle}, 120, 185)`}
          />
        ))}
      </g>
      
      {/* Right reel */}
      <g className={isPlaying ? "animate-reel origin-center" : ""} style={{ transformOrigin: "280px 185px" }}>
        <circle cx="280" cy="185" r="35" fill="#3D3D3D" stroke="#2D2D2D" strokeWidth="2" />
        <circle cx="280" cy="185" r="15" fill="#1D1D1D" />
        {/* Reel teeth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect
            key={`right-${angle}`}
            x="277"
            y="165"
            width="6"
            height="10"
            fill="#2D2D2D"
            transform={`rotate(${angle}, 280, 185)`}
          />
        ))}
      </g>
      
      {/* Tape visible between reels */}
      <rect x="155" y="175" width="90" height="20" fill="#3D2817" />
      
      {/* Screws */}
      <circle cx="50" cy="50" r="4" fill="#808080" />
      <circle cx="350" cy="50" r="4" fill="#808080" />
      <circle cx="50" cy="200" r="4" fill="#808080" />
      <circle cx="350" cy="200" r="4" fill="#808080" />
      
      {/* Label lines for writing */}
      <line x1="60" y1="70" x2="340" y2="70" stroke="#5D4E37" strokeWidth="1" opacity="0.3" />
      <line x1="60" y1="95" x2="340" y2="95" stroke="#5D4E37" strokeWidth="1" opacity="0.3" />
      <line x1="60" y1="120" x2="340" y2="120" stroke="#5D4E37" strokeWidth="1" opacity="0.3" />
    </svg>
  );
};
