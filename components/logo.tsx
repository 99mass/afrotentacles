interface LogoProps {
  variant?: "default" | "white"
  size?: "sm" | "md" | "lg"
  className?: string
  showdescription?: boolean
}

const sizeConfig = {
  sm: { box: "w-7 h-7", letter: "text-base", name: "text-sm", tagline: "text-[9px]", gap: "mt-1" },
  md: { box: "w-10 h-10", letter: "text-2xl", name: "text-xl", tagline: "text-xs", gap: "mt-2" },
  lg: { box: "w-12 h-12", letter: "text-3xl", name: "text-2xl", tagline: "text-sm", gap: "mt-2" },
}

export function Logo({ variant = "default", size = "md", className = "" }: LogoProps) {
  const isWhite = variant === "white"
  const s = sizeConfig[size]
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo icon - two squares (always red A + black T with white letters) */}
      <div className="flex">
        <div className={`${s.box} flex items-center justify-center bg-primary`}>
          <span className={`font-serif ${s.letter} font-bold text-white`}>A</span>
        </div>
        <div className="w-1"></div>
        <div className={`${s.box} flex items-center justify-center bg-black`}>
          <span className={`font-serif ${s.letter} font-bold text-white`}>T</span>
        </div>
      </div>
      {/* Brand name */}
      <span className={`font-serif ${s.name} font-bold ${s.gap} ${isWhite ? "text-white" : "text-foreground"}`}>
        AfroTentacles
      </span>
      {/* Tagline */}
      <span className={`${s.tagline} mt-0.5 ${isWhite ? "text-white/70" : "text-muted-foreground"}`}>
        Comprendre les équilibres africains
      </span>
    </div>
  )
}

export function LogoHorizontal({ variant = "default", className = "", showdescription = true }: LogoProps) {
  const isWhite = variant === "white"
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo icon - two squares */}
      <div className="flex">
        <div className={`w-8 h-8 flex items-center justify-center  bg-primary`}>
          <span className={`font-serif text-lg font-bold text-white`}>A</span>
        </div>
        <div className={`w-8 h-8 flex items-center justify-center bg-foreground`}>
          <span className={`font-serif text-lg font-bold text-white`}>T</span>
        </div>
      </div>
      {/* Brand text */}
      <div className="flex flex-col">
        <span className={`font-serif text-lg font-bold leading-tight ${isWhite ? "text-white" : "text-foreground"}`}>
          AfroTentacles
        </span>
       {showdescription && <span className={`text-[10px] leading-tight ${isWhite ? "text-white/70" : "text-muted-foreground"}`}>
          Comprendre les équilibres africains
        </span>}
      </div>
    </div>
  )
}
