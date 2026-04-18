/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Gamepad2, 
  Layers, 
  Palette, 
  Sparkles,
  Grid3X3,
  Timer,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { generateMaze } from "./lib/maze";
import { themeShowcase, sections, difficultyLevels, getGridSize } from "./constants";

const DynamicMazeBackground = () => {
  const mazeData = useMemo(() => {
    const maze = generateMaze(60, 60);
    const lines = [];
    for (let y = 0; y < 60; y++) {
      for (let x = 0; x < 60; x++) {
        const cell = maze[y][x];
        if (cell.walls.right) lines.push(`M ${x + 1} ${y} L ${x + 1} ${y + 1}`);
        if (cell.walls.bottom) lines.push(`M ${x} ${y + 1} L ${x + 1} ${y + 1}`);
      }
    }
    return lines.join(" ");
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]">
      <svg className="w-full h-full" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid slice">
        <path d={mazeData} stroke="white" strokeWidth="0.015" fill="none" opacity="1" />
      </svg>
    </div>
  );
};

const MiniGameWindow = ({ themeColors }: { themeColors: any }) => {
  const mazeLines = useMemo(() => {
    const maze = generateMaze(15, 15);
    const lines = [];
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const cell = maze[y][x];
        if (cell.walls.right) lines.push(`M ${x + 1} ${y} L ${x + 1} ${y + 1}`);
        if (cell.walls.bottom) lines.push(`M ${x} ${y + 1} L ${x + 1} ${y + 1}`);
      }
    }
    return lines.join(" ");
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-[inherit]" style={{ backgroundColor: themeColors.mazeBg }}>
      {/* Zoomed in maze view */}
      <svg className="absolute w-[200%] h-[200%] opacity-20" viewBox="0 0 15 15" preserveAspectRatio="xMidYMid slice" style={{ transform: 'scale(1.5)' }}>
        <path d={mazeLines} stroke={themeColors.grid} strokeWidth="0.3" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Player Block - Precise square placement */}
      <div className="relative z-10 w-12 h-12 rounded-[4px] shadow-2xl transition-transform duration-700 group-hover:scale-110" style={{ backgroundColor: themeColors.player, boxShadow: `0 0 30px ${themeColors.playerShadow}` }} />
    </div>
  );
};

