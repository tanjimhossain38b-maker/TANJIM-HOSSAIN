import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TrackerData, DayInfo } from '../types';

interface CalendarGridProps {
  currentYear: number;
  currentMonth: number; // 0-based
  trackerData: TrackerData;
  onDateClick: (dateStr: string) => void;
  onMonthChange: (year: number, month: number) => void;
  onResetMonth: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = [2026, 2027, 2028];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({
  currentYear,
  currentMonth,
  trackerData,
  onDateClick,
  onMonthChange,
  onResetMonth
}: CalendarGridProps) {
  const isPrevDisabled = currentYear === 2026 && currentMonth === 0;
  const isNextDisabled = currentYear === 2028 && currentMonth === 11;

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    if (currentMonth === 0) {
      onMonthChange(currentYear - 1, 11);
    } else {
      onMonthChange(currentYear, currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (isNextDisabled) return;
    if (currentMonth === 11) {
      onMonthChange(currentYear + 1, 0);
    } else {
      onMonthChange(currentYear, currentMonth + 1);
    }
  };

  const handleYearChange = (year: number) => {
    onMonthChange(year, currentMonth);
  };

  const handleMonthSelect = (monthIdx: number) => {
    onMonthChange(currentYear, monthIdx);
  };

  // Generate days in the month 
  const daysGrid = useMemo(() => {
    const year = currentYear;
    const month = currentMonth;
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const tempGrid: DayInfo[] = [];
    
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    // 1. Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      
      tempGrid.push({
        date: new Date(prevYear, prevMonth, dayNum),
        dateString: dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: todayYear === prevYear && todayMonth === prevMonth && todayDate === dayNum,
        status: trackerData[dateStr] || null
      });
    }

    // 2. Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      tempGrid.push({
        date: new Date(year, month, i),
        dateString: dateStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: todayYear === year && todayMonth === month && todayDate === i,
        status: trackerData[dateStr] || null
      });
    }

    // 3. Next month padding days to complete 42 cells
    const remainingCells = 42 - tempGrid.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      tempGrid.push({
        date: new Date(nextYear, nextMonth, i),
        dateString: dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: todayYear === nextYear && todayMonth === nextMonth && todayDate === i,
        status: trackerData[dateStr] || null
      });
    }

    return tempGrid;
  }, [currentYear, currentMonth, trackerData]);

  const [slideDir, setSlideDir] = useState(1);

  const performMonthShift = (dir: 'prev' | 'next') => {
    setSlideDir(dir === 'prev' ? -1 : 1);
    if (dir === 'prev') {
      handlePrevMonth();
    } else {
      handleNextMonth();
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-5 md:p-8 shadow-xl shadow-slate-950/40" id="calendar-container">
      
      {/* Sleek Theme Top Layout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-3xl font-light italic text-white">
            {MONTHS[currentMonth]} <span className="font-bold not-italic">{currentYear}</span>
          </h2>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20 uppercase tracking-widest">
            Active Month
          </span>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Quick Dropdowns */}
          <select 
            value={currentMonth}
            onChange={(e) => handleMonthSelect(Number(e.target.value))}
            className="bg-white/5 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-emerald-500/50 cursor-pointer font-medium"
            id="month-selector"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>

          <select 
            value={currentYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="bg-white/5 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-emerald-500/50 cursor-pointer font-medium"
            id="year-selector"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Nav navigation arrows matching theme layout */}
          <div className="flex gap-2">
            <button
              onClick={() => performMonthShift('prev')}
              disabled={isPrevDisabled}
              className={`p-2 rounded-xl bg-white/5 border border-white/10 transition-colors ${
                isPrevDisabled 
                  ? 'text-slate-600 opacity-30 cursor-not-allowed' 
                  : 'text-white hover:bg-white/10'
              }`}
              title="Previous Month"
              id="prev-month-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => performMonthShift('next')}
              disabled={isNextDisabled}
              className={`p-2 rounded-xl bg-white/5 border border-white/10 transition-colors ${
                isNextDisabled 
                  ? 'text-slate-600 opacity-30 cursor-not-allowed' 
                  : 'text-white hover:bg-white/10'
              }`}
              title="Next Month"
              id="next-month-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Reset Month Button */}
          <button
            onClick={onResetMonth}
            className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/30 rounded-xl px-3 py-2 transition-all outline-none font-medium cursor-pointer"
            id="reset-month-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Month</span>
          </button>
        </div>
      </div>

      {/* Week Day Labels (Sleek Theme style) */}
      <div className="grid grid-cols-7 gap-3 mb-4 text-center" id="week-labels-grid">
        {WEEK_DAYS.map((day) => (
          <div 
            key={day} 
            className="text-center text-xs font-bold text-slate-505 uppercase tracking-widest py-1 select-none"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid Rendering */}
      <div className="relative overflow-hidden min-h-[300px] md:min-h-[365px]" id="calendar-days-wrapper">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${currentYear}-${currentMonth}`}
            initial={{ opacity: 0, x: slideDir * 35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slideDir * 35 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="grid grid-cols-7 gap-3"
          >
            {daysGrid.map((day, idx) => {
              const { dayNumber, isCurrentMonth, isToday, status, dateString } = day;
              
              if (!isCurrentMonth) {
                // Outer month padding days
                return (
                  <div
                    key={idx}
                    className="aspect-square rounded-2xl flex items-center justify-center text-slate-600 opacity-30 select-none text-base"
                  >
                    {dayNumber}
                  </div>
                );
              }

              // Status styling matching "Sleek Interface" Theme specification:
              let styleClasses = "aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-white cursor-pointer hover:border-emerald-400/50 hover:bg-white/10 transition-all";
              let indicatorDot = null;

              if (status === 'success') {
                styleClasses = "aspect-square rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:bg-emerald-500/15 text-white font-medium cursor-pointer transition-all";
                indicatorDot = <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow shadow-emerald-400" />;
              } else if (status === 'fail') {
                styleClasses = "aspect-square rounded-2xl bg-rose-500/10 border border-rose-500/40 flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:bg-rose-500/15 text-white font-medium cursor-pointer transition-all";
                indicatorDot = <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow shadow-rose-400" />;
              }

              // Today ring accent: "ring-2 ring-emerald-500 ring-offset-4 ring-offset-[#0A0C10]"
              if (isToday) {
                styleClasses += " ring-2 ring-emerald-500 ring-offset-4 ring-offset-[#0A0C10]";
              }

              return (
                <button
                  key={idx}
                  onClick={() => onDateClick(dateString)}
                  className={styleClasses}
                  id={`calc-day-${dateString}`}
                >
                  <span className="text-base text-white">{dayNumber}</span>
                  {indicatorDot}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Styled descriptive bottom legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/5 text-xs text-slate-400 font-medium" id="calendar-legend">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span>Completed Success</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-rose-500/10 border border-rose-500/40 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          </div>
          <span>Missed Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-white/5 border border-white/10 ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#0A0C10]" />
          <span>Current Day</span>
        </div>
      </div>

    </div>
  );
}
