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
import { NeuralEdge } from './NeuralEdge';
import { GroupNode } from './GroupNode';
import { NodePropertiesPanel } from './NodePropertiesPanel';
import { NodeContextMenu } from './NodeContextMenu';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Save, 
  Trash2, 
  Cpu, 
  Loader2, 
  X, 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Activity, 
  Radio, 
  Undo2, 
  Redo2, 
  Layers,
  Pause,
  SkipForward,
  RotateCcw,
  History
} from 'lucide-react';
import { cn } from '../lib/utils';

const TerminalDrawer = ({ isExecuting, isExecutionMode }: { isExecuting: boolean; isExecutionMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'warn' }[]>([
    { id: '1', msg: 'System initialized. Ready for operations.', type: 'info' }
  ]);

  useEffect(() => {
    if (isExecuting || isExecutionMode) {
      const timestamp = new Date().toLocaleTimeString();
      const newLogs = isExecuting 
        ? [
            { id: `${Date.now()}-1`, msg: `[${timestamp}] INITIALIZING EXECUTION SEQUENCE...`, type: 'info' as const },
            { id: `${Date.now()}-2`, msg: `[${timestamp}] VALIDATING NODE INTEGRITY...`, type: 'info' as const },
            { id: `${Date.now()}-3`, msg: `[${timestamp}] SCANNING LINK ENCRYPTION...`, type: 'warn' as const },
          ]
        : [
            { id: `${Date.now()}-1`, msg: `[${timestamp}] CONTINUOUS MONITORING ACTIVE...`, type: 'info' as const },
            { id: `${Date.now()}-2`, msg: `[${timestamp}] NO ANOMALIES DETECTED IN MESH.`, type: 'success' as const },
          ];
      
      setLogs(prev => [...prev, ...newLogs].slice(-50));

      if (isExecuting) {
        const timer = setTimeout(() => {
          const endTimestamp = new Date().toLocaleTimeString();
          setLogs(prev => [...prev, { id: `end-${Date.now()}`, msg: `[${endTimestamp}] PIPELINE EXECUTION COMPLETE.`, type: 'success' as const }]);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isExecuting, isExecutionMode]);

  // Periodic Ambient Logs in Execution Mode
  useEffect(() => {
    if (isExecutionMode && !isExecuting) {
      const interval = setInterval(() => {
        const msgs = [
          "HEARTBEAT_NOMINAL: 72BPM",
          "NEURAL_LATENCY: 4ms",
          "CACHE_PURGE_SUCCESSFUL",
          "IDLE_AGENTS: SCANNING_REPOSITORY",
          "ENCRYPTION_STRENGTH: 4096-BIT"
        ];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { id: Date.now().toString(), msg: `[${timestamp}] ${msg}`, type: 'info' }].slice(-50));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isExecutionMode, isExecuting]);

  return (
    <motion.div 
      initial={false}
      animate={{ height: isOpen ? 224 : 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "absolute bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-3xl border-t border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] w-full overflow-hidden",
        "mb-16 md:mb-0" // Lift above mobile nav
      )}
    >
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
    </motion.div>
  );
};

const nodeTypes = {
  trigger: CustomNode,
  action: CustomNode,
  group: GroupNode,
};

const edgeTypes = {
  neural: NeuralEdge,
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
    executionState,
    executionStep,
    executionHistory,
    pauseExecution,
    resumeExecution,
    stepExecution,
    rewindExecution,
    isExecutionMode,
    toggleExecutionMode,
    undo,
    redo,
    takeSnapshot,
    saveWorkflow,
    loadWorkflow,
    workspaces,
    currentWorkspaceId,
    addRuntimeJob,
    executeSequence
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
      // Ctrl + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      // Ctrl + Y: Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
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

      if (!type) return;

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || { x: 0, y: 0 };

      const newNode = {
        id: `${type.toLowerCase()}-${Date.now()}`,
        type: type.toLowerCase(), // Ensure lowercase 'trigger' or 'action'
        position,
        data: { label, icon },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const handleExecute = () => {
    executeSequence();
    setLastExecution(null);
    
    // Log job to enterprise runtime tracker
    addRuntimeJob({
      workspaceId: currentWorkspaceId,
      nodeId: nodes.length > 0 ? nodes[0].data.label : 'Manual Start',
      status: 'running'
    });
  };

  const animatedEdges = React.useMemo(() => {
    const active = isExecuting || isExecutionMode;
    return edges.map(edge => ({
      ...edge,
      type: 'neural',
      data: { isExecuting: active },
      animated: true,
      interactionWidth: 20,
      markerEnd: {
        type: 'arrowclosed' as any,
        width: 15,
        height: 15,
        color: active ? '#00E5FF' : '#5DA9FF',
      },
      style: { 
        stroke: active ? '#00E5FF' : 'rgba(93, 169, 255, 0.4)',
        strokeWidth: active ? 4 : 2,
      }
    }));
  }, [edges, isExecuting, isExecutionMode]);

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const onNodesDelete = useCallback((deletedNodes: any[]) => {
    if (deletedNodes.length > 0) {
      setConfirmDelete(deletedNodes[0].id);
    }
  }, []);

  const onNodeDragStop = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const handleClusterSelected = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected);
    if (selectedNodes.length < 1) return;

    takeSnapshot();

    const minX = Math.min(...selectedNodes.map(n => n.position.x));
    const minY = Math.min(...selectedNodes.map(n => n.position.y));
    const maxX = Math.max(...selectedNodes.map(n => (n.position.x + (n.width || 250))));
    const maxY = Math.max(...selectedNodes.map(n => (n.position.y + (n.height || 100))));

    const padding = 60;
    const groupId = `group-${Date.now()}`;
    
    // 1. Create the Group Node
    const groupNode = {
      id: groupId,
      type: 'group',
      position: { x: minX - padding, y: minY - padding },
      style: { width: (maxX - minX) + padding * 2, height: (maxY - minY) + padding * 2 },
      data: { label: 'NEURAL_CLUSTER' },
    };

    // 2. Update selected nodes to be children
    const updatedNodes = nodes.map(n => {
      if (n.selected) {
        return {
          ...n,
          parentNode: groupId,
          extent: 'parent' as const,
          position: { 
            x: n.position.x - (minX - padding), 
            y: n.position.y - (minY - padding) 
          },
          selected: false
        };
      }
      return n;
    });

    setNodes([groupNode, ...updatedNodes]);
  }, [nodes, setNodes, takeSnapshot]);

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      const { deleteNode } = useWorkflowStore.getState();
      deleteNode(confirmDelete);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      {/* Execution Control Overlay */}
      <AnimatePresence>
        {isExecuting && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 p-2 bg-vox-bg/80 backdrop-blur-2xl border border-vox-primary/30 rounded-[2rem] shadow-[0_0_40px_rgba(0,242,255,0.2)]"
          >
             <div className="flex items-center gap-1 px-4 border-r border-white/10 mr-2">
                <div className="w-2 h-2 rounded-full bg-vox-primary animate-ping" />
                <span className="text-[10px] font-black text-vox-primary uppercase tracking-widest whitespace-nowrap">Pulse Executing</span>
                <span className="ml-3 px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-white/40">Step: {executionStep}</span>
             </div>

             <div className="flex items-center gap-1">
                <button 
                  onClick={rewindExecution}
                  disabled={executionHistory.length === 0}
                  className="p-3 rounded-xl hover:bg-white/5 text-white/60 disabled:opacity-20 transition-all"
                  title="Rewind Step"
                >
                   <History size={18} />
                </button>
                {executionState === 'paused' ? (
                  <button 
                    onClick={resumeExecution}
                    className="p-3 rounded-xl bg-vox-primary text-vox-bg shadow-lg shadow-vox-primary/20 hover:scale-[1.1] active:scale-95 transition-all"
                    title="Resume"
                  >
                     <Play size={18} fill="currentColor" />
                  </button>
                ) : (
                  <button 
                    onClick={pauseExecution}
                    className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                    title="Pause"
                  >
                     <Pause size={18} fill="currentColor" />
                  </button>
                )}
                <button 
                  onClick={stepExecution}
                  className="p-3 rounded-xl hover:bg-white/5 text-white/60 transition-all"
                  title="Step Forward"
                >
                   <SkipForward size={18} fill="currentColor" />
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <button 
                  onClick={() => setIsExecuting(false)}
                  className="p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all"
                  title="Terminate Sequence"
                >
                   <RotateCcw size={18} />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReactFlow
        nodes={nodes}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={() => useWorkflowStore.getState().deselectNodes()}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode={['Backspace', 'Delete']}
        onNodesDelete={onNodesDelete}
        onNodeContextMenu={(event, node) => {
          event.preventDefault();
          useWorkflowStore.getState().setContextMenu({
            id: node.id,
            x: event.clientX,
            y: event.clientY,
            type: 'node'
          });
        }}
        onPaneContextMenu={(event) => {
          event.preventDefault();
          useWorkflowStore.getState().setContextMenu({
            x: event.clientX,
            y: event.clientY,
            type: 'canvas'
          });
        }}
        snapToGrid={true}
        snapGrid={[16, 16]}
        fitView
        onlyRenderVisibleElements={true}
      >
          <Background 
            color={isExecutionMode ? "#00E5FF" : "#5DA9FF"} 
            gap={32} 
            size={1} 
            variant={BackgroundVariant.Lines} 
            className={cn("transition-all duration-1000", isExecutionMode ? "opacity-10" : "opacity-5")}
          />
          
          <NodePropertiesPanel />
          <NodeContextMenu />
          
          {/* Floating Selection Actions */}
          <AnimatePresence>
            {nodes.filter(n => n.selected).length > 1 && (
              <Panel position="top-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-4 bg-vox-bg/95 backdrop-blur-3xl border border-vox-primary/40 px-6 py-3 rounded-2xl shadow-2xl mt-4"
                >
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-vox-primary uppercase tracking-[0.2em]">{nodes.filter(n => n.selected).length} Instances Selected</span>
                      <span className="text-[7px] font-black text-white/30 uppercase tracking-widest italic">Neural Batch Operations</span>
                   </div>
                   <div className="h-8 w-px bg-white/10 mx-2" />
                   <button 
                    onClick={handleClusterSelected}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vox-primary/10 border border-vox-primary/30 text-vox-primary text-[10px] font-black uppercase hover:bg-vox-primary/20 transition-all"
                   >
                      <Layers size={14} />
                      Cluster Selected
                   </button>
                   <button 
                    onClick={() => {
                      if (confirm(`Decommission ${nodes.filter(n => n.selected).length} neural instances?`)) {
                        nodes.filter(n => n.selected).forEach(n => useWorkflowStore.getState().deleteNode(n.id));
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase hover:bg-red-500/20 transition-all"
                   >
                      <Trash2 size={14} />
                      Batch Decommission
                   </button>
                </motion.div>
              </Panel>
            )}
          </AnimatePresence>

          {/* Deletion Confirmation Modal */}
        <AnimatePresence>
          {confirmDelete && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm bg-vox-bg border border-vox-primary/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.2)]"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-vox-primary/10 flex items-center justify-center">
                    <Trash2 size={32} className="text-vox-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Sever Connection?</h3>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-2 px-4">
                      Are you sure you want to decommission this neural node from the active mesh?
                    </p>
                  </div>
                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => setConfirmDelete(null)}
                      className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                    >
                      Abort
                    </button>
                    <button 
                      onClick={handleConfirmDelete}
                      className="flex-1 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-[10px] font-black text-red-400 hover:bg-red-500/30 transition-all uppercase tracking-widest"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
          <div className="h-10 w-px bg-white/5 mx-3" />
          
          {/* Execution Mode Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-full overflow-hidden">
             <button 
              onClick={undo}
              className="p-3 border-r border-white/5 hover:bg-white/5 text-white/30 hover:text-white transition-all active:scale-95"
              title="Undo Sequence"
             >
                <Undo2 size={14} />
             </button>
             <button 
              onClick={redo}
              className="p-3 hover:bg-white/5 text-white/30 hover:text-white transition-all active:scale-95"
              title="Redo Sequence"
             >
                <Redo2 size={14} />
             </button>
          </div>

          <div className="h-10 w-px bg-white/5 mx-1" />

          <button 
            onClick={handleClusterSelected}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/40 hover:text-vox-primary hover:border-vox-primary/30 transition-all uppercase tracking-widest"
            title="Cluster Selected Nodes"
          >
            <Layers size={14} />
            Cluster
          </button>

          <button 
            onClick={toggleExecutionMode}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black transition-all uppercase tracking-widest border",
              isExecutionMode 
                ? "bg-vox-primary/10 border-vox-primary text-vox-primary shadow-[0_0_20px_rgba(0,229,255,0.2)]" 
                : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
            )}
          >
            <Radio size={14} className={isExecutionMode ? "animate-pulse" : ""} />
            {isExecutionMode ? 'Execution Mode: ON' : 'Draft Mode'}
          </button>

          <button 
            onClick={handleSave}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-vox-border text-[10px] font-black text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
          >
            <Save size={14} /> Snapshot
          </button>
          <button 
            onClick={() => {
              if (confirm('Initiate production-grade build of this neural sequence?')) {
                setIsExecuting(true);
                setTimeout(() => {
                   setIsExecuting(false);
                   alert('Build successful. Artifact deployed to AOC Production Layer.');
                }, 3000);
              }
            }}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-vox-secondary/10 border border-vox-secondary/30 text-[10px] font-black text-vox-secondary hover:bg-vox-secondary hover:text-white transition-all uppercase tracking-widest group"
          >
            <Cpu size={14} className="group-hover:rotate-90 transition-transform" /> Build_Mesh
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

      </ReactFlow>
      <TerminalDrawer isExecuting={isExecuting} isExecutionMode={isExecutionMode} />
    </div>
  );
};

