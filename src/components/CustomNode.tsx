import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'motion/react';
import { 
  Upload, 
  FileArchive, 
  FolderInput, 
  Send, 
  Zap, 
  Database, 
  Bell,
  Cpu,
  ArrowRightLeft,
  Activity,
  Layers,
  Filter,
  Clock,
  Webhook,
  Share2,
  MessageSquare,
  Globe,
  RefreshCw,
  FileText,
  SearchCode,
  Users,
  ShieldCheck,
  Braces
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useWorkflowStore } from '../store/useWorkflowStore';

const iconMap = {
  Upload: Upload,
  Zip: FileArchive,
  Extract: FolderInput,
  Transfer: ArrowRightLeft,
  Store: Database,
  Notify: Bell,
  AI: Cpu,
  Cpu: Cpu,
  Database: Database,
  Activity: Activity,
  Layers: Layers,
  Filter: Filter,
  Clock: Clock,
  Webhook: Webhook,
  Send: Send,
  Share: Share2,
  Message: MessageSquare,
  Globe: Globe,
  Refresh: RefreshCw,
  FileText: FileText,
  Search: SearchCode,
  Users: Users,
  ShieldCheck: ShieldCheck,
  Braces: Braces
};

export const CustomNode = memo(({ data, selected, type }: NodeProps) => {
  const Icon = iconMap[data.icon as keyof typeof iconMap] || Zap;
  const isTrigger = type === 'trigger';
  const { isExecuting } = useWorkflowStore();
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      className={cn(
        "node-card min-w-[220px] transition-all duration-700",
        selected && "border-vox-primary/60 scale-[1.02] shadow-[0_0_40px_rgba(0,229,255,0.15)]",
        "group"
      )}
    >
      {/* Node Header Glow */}
      <div className={cn(
        "absolute top-0 inset-x-0 h-1 bg-gradient-to-r transition-all duration-1000",
        isExecuting 
          ? "from-transparent via-vox-primary to-transparent opacity-100" 
          : "from-transparent via-white/5 to-transparent opacity-40 group-hover:via-vox-primary/30"
      )} />

      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 relative",
            isExecuting ? "bg-vox-primary/10 text-vox-primary animate-pulse" : "bg-white/5 text-white/20 group-hover:bg-vox-primary/10 group-hover:text-vox-primary"
          )}>
            <Icon size={24} className="relative z-10" />
            {isExecuting && (
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-vox-primary rounded-xl"
              />
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                {type}_module
              </span>
              <div className={cn(
                "h-1 px-2 rounded-full transition-all",
                isExecuting ? "bg-vox-primary/40 w-8" : "bg-white/10 w-4"
              )} />
            </div>
            <h4 className="text-sm font-black text-white tracking-tight uppercase italic leading-none font-display">
              {data.label}
            </h4>
          </div>
        </div>

        {/* Neural Traffic Visualization (Mockup) */}
        <div className="mt-4 flex items-center gap-2">
           <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                animate={isExecuting ? { left: ["-100%", "200%"] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-vox-primary to-transparent"
              />
           </div>
           <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Active</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-8 !rounded-none !bg-white/5 !border-none !left-0 hover:!bg-vox-primary transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-8 !rounded-none !bg-white/5 !border-none !right-0 hover:!bg-vox-primary transition-colors"
      />
      
      {/* HUD Info (Bottom Bar) */}
      <div className="bg-black/20 border-t border-white/5 px-4 py-1.5 flex items-center justify-between">
         <span className="text-[7px] font-black text-white/20 uppercase tracking-widest italic">
            Status: {isExecuting ? 'Exec' : 'Standby'}
         </span>
         <span className="text-[7px] font-black text-vox-primary/40 uppercase tracking-tighter">
            0X.42.FF
         </span>
      </div>
    </motion.div>
  );
});

CustomNode.displayName = 'CustomNode';
