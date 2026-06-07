import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CalendarGrid from './components/CalendarGrid';
import StatusModal from './components/StatusModal';
import MonthStats from './components/MonthStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import Footer from './components/Footer';
import { TrackerData, DayStatus, MonthStats as StatsType } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Clock, Award, CheckCircle, TrendingUp, Sparkles, BookOpen, ThumbsUp } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tanjim_task_tracker_data';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function App() {
  // App Initializers
  const [trackerData, setTrackerData] = useState<TrackerData>({});
  
  // Set default state year and month based on localized system date metadata (June 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // 0-based for June (index 5)
  
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load tracker data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setTrackerData(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse tracker data from Local Storage', e);
    }
    
    // Simulate premium splash loading screen for 1200ms
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1250);

    return () => clearTimeout(timer);
  }, []);

  // Save tracker data on change
  const handleSaveStatus = (dateStr: string, status: DayStatus | null) => {
    const updated = { ...trackerData };
    if (status === null) {
      delete updated[dateStr];
    } else {
      updated[dateStr] = status;
    }
    
    setTrackerData(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const clearModalState = () => {
    setSelectedDateStr(null);
    setIsModalOpen(false);
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setIsModalOpen(true);
  };

  // Reset entire current month tracker data only (Safety protection with confirmation prompt)
  const handleResetMonth = () => {
    const monthPadding = String(currentMonth + 1).padStart(2, '0');
    const prefix = `${currentYear}-${monthPadding}-`;
    
    if (window.confirm(`Are you sure you want to clear all success and fail records for ${MONTH_NAMES[currentMonth]} ${currentYear}?`)) {
      const updated = { ...trackerData };
      let logsDeleted = 0;
      
      Object.keys(updated).forEach(dateStr => {
        if (dateStr.startsWith(prefix)) {
          delete updated[dateStr];
          logsDeleted++;
        }
      });
      
      if (logsDeleted > 0) {
        setTrackerData(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
    }
  };

  // Memoized stats calculation for the current selected month
  const currentMonthStats = useMemo<StatsType>(() => {
    let successCount = 0;
    let failCount = 0;

    const monthPadding = String(currentMonth + 1).padStart(2, '0');
    const prefix = `${currentYear}-${monthPadding}-`;

    Object.entries(trackerData).forEach(([dateStr, status]) => {
      if (dateStr.startsWith(prefix)) {
        if (status === 'success') successCount++;
        else if (status === 'fail') failCount++;
      }
    });

    const totalTracked = successCount + failCount;
    const successPercentage = totalTracked > 0 ? (successCount / totalTracked) * 100 : 0;
    const failPercentage = totalTracked > 0 ? (failCount / totalTracked) * 100 : 0;

    return {
      totalSuccess: successCount,
      totalFail: failCount,
      successPercentage,
      failPercentage
    };
  }, [trackerData, currentYear, currentMonth]);

  // Overall statistics for a Motivation Label
  const motivationText = useMemo(() => {
    const { totalSuccess, totalFail, successPercentage } = currentMonthStats;
    const total = totalSuccess + totalFail;

    if (total === 0) {
      return {
        title: "Fresh Slate!",
        text: "Your planner is empty for this month. Start mapping out your journey by clicking any date above.",
        style: "border-slate-800 bg-slate-900/20 text-slate-300"
      };
    }
    if (successPercentage >= 80) {
      return {
        title: "Elite Momentum!",
        text: `Incredible performance with a ${successPercentage.toFixed(0)}% achievement record. You are in total control!`,
        style: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
      };
    }
    if (successPercentage >= 50) {
      return {
        title: "Forming Habits!",
        text: "You are consistent. Work hard to turn missed days back into wins, keeping your score above average.",
        style: "border-teal-500/20 bg-teal-500/5 text-teal-300"
      };
    }
    return {
      title: "Keep Fighting!",
      text: "Progress isn't a straight line. View fails as opportunities to adjust, rebuild, and hit your target tomorrow.",
      style: "border-rose-500/20 bg-rose-500/5 text-rose-300"
    };
  }, [currentMonthStats]);

  // Calculate high success streak count across total timeline
  const currentSuccessStreak = useMemo(() => {
    // Sort all dates
    const sortedDatesStr = Object.keys(trackerData)
      .filter(d => trackerData[d] === 'success')
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (sortedDatesStr.length === 0) return 0;

    // Find current active streak
    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let checkDate = new Date(today);
    // If not successes today or yesterday, streak is broken from today's perspective, but let's calculate active tail streak
    let isStreakActive = true;
    
    // Simplistic streak check based on sorted success days
    let maxStreak = 0;
    let tempStreak = 0;
    let lastTime: number | null = null;

    sortedDatesStr.forEach(dStr => {
      const curTime = new Date(dStr).getTime();
      if (lastTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = (curTime - lastTime) / (1000 * 60 * 60 * 24);
        if (diffDays <= 1.1) { // Same or consecutive day limit (ignoring micro leaps)
          tempStreak++;
        } else {
          if (tempStreak > maxStreak) maxStreak = tempStreak;
          tempStreak = 1;
        }
      }
      lastTime = curTime;
    });

    if (tempStreak > maxStreak) maxStreak = tempStreak;
    return maxStreak;
  }, [trackerData]);

  // Render Splash Loader
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center flex flex-col items-center"
        >
          {/* Logo animation */}
          <div className="relative w-20 h-20 bg-gradient-to-tr from-emerald-500 via-teal-500 to-rose-500 rounded-2xl p-0.5 shadow-2s shadow-teal-500/20 animate-pulse flex items-center justify-center mb-6">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold tracking-widest text-white font-sans bg-gradient-to-r from-teal-400 via-emerald-400 to-white bg-clip-text text-transparent">
            TANJIM TASK
          </h2>
          <p className="text-xs text-slate-400 tracking-widest uppercase font-medium mt-2">
            Success & Fail Tracker
          </p>

          <div className="mt-8 flex items-center gap-1.5 justify-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Decorative gradient blur background layout */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-1%] w-[40%] h-[50%] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[20%] w-[35%] h-[40%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      {/* Main Header */}
      <Header currentYear={currentYear} onYearChange={setCurrentYear} />

      {/* Primary Dashboard Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8 relative z-10">
        
        {/* Welcome motivational message & Top widgets */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch"
          id="dashboard-topbar-widgets"
        >
          {/* Welcome motivational Card */}
          <div className="md:col-span-8 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60 p-4 flex flex-col md:flex-row items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-950 border shrink-0 text-center ${motivationText.style.split(' ')[0]} ${motivationText.style.split(' ')[1]}`}>
              <Sparkles className="w-6 h-6 animate-spin-slow text-teal-400 mx-auto" />
            </div>
            <div className="text-center md:text-left flex-grow">
              <h4 className="text-sm font-extrabold flex items-center justify-center md:justify-start gap-2">
                <span>{motivationText.title}</span>
                <span className="text-xs font-normal text-slate-500">|</span>
                <span className="text-xs text-indigo-400 font-medium">Monthly Insight</span>
              </h4>
              <p className="text-xs text-slate-350 mt-1">{motivationText.text}</p>
            </div>
          </div>

          {/* Habit Streak Metric Widget Card */}
          <div className="md:col-span-4 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/60 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 flex items-center justify-center animate-pulse">
                <Flame className="w-5.5 h-5.5 text-white fill-orange-200" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">All-Time High Streak</h4>
                <p className="text-lg font-black text-slate-100 mt-0.5">{currentSuccessStreak} Success Days</p>
              </div>
            </div>
            <div className="hidden xs:block py-1 px-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-[10px] font-black text-orange-400 font-mono text-center">
              STREAK
            </div>
          </div>
        </motion.div>

        {/* Bento Board: Primary Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:gap-8" id="bento-board-flow">
          
          {/* LARGE CALENDAR LAYOUT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CalendarGrid 
              currentYear={currentYear}
              currentMonth={currentMonth}
              trackerData={trackerData}
              onDateClick={handleDateClick}
              onMonthChange={handleMonthChange}
              onResetMonth={handleResetMonth}
            />
          </motion.div>

          {/* MONTH STATS CARDS */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <MonthStats 
              stats={currentMonthStats}
              monthName={MONTH_NAMES[currentMonth]}
              year={currentYear}
            />
          </motion.section>

          {/* CHARTS CONTAINER */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnalyticsCharts 
              currentYear={currentYear}
              currentMonth={currentMonth}
              trackerData={trackerData}
            />
          </motion.section>

        </div>

      </main>

      {/* Pop-up Date Track Selection Modal */}
      <StatusModal 
        isOpen={isModalOpen}
        dateStr={selectedDateStr}
        currentStatus={selectedDateStr ? (trackerData[selectedDateStr] || null) : null}
        onSave={(status) => selectedDateStr && handleSaveStatus(selectedDateStr, status)}
        onClose={clearModalState}
      />

      {/* Styled Footer */}
      <Footer />

    </div>
  );
}
