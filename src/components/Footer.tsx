import { useEffect, useState } from 'react';

export default function Footer() {
  const [localStorageKB, setLocalStorageKB] = useState<string>('0.0');

  useEffect(() => {
    // Dynamically calculate local storage bytes for tracking correctness
    try {
      const dataStr = localStorage.getItem('tanjim_task_tracker_data') || '';
      const sizeBytes = new Blob([dataStr]).size;
      const sizeKB = (sizeBytes / 1024).toFixed(2);
      setLocalStorageKB(sizeKB);
    } catch {
      setLocalStorageKB('0.2');
    }
  }, []);

  return (
    <footer className="h-14 bg-[#11141B] border-t border-white/5 px-8 flex items-center justify-between text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-12 z-10 shrink-0">
      <div className="flex gap-6">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Local Sync: OK
        </span>
        <span className="hidden sm:inline font-bold">Storage: {localStorageKB}kb</span>
      </div>
      <div className="font-bold">
        © 2026 TANJIM TASK ENGINE v1.4.0
      </div>
    </footer>
  );
}
