import { CheckCircle2, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { MonthStats as StatsType } from '../types';

interface MonthStatsProps {
  stats: StatsType;
  monthName: string;
  year: number;
}

export default function MonthStats({ stats, monthName, year }: MonthStatsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <div id="stats-dashboard-grid" className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase font-mono">
          Habit Performance Analytics • {monthName} {year}
        </h3>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Success Days Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 relative overflow-hidden group shadow-lg"
          id="stat-card-total-success"
        >
          {/* Subtle Glow background pattern */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span>Success</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-80" />
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-white tracking-tight">{stats.totalSuccess}</span>
            <span className="text-xs text-slate-400 font-bold uppercase">Days</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-emerald-500/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
              style={{ width: `${stats.successPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Fail Days Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-rose-500/10 border border-[#f43f5e]/20 rounded-3xl p-5 relative overflow-hidden group shadow-lg"
          id="stat-card-total-fail"
        >
          {/* Subtle Glow background pattern */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-400/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-[#f43f5e] uppercase tracking-widest mb-1.5 flex items-center justify-between">
            <span>Fail</span>
            <XCircle className="w-4 h-4 text-[#f43f5e] opacity-80" />
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-white tracking-tight">{stats.totalFail}</span>
            <span className="text-xs text-slate-400 font-bold uppercase">Days</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-rose-500/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-450 rounded-full transition-all duration-500" 
              style={{ width: `${stats.failPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Success Rate Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-5 relative overflow-hidden shadow-lg flex flex-col justify-between"
          id="stat-card-success-percentage"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
              <span>Success Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </p>
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {stats.successPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-wider font-mono">
            {stats.totalSuccess} / {(stats.totalSuccess + stats.totalFail) || 1} Registered Total
          </p>
        </motion.div>

        {/* Fail Ratio Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-5 relative overflow-hidden shadow-lg flex flex-col justify-between"
          id="stat-card-fail-percentage"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
              <span>Failure Rate</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </p>
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {stats.failPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-wider font-mono">
            Proportion level: Habit Loss ratio
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}
