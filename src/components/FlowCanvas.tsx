import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  ConnectionMode,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { CustomNode } from './CustomNode';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Save, Trash2, Cpu, Loader2, X, Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const TerminalDrawer = ({ isExecuting }: { isExecuting: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'warn' }[]>([
    { id: '1', msg: 'System initialized. Ready for operations.', type: 'info' }
  ]);

  useEffect(() => {
    if (isExecuting) {
      const timestamp = new Date().toLocaleTimeString();
      const newLogs = [
        { id: `${Date.now()}-1`, msg: `[${timestamp}] INITIALIZING EXECUTION SEQUENCE...`, type: 'info' as const },
        { id: `${Date.now()}-2`, msg: `[${timestamp}] VALIDATING NODE INTEGRITY...`, type: 'info' as const },
        { id: `${Date.now()}-3`, msg: `[${timestamp}] SCANNING LINK ENCRYPTION...`, type: 'warn' as const },
      ];
      setLogs(prev => [...prev, ...newLogs]);

      const timer = setTimeout(() => {
        const endTimestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { id: `end-${Date.now()}`, msg: `[${endTimestamp}] PIPELINE EXECUTION COMPLETE.`, type: 'success' as const }]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isExecuting]);

  return (
    <div className={cn(
      "absolute bottom-0 md:bottom-0 z-50 bg-black/90 backdrop-blur-3xl border-t border-white/5 transition-all duration-500 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]",
      "mb-16 md:mb-0", // Lift above mobile nav
      isOpen ? "h-56" : "h-10"
    )}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex items-center justify-between px-6 hover:bg-white/5 transition-colors group border-b border-white/[0.02] left-0 right-0"
      >
        <div className="flex items-center gap-3">
          <Terminal size={14} className={cn("transition-colors", isExecuting ? "text-vox-primary animate-pulse" : "text-white/30")} />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-vox-primary transition-colors">Pipeline Terminal Console</span>
        </div>
        <div className="flex items-center gap-4">
          {isExecuting && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vox-primary animate-ping" />
              <span className="text-[8px] font-black text-vox-primary uppercase tracking-widest">Processing</span>
            </div>
          )}
          {isOpen ? <ChevronDown size={14} className="text-white/20" /> : <ChevronUp size={14} className="text-white/20" />}
        </div>
      </button>
      
      <div className="p-6 h-44 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-1">
        {logs.map(log => (
          <div key={log.id} className="flex gap-4">
            <span className={cn(
              "leading-relaxed",
              log.type === 'info' && "text-white/50",
              log.type === 'success' && "text-vox-primary",
              log.type === 'warn' && "text-amber-400 font-bold",
            )}>
              <span className="text-vox-primary/30 mr-2">❯</span>{log.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const nodeTypes = {
  trigger: CustomNode,
  action: CustomNode,
};

export const FlowCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [lastExecution, setLastExecution] = React.useState<string | null>(null);
  const [saveStatus, setSaveStatus] = React.useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = React.useState<string | null>(null);
  
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode,
    setNodes,
    isExecuting,
    setIsExecuting,
    saveWorkflow,
    loadWorkflow,
    workspaces,
    currentWorkspaceId,
    addRuntimeJob
  } = useWorkflowStore();

  const activeWs = workspaces.find(w => w.id === currentWorkspaceId);

  // Load persistence on mount
  React.useEffect(() => {
    loadWorkflow();
    const saved = localStorage.getItem('voxflow-enterprise-data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.lastUpdated) setLastSavedTime(new Date(data.lastUpdated).toLocaleTimeString());
    }
  }, [loadWorkflow]);

  // Autosave Effect
  React.useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const timeoutId = setTimeout(() => {
        saveWorkflow();
        setLastSavedTime(new Date().toLocaleTimeString());
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, saveWorkflow]);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl + R: Reset View (Fit)
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        reactFlowInstance?.fitView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveWorkflow, reactFlowInstance]);

  const handleSave = () => {
    saveWorkflow();
    setSaveStatus('Snapshot saved to workspace');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');
      const icon = event.dataTransfer.getData('application/icon');

      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || { x: 0, y: 0 };

      const newNode = {
        id: `${type.toLowerCase()}-${Date.now()}`,
        type: type === 'Trigger' ? 'trigger' : 'action',
        position,
        data: { label, icon },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const handleExecute = () => {
    setIsExecuting(true);
    setLastExecution(null);
    
    // Log job to enterprise runtime tracker
    addRuntimeJob({
      workspaceId: currentWorkspaceId,
      nodeId: nodes.length > 0 ? nodes[0].data.label : 'Manual Start',
      status: 'running'
    });

    setTimeout(() => {
      setIsExecuting(false);
      setLastExecution(new Date().toLocaleTimeString());
      
      addRuntimeJob({
        workspaceId: currentWorkspaceId,
        nodeId: nodes.length > 0 ? nodes[0].data.label : 'Manual Start',
        status: 'success'
      });
    }, 2500);
  };

  const animatedEdges = React.useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      animated: isExecuting,
      style: { 
        stroke: isExecuting ? 'var(--color-vox-primary)' : 'rgba(255, 255, 255, 0.1)',
        strokeWidth: isExecuting ? 3 : 2,
        filter: isExecuting ? 'drop-shadow(0 0 8px var(--color-vox-primary))' : 'none'
      }
    }));
  }, [edges, isExecuting]);

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
      >
        <Background 
          color="#00E5FF" 
          gap={32} 
          size={1} 
          variant={BackgroundVariant.Lines} 
          className="opacity-5"
        />
        
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-32 h-32 mx-auto mb-8 rounded-[3rem] bg-vox-primary/5 border border-vox-primary/10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-vox-primary/20 blur-3xl rounded-full animate-pulse" />
                <Cpu size={64} className="text-vox-primary relative z-10" />
              </div>
              <h2 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-none font-display">
                Initialize <span className="text-vox-primary">Forge</span>
              </h2>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.6em]">System ready for modular synthesis</p>
            </motion.div>
          </div>
        )}
        <MiniMap 
          position="bottom-right"
          style={{ 
            backgroundColor: 'rgba(11, 16, 32, 0.9)', 
            borderRadius: '24px', 
            border: '1px solid rgba(0, 229, 255, 0.1)', 
            height: 120, 
            width: 180,
            backdropFilter: 'blur(10px)'
          }}
          nodeClassName="!rounded-sm"
          nodeColor={(n) => n.type === 'trigger' ? '#00E5FF' : '#5DA9FF'}
          maskColor="rgba(5, 8, 22, 0.8)"
          className="!hidden sm:!block !m-6 shadow-2xl"
        />
        <Controls 
          position="bottom-left"
          className="!bg-vox-panel/60 !border-vox-border !fill-white !shadow-none [&_button]:!bg-transparent [&_button]:!border-vox-border hover:[&_button]:!bg-vox-primary/10 !m-6 !rounded-xl overflow-hidden" 
        />
        
        <Panel position="top-right" className="flex gap-3 m-4 flex-wrap justify-end items-center">
          <div className="flex flex-col items-end justify-center px-4 hidden xl:flex">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-vox-primary animate-pulse" />
               <span className="text-[8px] font-black text-vox-primary uppercase tracking-[0.6em]">Neural Logic Mesh</span>
            </div>
            <span className="text-lg font-black text-white italic tracking-tighter font-display uppercase">{activeWs?.name || 'CENTRAL_NODE_01'}</span>
          </div>
          <div className="h-10 w-px bg-vox-border mx-3 hidden xl:block" />
          <button 
            onClick={handleSave}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-vox-border text-[10px] font-black text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
          >
            <Save size={14} /> Snapshot
          </button>
          <button 
            onClick={handleExecute}
            disabled={isExecuting}
            className={cn(
              "flex items-center gap-3 px-8 py-3 rounded-full text-[10px] font-black transition-all shadow-[0_0_40px_rgba(0,229,255,0.2)] uppercase tracking-widest",
              isExecuting 
                ? "bg-white/5 text-white/20 cursor-not-allowed border-vox-border" 
                : "bg-vox-primary text-vox-bg hover:scale-105 active:scale-95"
            )}
          >
            {isExecuting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
            {isExecuting ? 'Synthesizing...' : 'Execute Sequence'}
          </button>
        </Panel>

        {/* Execution Result Toast-like Panel */}
        <AnimatePresence>
          {lastExecution && (
            <Panel position="top-center" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="px-4 py-2 rounded-full bg-vox-primary/20 border border-vox-primary/50 text-vox-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 backdrop-blur-xl shadow-2xl"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-vox-primary animate-ping" />
                Process Completed at {lastExecution}
                <button onClick={() => setLastExecution(null)} className="ml-2 hover:text-white transition-colors">
                  <X size={12} />
                </button>
              </motion.div>
            </Panel>
          )}

          {saveStatus && (
            <Panel position="top-center" className="mt-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="px-4 py-2 rounded-xl glass-panel border-vox-primary/50 text-vox-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.2)]"
              >
                <Save size={12} />
                {saveStatus}
              </motion.div>
            </Panel>
          )}
        </AnimatePresence>

        <Panel position="bottom-center" className="glass-panel px-4 sm:px-6 py-2 sm:py-3 rounded-2xl flex items-center gap-4 sm:gap-8 border-white/20 mb-40 md:mb-16 mx-2 shadow-2xl relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
              isExecuting ? "bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,1)]" : "bg-vox-primary shadow-[0_0_8px_rgba(0,242,255,0.5)]"
            )} />
            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest text-white/80 uppercase font-bold whitespace-nowrap">
                {isExecuting ? 'Processing...' : 'Engine Active'}
              </span>
              {lastSavedTime && (
                <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">
                  Auto-Saved {lastSavedTime}
                </span>
              )}
            </div>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-[9px] sm:text-[10px] text-white/60 uppercase font-bold">Nodes</p>
              <p className="text-xs sm:text-sm font-mono text-white">{nodes.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] sm:text-[10px] text-white/60 uppercase font-bold">Edges</p>
              <p className="text-xs sm:text-sm font-mono text-white">{edges.length}</p>
            </div>
          </div>
        </Panel>

        <TerminalDrawer isExecuting={isExecuting} />
      </ReactFlow>
    </div>
  );
};

