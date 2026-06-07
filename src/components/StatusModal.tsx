import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { DayStatus } from '../types';

interface StatusModalProps {
  isOpen: boolean;
  dateStr: string | null;
  currentStatus: DayStatus | null;
  onSave: (status: DayStatus | null) => void;
  onClose: () => void;
}

export default function StatusModal({
  isOpen,
  dateStr,
  currentStatus,
  onSave,
  onClose
}: StatusModalProps) {
  
  const formattedDate = () => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && dateStr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            id="modal-backdrop"
          />

          {/* Modal Content Box (Sleek Theme Layout) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-80 bg-[#161B22] border border-white/10 rounded-[32px] p-8 shadow-2xl text-center"
            id="status-modal-content"
          >
            {/* Header / Date */}
            <h4 className="text-lg font-bold mb-1 text-white">{formattedDate()}</h4>
            <p className="text-slate-400 text-sm mb-6">Select your status for today</p>

            {/* Selection Options (Sleek Theme button hierarchy) */}
            <div className="flex flex-col gap-3">
              {/* Success Button */}
              <button
                onClick={() => {
                  onSave('success');
                  onClose();
                }}
                className={`w-full py-4 rounded-2xl font-bold transition-all cursor-pointer ${
                  currentStatus === 'success'
                    ? 'bg-emerald-500 text-white border border-emerald-500/30'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                }`}
                id="select-success-btn"
              >
                SUCCESS
              </button>

              {/* Fail Button */}
              <button
                onClick={() => {
                  onSave('fail');
                  onClose();
                }}
                className={`w-full py-4 rounded-2xl font-bold transition-all cursor-pointer ${
                  currentStatus === 'fail'
                    ? 'bg-rose-500 text-white border border-rose-500/30'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white'
                }`}
                id="select-fail-btn"
              >
                FAIL
              </button>
            </div>

            {/* Remove / Clear Option */}
            {currentStatus && (
              <button
                onClick={() => {
                  onSave(null);
                  onClose();
                }}
                className="mt-4 flex items-center justify-center gap-1.5 w-full text-rose-400 hover:text-rose-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer py-1"
                id="clear-status-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove log</span>
              </button>
            )}

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="mt-4 w-full text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
              id="cancel-modal-btn"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
