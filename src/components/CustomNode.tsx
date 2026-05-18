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
  Terminal,
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

export const CustomNode = memo(({ id, data, selected, type, xPos, yPos }: NodeProps) => {
  const Icon = iconMap[data.icon as keyof typeof iconMap] || Zap;
  const isTrigger = type === 'trigger';
  const { isExecuting, isExecutionMode, updateNodeLabel, setIsExecuting, addRuntimeJob, setContextMenu } = useWorkflowStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [label, setLabel] = React.useState(data.label);

  const status = data.status || 'success'; // success, failed, running
  const lastRun = data.lastRun || 'Never';

  const handleRerun = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExecuting(true);
    addRuntimeJob({
      workspaceId: 'manual',
      nodeId: id,
      status: 'running'
    });
    
    setTimeout(() => {
      setIsExecuting(false);
      addRuntimeJob({
        workspaceId: 'manual',
        nodeId: id,
        status: 'success'
      });
    }, 2000);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (label !== data.label) {
      updateNodeLabel(id, label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLabel(data.label);
      setIsEditing(false);
    }
  };
  
  return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          borderColor: isExecutionMode ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 255, 255, 0.05)',
        }}
        whileHover={{ scale: 1.05, shadow: "0 0 30px rgba(0, 229, 255, 0.1)" }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          "node-card min-w-[220px] transition-all duration-700 relative",
          selected && "border-vox-primary/60 scale-[1.02] shadow-[0_0_40px_rgba(0,229,255,0.15)]",
          isExecutionMode && "shadow-[0_0_20px_rgba(0,229,255,0.05)]",
          isExecuting && "animate-[pulse_1.5s_infinite]",
          "group"
        )}
      >
        {/* Status Indicator */}
        <div className="absolute -top-1 -right-1 flex gap-1 z-20">
           <div className={cn(
             "w-2 h-2 rounded-full",
             status === 'success' ? "bg-green-400" : status === 'failed' ? "bg-red-400" : "bg-vox-primary animate-ping"
           )} title={`Status: ${status}`} />
        </div>

        {/* Hover Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-lg border border-vox-primary/30 text-[8px] font-black text-white uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[110]">
           {data.description || "Enterprise Logic Module"} • {lastRun}
        </div>
        {/* Selection Toolbar (Hover) */}
        {selected && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-vox-bg/95 backdrop-blur-3xl border border-vox-primary/30 rounded-2xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
             <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-2 rounded-xl bg-white/5 hover:bg-vox-primary/20 text-white/40 hover:text-vox-primary transition-all active:scale-95"
              title="Edit Parameters"
             >
                <FileText size={14} />
             </button>
             <button 
              className="p-2 rounded-xl bg-white/5 hover:bg-vox-primary/20 text-white/40 hover:text-vox-primary transition-all active:scale-95"
              title="View Logs"
             >
                <Terminal size={14} />
             </button>
             <button 
              onClick={handleRerun}
              disabled={isExecuting}
              className="p-2 rounded-xl bg-white/5 hover:bg-vox-primary/20 text-white/40 hover:text-vox-primary transition-all active:scale-95 disabled:opacity-50"
              title="Rerun Node"
             >
                <RefreshCw size={14} className={isExecuting ? "animate-spin" : ""} />
             </button>
          </div>
        )}

        {/* Node Ambient Glow in Execution Mode */}
        {isExecutionMode && (
          <div className="absolute -inset-2 bg-vox-primary/5 blur-2xl rounded-[2rem] -z-10 animate-pulse" />
        )}
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
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-vox-primary/60 italic">
                {type}_module
              </span>
              <div className={cn(
                "h-1 px-2 rounded-full transition-all",
                isExecuting ? "bg-vox-primary w-8 shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "bg-white/10 w-4"
              )} />
            </div>
            
            {isEditing ? (
              <div className="relative w-full">
                <input
                  autoFocus
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="bg-vox-bg border-b-2 border-vox-primary text-white text-sm font-black tracking-tight uppercase italic leading-none font-display w-full py-1 px-1 focus:outline-none placeholder:text-white/20"
                />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-vox-primary animate-ping" />
              </div>
            ) : (
              <h4 className="text-sm font-black text-white tracking-tighter uppercase italic leading-none font-display truncate group-hover:text-vox-primary transition-colors">
                {data.label}
              </h4>
            )}
            <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1 block group-hover:text-white/80 transition-colors">
              Logic Hash: {id.split('-')[0]}
            </span>
          </div>
        </div>

        {/* Neural Traffic Visualization */}
        <div className="mt-4 flex flex-col gap-2">
           <div className="flex items-center justify-between">
              <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Signal Integrity</span>
              <span className="text-[7px] font-mono text-vox-primary uppercase">99.8%</span>
           </div>
           <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                animate={isExecuting ? { left: ["-100%", "200%"] } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-vox-primary to-transparent blur-[1px]"
              />
           </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!w-6 !h-16 !rounded-r-xl !bg-vox-primary/30 !border-2 !border-vox-primary/50 !left-[-12px] hover:!bg-vox-primary hover:!w-8 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center after:content-[''] after:w-1 after:h-4 after:bg-white/40 after:rounded-full"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-6 !h-16 !rounded-l-xl !bg-vox-primary/30 !border-2 !border-vox-primary/50 !right-[-12px] hover:!bg-vox-primary hover:!w-8 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center after:content-[''] after:w-1 after:h-4 after:bg-white/40 after:rounded-full"
      />
      
      {/* HUD Info (Bottom Bar) */}
      <div className="bg-black/20 border-t border-white/5 px-4 py-1.5 flex items-center justify-between">
         <span className="text-[7px] font-black text-white/40 uppercase tracking-widest italic">
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
