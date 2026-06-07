import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrackerData } from '../types';
import { BarChart4, PieChart as PieIcon, HelpCircle } from 'lucide-react';

interface AnalyticsChartsProps {
  currentYear: number;
  currentMonth: number; // 0-based
  trackerData: TrackerData;
}

export default function AnalyticsCharts({
  currentYear,
  currentMonth,
  trackerData
}: AnalyticsChartsProps) {

  const totalDaysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  // Generate daily timeline data
  const timelineData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const status = trackerData[dateStr] || null;
      
      data.push({
        dayNum: i,
        dayLabel: `Day ${i}`,
        Success: status === 'success' ? 1 : 0,
        Fail: status === 'fail' ? 1 : 0,
        statusText: status ? status.toUpperCase() : 'Not marked'
      });
    }
    return data;
  }, [currentYear, currentMonth, trackerData, totalDaysInMonth]);

  // Pie chart calculation
  const pieData = useMemo(() => {
    let successCount = 0;
    let failCount = 0;

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const status = trackerData[dateStr];
      if (status === 'success') {
        successCount++;
      } else if (status === 'fail') {
        failCount++;
      }
    }

    if (successCount === 0 && failCount === 0) {
      return [];
    }

    return [
      { name: 'Success Days', value: successCount, color: '#10b981' },
      { name: 'Fail Days', value: failCount, color: '#f43f5e' }
    ];
  }, [currentYear, currentMonth, trackerData, totalDaysInMonth]);

  const hasData = pieData.length > 0;

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isSuccess = payload[0]?.payload?.Success === 1;
      const isFail = payload[0]?.payload?.Fail === 1;
      const statusColor = isSuccess 
        ? 'text-emerald-400' 
        : isFail 
          ? 'text-rose-400' 
          : 'text-slate-405';

      return (
        <div className="bg-[#11141B] border border-white/10 p-3 rounded-xl shadow-2xl font-sans text-xs">
          <p className="font-bold text-white mb-1.5">{label}</p>
          <p className={`font-semibold flex items-center gap-1.5 ${statusColor}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>Status: {payload[0]?.payload?.statusText}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="analytics-charts-section">
      
      {/* 1. Bar Chart: Daily Status Graph */}
      <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl shadow-slate-950/40 flex flex-col" id="bar-chart-container">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BarChart4 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Daily Comparison</h3>
            <p className="text-xs text-slate-500 mt-1">Timeline of tracker actions across the days of the current month</p>
          </div>
        </div>

        {hasData ? (
          <div className="h-[280px] w-full" id="bar-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timelineData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                barSize={10}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} />
                <XAxis 
                  dataKey="dayNum" 
                  stroke="#576a85" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                />
                <YAxis 
                  domain={[0, 1]} 
                  ticks={[0, 1]}
                  stroke="#576a85"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)', radius: 4 }} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-slate-300 font-semibold">{value}</span>}
                />
                
                <Bar 
                  dataKey="Success" 
                  fill="#10b981" 
                  radius={[3, 3, 0, 0]}
                  name="Success Date"
                />
                
                <Bar 
                  dataKey="Fail" 
                  fill="#f43f5e" 
                  radius={[3, 3, 0, 0]}
                  name="Fail Date"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <HelpCircle className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-300">No Distribution Data Available</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Please mark at least one day in the calendar as Success or Fail to construct this month's dynamic comparison charts.
            </p>
          </div>
        )}
      </div>

      {/* 2. Pie Chart: Success vs Fail Ratio */}
      <div className="lg:col-span-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl shadow-slate-950/40 flex flex-col" id="pie-chart-container">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Success Rate</h3>
            <p className="text-xs text-slate-500 mt-1 font-sans">Visual proportional tracking split ratio</p>
          </div>
        </div>

        {hasData ? (
          <div className="flex-1 flex flex-col justify-between" id="pie-chart-wrapper">
            <div className="h-[200px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} Days`, name]}
                    contentStyle={{ backgroundColor: '#11141B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '11px', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Inner Circle Info Accent */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest font-mono">TOTAL</span>
                <span className="text-3xl font-bold text-white mt-1">
                  {pieData.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-[9px] text-slate-500 font-bold font-mono">DAYS RECORDED</span>
              </div>
            </div>

            {/* Custom Interactive Legend */}
            <div className="mt-4 space-y-2 border-t border-white/5 pt-4" id="pie-legend">
              {pieData.map((item, idx) => {
                const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
                const percent = total > 0 ? (item.value / total) * 100 : 0;
                
                return (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <div className="font-mono font-bold text-white flex items-center gap-1.5 col">
                      <span>{item.value}d</span>
                      <span className="text-slate-500 font-normal">({percent.toFixed(0)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <div className="relative w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full mb-3 text-slate-500 font-bold text-lg">
              %
            </div>
            <p className="text-sm font-semibold text-slate-300">No Split Ratio</p>
            <p className="text-xs text-slate-505 mt-1 max-w-sm">
              Keep saving daily status checks to calculate your target success percentage ratio.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
