interface LogoProps {
  variant?: "default" | "white"
  className?: string
}

export function Logo({ variant = "default", className = "" }: LogoProps) {
  const isWhite = variant === "white"
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo icon - two squares */}
      <div className="flex">
        <div className={`w-10 h-10 flex items-center justify-center ${isWhite ? "bg-white" : "bg-primary"}`}>
          <span className={`font-serif text-2xl font-bold ${isWhite ? "text-primary" : "text-white"}`}>A</span>
        </div>
        <div className={`w-10 h-10 flex items-center justify-center ${isWhite ? "bg-white" : "bg-foreground"}`}>
          <span className={`font-serif text-2xl font-bold ${isWhite ? "text-foreground" : "text-white"}`}>T</span>
        </div>
      </div>
      {/* Brand name */}
      <span className={`font-serif text-xl font-bold mt-2 ${isWhite ? "text-white" : "text-foreground"}`}>
        AfroTentacles
      </span>
      {/* Tagline */}
      <span className={`text-xs mt-0.5 ${isWhite ? "text-white/70" : "text-muted-foreground"}`}>
        Comprendre les équilibres africains
      </span>
    </div>
  )
}

export function LogoHorizontal({ variant = "default", className = "" }: LogoProps) {
  const isWhite = variant === "white"
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo icon - two squares */}
      <div className="flex">
        <div className={`w-8 h-8 flex items-center justify-center ${isWhite ? "bg-white" : "bg-primary"}`}>
          <span className={`font-serif text-lg font-bold ${isWhite ? "text-primary" : "text-white"}`}>A</span>
        </div>
        <div className={`w-8 h-8 flex items-center justify-center ${isWhite ? "bg-white" : "bg-foreground"}`}>
          <span className={`font-serif text-lg font-bold ${isWhite ? "text-foreground" : "text-white"}`}>T</span>
        </div>
      </div>
      {/* Brand text */}
      <div className="flex flex-col">
        <span className={`font-serif text-lg font-bold leading-tight ${isWhite ? "text-white" : "text-foreground"}`}>
          AfroTentacles
        </span>
        <span className={`text-[10px] leading-tight ${isWhite ? "text-white/70" : "text-muted-foreground"}`}>
          Comprendre les équilibres africains
        </span>
      </div>
    </div>
  )
}
