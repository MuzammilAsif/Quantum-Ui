import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore } from '../store';
import { cn } from '../utils';
import type { ToastNotification } from '../types';

const ICON_MAP = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP = {
  success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  error: 'text-red-400 bg-red-500/10 border-red-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

function ToastItem({ toast }: { toast: ToastNotification }) {
  const { removeToast } = useToastStore();
  const Icon = ICON_MAP[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2 px-3 py-2.5 rounded-md',
        'glass-elevated border text-xs shadow-q-md',
        'max-w-[240px] w-full',
        COLOR_MAP[toast.type]
      )}
    >
      <Icon size={13} className="flex-shrink-0 mt-px" aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <p className="text-q-text leading-snug">{toast.message}</p>
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-1 text-2xs font-semibold underline underline-offset-2
              hover:no-underline transition-all cursor-pointer"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-current opacity-50 hover:opacity-100
          transition-opacity cursor-pointer mt-px"
      >
        <X size={11} />
      </button>
    </motion.div>
  );
}

/**
 * ToastContainer — fixed overlay at bottom of sidebar rendering live toasts.
 */
export const ToastContainer = memo(function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div
      aria-label="Notifications"
      className="absolute bottom-2 left-2 right-2 z-50 flex flex-col gap-1.5 pointer-events-none"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
});