import { CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  currentYear: number;
  onYearChange: (year: number) => void;
}

export default function Header({ currentYear, onYearChange }: HeaderProps) {
  const years = [2026, 2027, 2028];

  return (
    <header className="relative overflow-hidden bg-[#11141B] border-b border-white/10 px-6 py-4 md:px-8 shadow-lg z-20">
      {/* Sleek aesthetic background accent glow */}
      <div className="absolute top-0 left-1/4 w-72 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center gap-3 animate-fade-in"
          id="brand-logo-container"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6 text-[#0A0C10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase text-white font-sans">
              TANJIM <span className="text-emerald-400">TASK</span>
            </h1>
            <p className="text-[10px] text-slate-450 font-bold tracking-widest flex items-center gap-1.5 uppercase mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Success & Fail Tracker
            </p>
          </div>
        </motion.div>

        {/* Year Select Pillars & User Status */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="flex items-center gap-4 text-xs font-medium"
          id="status-indicators"
        >
          {/* Custom Year Toggle Pill */}
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10" id="header-years-toggle">
            {years.map(y => (
              <button
                key={y}
                onClick={() => onYearChange(y)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-300 ${
                  currentYear === y
                    ? 'bg-white/10 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                id={`header-year-btn-${y}`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* TT Profile Badge */}
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 p-0.5 shadow-md shadow-emerald-500/10 shrink-0 select-none">
            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs italic text-slate-200">
              TT
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
