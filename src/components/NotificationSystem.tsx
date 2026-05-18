import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export const NotificationSystem = () => {
  const { notifications, removeNotification } = useWorkflowStore();

  React.useEffect(() => {
    const timers = notifications.map(n => {
      return setTimeout(() => removeNotification(n.id), 5000);
    });
    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} className="text-vox-success" />;
      case 'warn': return <AlertTriangle size={14} className="text-amber-400" />;
      case 'error': return <AlertCircle size={14} className="text-red-400" />;
      default: return <Info size={14} className="text-vox-primary" />;
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[20000] flex flex-col gap-3 w-80 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={cn(
              "p-4 rounded-2xl bg-vox-bg/80 backdrop-blur-2xl border border-white/10 shadow-2xl pointer-events-auto flex gap-4 group",
              notif.type === 'error' && "border-red-500/20 shadow-red-500/5",
              notif.type === 'success' && "border-vox-success/20 shadow-vox-success/5"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              notif.type === 'success' && "bg-vox-success/10",
              notif.type === 'warn' && "bg-amber-400/10",
              notif.type === 'error' && "bg-red-400/10",
              notif.type === 'info' && "bg-vox-primary/10"
            )}>
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0 py-0.5">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Vox: {notif.title}</h4>
              <p className="text-[9px] text-white/40 leading-relaxed mt-1">{notif.message}</p>
            </div>

            <button 
              onClick={() => removeNotification(notif.id)}
              className="p-1 rounded-lg hover:bg-white/5 text-white/10 hover:text-white transition-all self-start"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
