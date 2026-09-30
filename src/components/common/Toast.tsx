import React from 'react';
import { usePlayer } from '../../context/PlayerContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePlayer();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const bgBorder =
          toast.type === 'success'
            ? 'bg-rose-950/90 border-rose-500/80 text-rose-100'
            : toast.type === 'badge'
            ? 'bg-amber-950/90 border-amber-500/80 text-amber-100'
            : toast.type === 'streak'
            ? 'bg-orange-950/90 border-orange-500/80 text-orange-100'
            : 'bg-neutral-900/90 border-neutral-700 text-neutral-100';

        const icon =
          toast.type === 'success'
            ? '🌸'
            : toast.type === 'badge'
            ? '🏆'
            : toast.type === 'streak'
            ? '🔥'
            : 'ℹ️';

        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto cursor-pointer flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-in slide-in-from-right-8 fade-in ${bgBorder}`}
          >
            <span className="text-xl shrink-0 mt-0.5">{icon}</span>
            <div className="flex-1">
              <h4 className="text-sm font-bold tracking-wide">{toast.title}</h4>
              <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="text-neutral-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