const HeroMazeVisual = ({ themeColors }: { themeColors: any }) => {
  const mazeLines = useMemo(() => {
    const maze = generateMaze(25, 25);
    const lines = [];
    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        const cell = maze[y][x];
        if (cell.walls.right) lines.push(`M ${x + 1} ${y} L ${x + 1} ${y + 1}`);
        if (cell.walls.bottom) lines.push(`M ${x} ${y + 1} L ${x + 1} ${y + 1}`);
        if (cell.walls.top) lines.push(`M ${x} ${y} L ${x + 1} ${y}`);
        if (cell.walls.left) lines.push(`M ${x} ${y} L ${x} ${y + 1}`);
      }
    }
    return lines.join(" ");
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        animate={{ 
          rotateX: [5, -5, 5],
          rotateY: [5, 15, 5],
          y: [0, -8, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 12, 
          ease: "easeInOut" 
        }}
        className="relative w-[400px] sm:w-[600px] lg:w-[900px] aspect-square flex items-center justify-center pointer-events-none"
        style={{ perspective: "1500px" }}
      >
        {/* Glow Core */}
        <div 
          className="absolute inset-0 blur-[150px] rounded-full opacity-10 scale-90"
          style={{ backgroundColor: themeColors.player }}
        />
        
        {/* Maze Grid */}
        <svg 
          className="w-full h-full opacity-20 sm:opacity-30" 
          viewBox="0 0 25 25" 
          stroke={themeColors.grid} 
          strokeWidth="0.04" 
          fill="none"
        >
          <motion.path 
            d={mazeLines} 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [difficulty, setDifficulty] = useState("Medium");
  const [activeThemeId, setActiveThemeId] = useState("orange");

  const activeTheme = useMemo(() => {
    return themeShowcase.find(t => t.id === activeThemeId)?.theme || themeShowcase[1].theme;
  }, [activeThemeId]);

  const cssVars = {
    "--accent-main": activeTheme.player,
    "--accent-glow": `${activeTheme.player}44`,
    "--site-bg": "#000000",
    "--card-bg": "#0d0d0d",
    "--text-primary": "#ffffff",
    "--text-secondary": "rgba(255,255,255,0.2)",
    "--border-color": "rgba(255,255,255,0.05)",
  } as any;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          if (
            element.offsetTop <= scrollPos &&
            element.offsetTop + element.offsetHeight > scrollPos
          ) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-700 font-sans selection:bg-[var(--accent-main)]/30 overflow-x-hidden" style={{ ...cssVars, backgroundColor: "var(--site-bg)", color: "var(--text-primary)" }}>
      <DynamicMazeBackground />
      
      <nav className="fixed right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 sm:gap-3">
        {sections.map((section, idx) => (
          <motion.button
            key={section.id}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.1 * idx,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }}
            onClick={() => {
              document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
              setActiveSection(section.id);
            }}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[2px] sm:tracking-[3px] transition-all duration-300 backdrop-blur-[64px] border shadow-2xl ${
              activeSection === section.id 
                ? "text-black scale-110" 
                : "text-[var(--text-secondary)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            style={{ 
              backgroundColor: activeSection === section.id ? "var(--accent-main)" : "rgba(255,255,255,0.03)",
              borderColor: activeSection === section.id ? "var(--accent-main)" : "rgba(255,255,255,0.1)"
            }}
          >
            {section.label}
          </motion.button>
        ))}
      </nav>

      <div className="p-10 lg:p-16 relative">
        <section id="hero" className="h-[calc(100vh-128px)] w-full relative">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full relative overflow-hidden rounded-[56px] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] lg:shadow-[inset_0_0_40px_var(--accent-glow)] ring-1 ring-white/5"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(17,17,17,0.8)_0%,rgba(0,0,0,0.95)_70%)]" />
            
            <div className="absolute inset-0 z-11 pointer-events-none opacity-[0.05]">
              <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white to-transparent transform skew-x-[-25deg] animate-[glint_20s_linear_infinite]" />
            </div>
            
            <div className="absolute inset-0 opacity-40 z-10 pointer-events-none" 
                 style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
            />

            <div className="absolute inset-0 z-20 flex flex-col justify-between p-16 md:p-24 pointer-events-none">
              <div className="max-w-[800px] pointer-events-auto">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-[42px] sm:text-[64px] lg:text-[100px] font-[900] tracking-[-3px] sm:tracking-[-4px] lg:tracking-[-8px] leading-[0.8] flex flex-col">
                    <span className="text-[var(--accent-main)] drop-shadow-[0_0_30px_var(--accent-glow)] uppercase">MAZE.EXE</span>
                    <span className="opacity-20 text-[18px] sm:text-[24px] lg:text-[40px] tracking-widest mt-4">has stopped working</span>
                  </h1>
                </motion.div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <HeroMazeVisual themeColors={activeTheme} />
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pointer-events-auto flex justify-center sm:justify-start"
              >
                <a 
                  href="https://mazegame-exe-stopped-working.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-center px-10 sm:px-14 py-4 sm:py-6 bg-white text-black rounded-full font-black text-[10px] sm:text-xs uppercase tracking-[3px] sm:tracking-[5px] transition-all transform hover:scale-105 active:scale-95 shadow-2xl hover:bg-[var(--accent-main)]"
                >
                  Dive into the maze
                </a>
              </motion.div>
            </div>

            <div className="absolute right-40 bottom-20 z-30 hidden lg:block">
              <motion.div 
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.8,
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="w-[300px] backdrop-blur-[40px] border rounded-[40px] p-8"
                style={{ backgroundColor: "rgba(13,13,13,0.7)", borderColor: "var(--border-color)" }}
              >
                <div className="text-[9px] uppercase font-black tracking-[5px] mb-6 font-mono" style={{ color: "var(--accent-main)" }}>00. Difficulty_Schema</div>
                
                <div className="flex flex-col gap-2 mb-8">
                  {difficultyLevels.map((lvl) => (
                    <button 
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500 border ${
                        difficulty === lvl 
                          ? "shadow-[0_0_20px_var(--accent-glow)]" 
                          : "border-transparent opacity-20 hover:opacity-40"
                      }`}
                      style={{ 
                        backgroundColor: difficulty === lvl ? "var(--accent-main)11" : "transparent",
                        borderColor: difficulty === lvl ? "var(--accent-main)44" : "transparent",
                        color: difficulty === lvl ? "var(--accent-main)" : "inherit"
                      }}
                    >
                      <span className="text-[10px] font-black tracking-widest uppercase">{lvl}</span>
                      {difficulty === lvl && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent-main)", boxShadow: "0 0 10px var(--accent-main)" }} />}
                    </button>
                  ))}
                </div>

                <div className="flex-1 w-full relative flex flex-col items-center justify-center p-6 bg-black/40 rounded-[28px] border" style={{ borderColor: 'var(--border-color)' }}>
                   <div 
                    className="grid gap-1 opacity-30 transition-all duration-700 ease-in-out flex-grow"
                    style={{ 
                      gridTemplateColumns: `repeat(${getGridSize(difficulty)}, minmax(0, 1fr))`,
                      width: '60%',
                      aspectRatio: '1/1'
                    }}
                  >
                    {Array.from({ length: getGridSize(difficulty) ** 2 }).map((_, i) => (
                      <div key={i} className="border border-white/20 rounded-[1px] bg-white/[0.01]" />
                    ))}
                  </div>
                  <div className="mt-4 text-[8px] opacity-20 font-mono tracking-widest uppercase text-white">State_{difficulty}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>

      <section id="showcase" className="min-h-screen py-40 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="font-bold text-[10px] tracking-[5px] uppercase mb-6 block font-mono" style={{ color: "var(--accent-main)" }}>01. Design Protocols</span>
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-[900] tracking-[-3px] sm:tracking-[-6px] leading-[0.8] text-white lowercase">
                aesthetic <br/> <span className="text-white/20">calibration.</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {themeShowcase.map((theme, i) => (
              <motion.div 
                key={theme.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: i * 0.1,
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={() => setActiveThemeId(theme.id)}
                className={`group cursor-pointer relative border rounded-[48px] sm:rounded-[64px] overflow-hidden p-8 sm:p-14 transition-all duration-700 h-auto lg:h-[680px] flex flex-col ${
                  activeThemeId === theme.id ? "ring-2 ring-[var(--accent-main)] shadow-[0_0_40px_var(--accent-glow)] lg:shadow-[inset_0_0_60px_var(--accent-glow)]" : "hover:border-[var(--accent-main)]/20"
                }`}
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              >
                <div className="relative z-20 mb-8 sm:mb-12">
                   <div className="text-[10px] uppercase tracking-[8px] font-black mb-5" style={{ color: activeThemeId === theme.id ? 'var(--accent-main)' : 'var(--text-secondary)' }}>PROTOCOL_{theme.id.toUpperCase()}</div>
                   <h3 className="text-3xl sm:text-5xl font-black tracking-tight mb-5 leading-none">{theme.title}</h3>
                   <p className="opacity-40 max-w-[320px] text-sm sm:text-base font-medium leading-relaxed">{theme.description}</p>
                </div>

                <div className="flex-grow flex items-center justify-center p-6 sm:p-8 bg-black/20 rounded-[32px] sm:rounded-[40px] border" style={{ borderColor: 'var(--border-color)' }}>
                   <div className="relative w-full aspect-[3/4] lg:aspect-video rounded-[24px] sm:rounded-[28px] shadow-2xl transition-all duration-700 group-hover:scale-[1.02] ring-4 ring-white/10 ring-inset overflow-hidden">
                      <MiniGameWindow themeColors={theme.theme} />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="gameplay" className="min-h-screen py-40 px-12">
        <div className="max-w-7xl mx-auto space-y-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="font-bold text-[10px] tracking-[5px] uppercase mb-8 block font-mono" style={{ color: "var(--accent-main)" }}>02. Logic Control</span>
              <h2 className="text-6xl sm:text-8xl lg:text-9xl font-[900] tracking-[-4px] sm:tracking-[-8px] mb-8 sm:mb-12 leading-[0.8] lowercase text-white">
                swipe <br/> <span className="text-white/10">control.</span>
              </h2>
              <p className="text-lg sm:text-xl text-white/40 leading-relaxed max-w-md font-medium">
                Native gesture mapping. Zero latency interaction designed for modern web acceleration.
              </p>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="h-[500px] sm:h-[600px] lg:aspect-[4/5] lg:h-auto bg-white/[0.01] backdrop-blur-[60px] rounded-[48px] sm:rounded-[60px] border border-white/10 overflow-hidden shadow-2xl relative flex flex-col items-center justify-center p-12">
                <div className="relative flex-grow w-full flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-4 p-8 opacity-5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="w-8 sm:w-12 h-8 sm:h-12 border border-white/20 rounded-md" />
                    ))}
                  </div>
                  <motion.div 
                    animate={{ 
                      x: [0, 60, 60, 0, 0],
                      y: [0, 0, 60, 60, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden" 
                    style={{ backgroundColor: "var(--accent-main)", boxShadow: "0 0 60px var(--accent-glow)" }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                  </motion.div>
                </div>
                
                <div className="mt-8">
                   <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/30 uppercase tracking-[4px]" style={{ color: "var(--accent-main)", borderColor: "var(--accent-main)", opacity: 0.4 }}>Gesture Protocol</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative order-2 lg:order-1"
              >
                <div className="h-[600px] sm:h-[700px] lg:aspect-[4/5] lg:h-auto bg-white/[0.01] backdrop-blur-[60px] rounded-[48px] sm:rounded-[60px] border border-white/10 overflow-hidden shadow-2xl relative p-8 sm:p-12 flex flex-col items-center justify-between">
                  <div className="w-full max-w-[200px] sm:max-w-[240px] space-y-2 sm:space-y-4">
                     {["Easy", "Medium", "Hard"].map((lvl) => (
                       <div key={lvl} className={"p-3 sm:p-4 rounded-xl border flex justify-between items-center text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all"}
                            style={{ 
                              borderColor: lvl === "Hard" ? "var(--accent-main)" : "rgba(255,255,255,0.05)",
                              backgroundColor: lvl === "Hard" ? "var(--accent-glow)" : "transparent",
                              color: lvl === "Hard" ? "var(--accent-main)" : "rgba(255,255,255,0.2)"
                            }}>
                          {lvl}
                          {lvl === "Hard" && <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full" style={{ backgroundColor: "var(--accent-main)" }} />}
                       </div>
                     ))}
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-32 sm:w-40 h-32 sm:h-40 bg-[#111] border border-white/10 rounded-2xl sm:rounded-3xl relative overflow-hidden group cursor-pointer my-8"
                  >
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "var(--accent-glow)" }} />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 sm:w-20 h-16 sm:h-20 grid grid-cols-4 gap-1 opacity-20">
                           {Array.from({ length: 16 }).map((_, i) => (
                             <div key={i} className="bg-white/40 rounded-[1px]" />
                           ))}
                        </div>
                     </div>
                     <motion.div 
                      animate={{ scale: [1, 15], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeIn" }}
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{ backgroundColor: "var(--accent-main)" }}
                     />
                  </motion.div>
  
                  <div className="mt-4">
                     <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/30 uppercase tracking-[4px]" style={{ color: "var(--accent-main)", borderColor: "var(--accent-main)", opacity: 0.4 }}>Launch Protocol</div>
                  </div>
                </div>
              </motion.div>
  
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <span className="font-bold text-[10px] tracking-[5px] uppercase mb-8 block font-mono" style={{ color: "var(--accent-main)" }}>03. Entry Flow</span>
                <h2 className="text-6xl sm:text-8xl lg:text-9xl font-[900] tracking-[-4px] sm:tracking-[-8px] mb-8 sm:mb-12 leading-[0.8] lowercase text-white text-right">
                  tap <br/> <span className="text-white/10 whitespace-nowrap">to dive.</span>
                </h2>
                <p className="text-lg sm:text-xl text-white/40 leading-relaxed max-w-md font-medium text-right ml-auto">
                  Select your complexity threshold and tap the maze gateway. Instant transition from menu to procedural reality.
                </p>
              </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="min-h-screen py-40 px-12 flex flex-col items-center justify-center">
        <div className="max-w-6xl w-full">
           <div className="text-left mb-24 sm:mb-32 max-w-[600px]">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl sm:text-9xl font-[900] mb-8 tracking-[-4px] sm:tracking-[-8px] leading-[0.8] lowercase text-white/10">logic<br/><span className="text-white">infinite.</span></h2>
              <p className="text-white/40 text-lg sm:text-xl font-medium leading-relaxed">Pure algorithmic exploration designed for zero-distraction execution.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: <Grid3X3 size={40} />, title: "Endless Paths", desc: "Procedural engine generates millions of unique maze permutations in real-time." },
              { icon: <Sparkles size={40} />, title: "Theme Selector", desc: "Switch instantly between aesthetic presets without breaking your logic flow." },
              { icon: <Gamepad2 size={40} />, title: "Options Menu", desc: "Fine-tune your experience with haptic feedback and spatialized sound settings." },
              { icon: <Timer size={40} />, title: "Time Trial", desc: "Challenge the clock. Race through grids against tight time thresholds for ultimate mastery." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: i * 0.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="p-12 backdrop-blur-[24px] rounded-[48px] border transition-all duration-500"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              >
                <div className="mb-8" style={{ color: "var(--accent-main)" }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-4">{feature.title}</h3>
                <p className="text-[14px] opacity-40 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-60 px-12 text-center border-t transition-colors" style={{ borderColor: 'var(--border-color)' }}>
        <motion.div
           initial={{ y: 40, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           viewport={{ once: true }}
        >
          <div className="text-[14px] font-black uppercase tracking-[10px] opacity-20 mb-12 italic">Dive into the maze</div>
          <h2 className="text-[40px] sm:text-[60px] md:text-[100px] font-[900] tracking-[-4px] sm:tracking-[-6px] mb-12 sm:mb-16 leading-[0.8] transition-colors" style={{ color: "var(--accent-main)", filter: `drop-shadow(0 0 40px var(--accent-glow))` }}>MAZE.EXE</h2>
          
          <a 
            href="https://mazegame-exe-stopped-working.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 sm:px-24 py-5 sm:py-8 bg-white text-black rounded-full font-black text-sm sm:text-xl uppercase tracking-[5px] sm:tracking-[10px] transition-all transform hover:scale-110 active:scale-95 shadow-2xl hover:bg-[var(--accent-main)]"
          >
            Launch
          </a>
        </motion.div>

        <div className="mt-60 pt-16 border-t flex flex-col md:flex-row items-center justify-between gap-12 opacity-40 text-[10px] uppercase tracking-[5px] font-bold" style={{ borderColor: 'var(--border-color)' }}>
          <p>© 2026 MAZE.ENGINE v0.42_STABLE</p>
          <div className="flex items-center gap-12">
            <a 
              href="https://github.com/anoshione/Mazegame.exe-stopped-working" 
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors flex items-center gap-2 hover:opacity-100 opacity-60"
              style={{ color: "var(--accent-main)" }}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
