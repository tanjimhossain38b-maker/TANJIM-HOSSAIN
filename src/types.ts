export type DayStatus = 'success' | 'fail';

export interface TrackerData {
  [dateStr: string]: DayStatus; // Key is 'YYYY-MM-DD'
}

export interface DayInfo {
  date: Date;
  dateString: string; // 'YYYY-MM-DD'
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  status: DayStatus | null;
}

export interface MonthStats {
  totalSuccess: number;
  totalFail: number;
  successPercentage: number;
  failPercentage: number;
}
