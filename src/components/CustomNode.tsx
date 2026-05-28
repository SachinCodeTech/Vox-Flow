import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
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
  Braces,
  Trash2,
  Settings2,
  ZapOff,
  Link2,
  History,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { motion, AnimatePresence } from 'motion/react';
import { getNodeDocumentation } from '../lib/docs';

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

export const CustomNode = memo(({ id, data, selected, type, xPos, yPos, dragging }: NodeProps) => {
  const Icon = iconMap[data.icon as keyof typeof iconMap] || (type === 'trigger' ? Activity : Zap);
  const isTrigger = type === 'trigger';
  const { isExecuting, isExecutionMode, updateNodeLabel, setIsExecuting, addRuntimeJob, setContextMenu, deleteNode } = useWorkflowStore();
  
  const nodeState = useWorkflowStore(state => state.nodes.find(n => n.id === id)) as any;
  const filter = nodeState?.filter || data.filter;
  const executionCount = nodeState?.data?.executionCount || data.executionCount || 0;
  const lastExecutionTime = nodeState?.data?.lastExecutionTime || data.lastExecutionTime;
  const docText = data.documentation || getNodeDocumentation(data.label);
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [label, setLabel] = React.useState(data.label);
  const [showNeuralMenu, setShowNeuralMenu] = React.useState(false);

  // Trigger Neural Menu on Drag Start simulation (using dragging prop)
  React.useEffect(() => {
    if (dragging) {
      setShowNeuralMenu(true);
    } else {
      const timer = setTimeout(() => setShowNeuralMenu(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [dragging]);

  const status = data.status || 'success'; // success, failed, running
  const lastRun = lastExecutionTime || data.lastRun || 'Never';

  const handleRerun = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExecuting(true);
    useWorkflowStore.getState().updateNodeData(id, { status: 'running' });
    addRuntimeJob({
      workspaceId: 'manual',
      nodeId: id,
      status: 'running'
    });
    
    setTimeout(() => {
      setIsExecuting(false);
      useWorkflowStore.getState().updateNodeData(id, { status: 'success' });
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
    setContextMenu({ id, x: e.clientX, y: e.clientY, type: 'node' });
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
          scale: dragging ? 1.05 : 1, 
          opacity: 1,
          borderColor: isExecutionMode ? 'rgba(0, 229, 255, 0.4)' : (selected ? 'rgba(0, 229, 255, 0.6)' : 'rgba(255, 255, 255, 0.05)'),
          rotateX: dragging ? 10 : 0,
          rotateY: dragging ? -10 : 0,
        }}
        whileHover={{ scale: 1.02, shadow: "0 0 40px rgba(0, 229, 255, 0.15)" }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          "node-card min-w-[240px] transition-all duration-500 relative",
          selected && "shadow-[0_0_50px_rgba(0,229,255,0.2)]",
          isTrigger ? "rounded-[2.5rem] border-vox-primary/20 bg-vox-primary/5" : "rounded-3xl border-white/5 bg-white/[0.02]",
          isExecutionMode && "shadow-[0_0_30px_rgba(0,229,255,0.05)]",
          dragging && "z-[200] shadow-[0_0_80px_rgba(0,229,255,0.3)]",
          data.status === 'running' && "border-vox-primary shadow-[0_0_40px_rgba(0,242,255,0.3)] animate-pulse",
          data.status === 'failed' && "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] bg-red-500/5",
          filter ? "opacity-25 grayscale brightness-75 scale-95 pointer-events-none" : "opacity-100",
          "group"
        )}
      >
        {/* Neural Interface Overlay (on Drag Attempt) */}
        <AnimatePresence>
          {showNeuralMenu && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute -inset-10 z-[150] pointer-events-none"
            >
               <div className="relative w-full h-full flex items-center justify-center">
                  {/* Radial Options */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 0, y: 0 }}
                      animate={{ 
                        opacity: [0, 1],
                        x: Math.cos(angle * Math.PI / 180) * 100,
                        y: Math.sin(angle * Math.PI / 180) * 100
                      }}
                      className="absolute w-8 h-8 rounded-full bg-vox-bg/80 border border-vox-primary/40 backdrop-blur-xl flex items-center justify-center shadow-lg"
                    >
                       <div className="w-1 h-1 rounded-full bg-vox-primary animate-ping" />
                    </motion.div>
                  ))}
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full">
                     <circle cx="50%" cy="50%" r="90" fill="none" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-vox-primary/20 rounded-full border border-vox-primary/40 text-[8px] font-black text-vox-primary uppercase tracking-[0.4em] whitespace-nowrap">
                     Neural_Interface_Active
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Selection Glow Layer (Distinctive) */}
        {selected && (
          <div className="absolute -inset-1 bg-vox-primary/10 blur-xl rounded-[inherit] -z-10 animate-pulse transition-opacity" />
        )}
        {/* Active Particle Effect (If Running) */}
        {data.status === 'running' && (
           <div className="absolute inset-0 z-0 opacity-40 pointer-events-none rounded-3xl overflow-hidden">
              <motion.div 
                animate={{ 
                  x: [-100, 350], 
                  opacity: [0, 1, 0] 
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-vox-primary to-transparent skew-x-12"
              />
           </div>
        )}

        {/* Status Indicator */}
        <div className="absolute -top-1 -right-1 flex gap-1 z-20">
           {(!data.label || (type !== 'trigger' && useWorkflowStore.getState().edges.filter(e => e.target === id).length === 0)) && (
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 rounded-full bg-amber-500 border-2 border-vox-bg flex items-center justify-center text-black text-[10px] font-bold shadow-lg"
                title="Validation Check: Missing Prerequisites"
              >
                !
              </motion.div>
           )}
           {data.status === 'failed' && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 0.5, repeat: Infinity }}
               className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[6px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg"
             >
                <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                Failure Detect
             </motion.div>
           )}
           <div className={cn(
             "w-3 h-3 rounded-full border-2 border-vox-bg shadow-lg",
             data.status === 'success' ? "bg-green-400" : data.status === 'failed' ? "bg-red-400" : data.status === 'running' ? "bg-vox-primary animate-ping" : data.status === 'awaiting' ? "bg-amber-400 animate-pulse" : "bg-white/10"
           )} />
        </div>

        {/* Node Error Popup (If Failed) */}
        {data.status === 'failed' && (
          <div className="absolute -bottom-12 left-0 right-0 p-2 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-md z-30">
            <p className="text-[7px] font-black text-red-400 uppercase tracking-widest text-center">
               Error: PREREQUISITE_LOGIC_MESH_SEVERED
            </p>
          </div>
        )}

        {/* Approval Popup */}
        {data.status === 'awaiting' && (
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 p-3 bg-amber-400/10 border border-amber-400/30 rounded-2xl backdrop-blur-md z-30 space-y-2">
            <p className="text-[7px] font-black text-amber-400 uppercase tracking-widest text-center">
               Human Intervention Required
            </p>
            <div className="flex gap-2">
               <button 
                 onClick={() => useWorkflowStore.getState().updateNodeData(id, { status: 'success' })}
                 className="flex-1 py-1 rounded bg-amber-400 text-black text-[7px] font-black uppercase"
               >
                 Approve
               </button>
               <button 
                 onClick={() => useWorkflowStore.getState().updateNodeData(id, { status: 'failed' })}
                 className="flex-1 py-1 rounded bg-red-500/20 text-red-400 text-[7px] font-black uppercase border border-red-500/30"
               >
                 Reject
               </button>
            </div>
          </div>
        )}

        {/* Hover Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-black/95 backdrop-blur-xl rounded-2xl border border-vox-primary/30 text-[9px] font-black text-white uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-[110] shadow-2xl">
           <div className="flex flex-col gap-1">
              <span className="text-vox-primary">ID: {id}</span>
              <span className="text-white/60">Type: {type}</span>
              <span className="text-white/40">Last Run: {lastRun}</span>
              <div className="h-px bg-white/5 my-1" />
              <p className="max-w-[150px] whitespace-normal lowercase leading-relaxed font-medium tracking-tight">
                 {data.description || "Operational intelligence module executing localized neural logic patterns."}
              </p>
           </div>
        </div>
        {/* Selection Toolbar (Hover) */}
        {selected && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-vox-bg/95 backdrop-blur-3xl border border-vox-primary/30 rounded-2xl p-1.5 shadow-2xl transition-all duration-300 z-[100]">
             <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-2 rounded-xl bg-white/5 hover:bg-vox-primary/20 text-white/40 hover:text-white transition-all active:scale-95"
              title="Edit Parameters"
             >
                <Settings2 size={12} />
             </button>
             <button 
              className="p-2 rounded-xl bg-white/5 hover:bg-vox-primary/20 text-white/40 hover:text-white transition-all active:scale-95"
              title="View History"
             >
                <History size={12} />
             </button>
             <button 
              onClick={handleRerun}
              disabled={isExecuting}
              className="p-2 rounded-xl bg-white/5 hover:bg-vox-primary/20 text-white/40 hover:text-vox-primary transition-all active:scale-95 disabled:opacity-50"
              title="Execute Logic"
             >
                <Zap size={12} className={isExecuting ? "animate-pulse" : ""} />
             </button>
             <div className="w-px h-4 bg-white/5 mx-1" />
             <button 
              onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all active:scale-95"
              title="Decommission Node"
             >
                <Trash2 size={12} />
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
            "w-12 h-12 flex items-center justify-center transition-all duration-500 relative",
            isTrigger ? "rounded-[1.5rem] bg-vox-primary/20 text-vox-primary shadow-[0_0_20px_rgba(0,242,255,0.2)]" : "rounded-xl bg-white/5 text-white/20 group-hover:bg-vox-primary/10 group-hover:text-vox-primary",
            isExecuting && "animate-pulse"
          )}>
            <Icon size={isTrigger ? 20 : 24} className="relative z-10" />
            {(isExecuting || (isTrigger && !isExecutionMode)) && (
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  "absolute inset-0 rounded-[inherit]",
                  isTrigger ? "bg-vox-primary" : "bg-vox-primary/40"
                )}
              />
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <div className="flex items-center gap-1.5 min-w-0 z-40">
                <span className="text-[8.5px] font-black uppercase tracking-[0.3em] text-vox-primary italic truncate">
                  {type}_module
                </span>
                
                {/* Info Icon with hover tooltip */}
                <div className="relative group/doc cursor-help shrink-0">
                  <Info size={10} className="text-white/33 hover:text-vox-primary transition-colors" />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover/doc:opacity-100 group-hover/doc:pointer-events-auto transition-all duration-200 w-56 p-3 bg-[#0d0d0d]/95 backdrop-blur-xl border border-vox-primary/30 rounded-2xl text-[8.5px] text-white/80 normal-case tracking-normal shadow-[0_15px_40px_rgba(0,0,0,0.8)] z-[350] leading-relaxed">
                    <div className="font-bold text-[9px] text-vox-primary uppercase tracking-widest mb-1.5 flex items-center gap-1.5 border-b border-white/5 pb-1">
                      <Info size={10} />
                      Component Guide
                    </div>
                    {docText}
                  </div>
                </div>
              </div>
              <div className={cn(
                "h-1 px-2 rounded-full transition-all shrink-0",
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
            <span className="text-[8.5px] font-bold text-white/60 uppercase tracking-widest mt-1 block group-hover:text-white/90 transition-colors">
              Logic Hash: {id.split('-')[0]}
            </span>
          </div>
        </div>

        {/* Neural Traffic Visualization */}
        <div className="mt-4 flex flex-col gap-2">
           <div className="flex items-center justify-between">
              <span className="text-[8px] font-black text-white/65 uppercase tracking-wider">Signal Integrity</span>
              <span className="text-[8.5px] font-semibold font-mono text-vox-primary uppercase">99.8%</span>
           </div>
           <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
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
      <div className="bg-black/45 border-t border-white/10 px-4 py-1.5 flex items-center justify-between gap-1.5">
         <span className="text-[8px] font-black text-white/65 uppercase tracking-wider italic truncate flex-1">
            Status: {isExecuting ? 'Exec' : 'Standby'}
         </span>
         {executionCount > 0 && (
           <span className="text-[7.5px] uppercase font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1.5 leading-none shadow-[0_0_10px_rgba(16,185,129,0.1)] shrink-0">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
             Runs: {executionCount}
           </span>
         )}
         <span className="text-[8px] font-black text-vox-primary/80 uppercase tracking-widest shrink-0">
            0X.42.FF
         </span>
      </div>
    </motion.div>
  );
});

CustomNode.displayName = 'CustomNode';
