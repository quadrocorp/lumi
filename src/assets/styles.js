export const stylesBlind = {
    "base": "w-full h-screen bg-amber-500 flex items-center justify-center transition-all duration-600 ease-in-out",
    "up": "-translate-y-full",
    "down": "translate-y-full"
}

export const glassButtonStyles = {
  container: "flex flex-col gap-5 p-10",
  base: `
    relative h-[50px] px-4 bg-transparent border-0 
    border-t border-white/20 rounded-full text-white 
    font-semibold text-base cursor-pointer overflow-hidden 
    flex items-center justify-center gap-2.5 
    transition-all duration-250 ease-[cubic-bezier(0.86,0,0.07,1)]
    shadow-[0_4px_30px_rgba(0,0,0,0.1)]
    isolate
  `,
  hover: "hover:border-white/30 hover:rounded-xl hover:bg-white/13",
  glassEffect: `
    absolute inset-0 backdrop-blur-md bg-white/2.5 
    rounded-xl z-10 before:content-[''] before:absolute 
    before:inset-0 before:bg-[url('/WhiteNoiseDithering.png')] 
    before:opacity-10 before:bg-[length:150px_150px] 
    before:pointer-events-none before:z-10
  `,
  content: "relative z-20 flex items-center gap-2.5 min-w-fit",
  circleContainer: `
    absolute inset-0 overflow-hidden z-0 
    clip-path-[inset(0_round_16px)]
  `,
  circle: `
    absolute w-6 h-6 rounded-full bg-white/50 
    transform -translate-x-1/2 -translate-y-1/2 
    pointer-events-none filter blur-md opacity-0 
    transition-all duration-250 ease-in-out
  `,
  circleHover: "group-hover:opacity-100",
  circleActive: `
    group-active:w-12 group-active:h-12 
    group-active:blur-2xl group-active:bg-white/70
  `,
  active: "group-active:bg-white/24"
};