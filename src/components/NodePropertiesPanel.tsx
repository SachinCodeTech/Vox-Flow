import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings2, 
  Type, 
  Trash2, 
  Cpu, 
  Activity, 
  Layers, 
  Zap,
  Tag,
  Hash,
  Database,
  Terminal,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

import { TypingText } from './TypingText';

export const NodePropertiesPanel = () => {
  const { nodes, deleteNode, updateNodeLabel, updateNodeData, isExecuting, setIsExecuting, addRuntimeJob } = useWorkflowStore();
  const selectedNode = nodes.find(n => n.selected);
  const [label, setLabel] = useState('');
  const [params, setParams] = useState<Record<string, string>>({});
  const [metadata, setMetadata] = useState<Record<string, string>>({
    version: 'V2.4.0-STABLE',
    author: 'Sarah_Chen',
    hash: '0x-442-99-AF-EC-02'
  });

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label);
      setParams(selectedNode.data.parameters || {});
      setMetadata(selectedNode.data.metadata || {
        version: 'V2.4.0-STABLE',
        author: 'Sarah_Chen',
        hash: '0x-442-99-AF-EC-02'
      });
    }
  }, [selectedNode]);

  const handleMetadataChange = (key: string, val: string) => {
    const newMetadata = { ...metadata, [key]: val };
    setMetadata(newMetadata);
    if (selectedNode) {
      updateNodeData(selectedNode.id, { metadata: newMetadata });
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLabel(val);
    if (selectedNode) {
      updateNodeLabel(selectedNode.id, val);
    }
  };

  const handleParamChange = (key: string, val: string) => {
    const newParams = { ...params, [key]: val };
    setParams(newParams);
    if (selectedNode) {
      updateNodeData(selectedNode.id, { parameters: newParams });
    }
  };

  const handleRerun = () => {
    if (!selectedNode) return;
    setIsExecuting(true);
    addRuntimeJob({
      workspaceId: 'manual',
      nodeId: selectedNode.id,
      status: 'running'
    });
    
    setTimeout(() => {
      setIsExecuting(false);
      addRuntimeJob({
        workspaceId: 'manual',
        nodeId: selectedNode.id,
        status: 'success'
      });
    }, 2000);
  };

  const handleDelete = () => {
    if (selectedNode && confirm('Are you sure you want to delete this node?')) {
      deleteNode(selectedNode.id);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {selectedNode && (
        <motion.div
          key={selectedNode.id}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="absolute top-4 bottom-4 right-4 w-80 bg-vox-bg/95 backdrop-blur-3xl border border-vox-primary/30 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-vox-primary/10 flex items-center justify-center border border-vox-primary/20">
                <Settings2 size={18} className="text-vox-primary" />
              </div>
              <div className="flex flex-col">
                <TypingText text="Neural Interface" className="text-[10px] font-black text-vox-primary uppercase tracking-[0.3em]" />
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest italic">{selectedNode.type} :: {selectedNode.id.split('-')[0]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/5 text-white/40">
                <Activity size={16} className={isExecuting ? "animate-pulse text-vox-primary" : ""} />
              </div>
              <button 
                onClick={() => useWorkflowStore.getState().deselectNodes()}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all active:scale-90 border border-transparent hover:border-red-500/20"
                title="Deactivate Interface"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {/* Metadata Layer */}
            <section className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Hash size={12} className="text-vox-primary/80" />
                  <h4 className="text-[9px] font-black text-white/70 uppercase tracking-widest italic">Metadata Layer</h4>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/[0.04] border border-white/10 p-3 rounded-xl flex flex-col gap-1">
                     <span className="text-[6px] font-black text-white/40 uppercase">Version</span>
                     <input 
                       className="bg-transparent text-[9px] font-black text-white/80 focus:outline-none border-b border-vox-primary/0 focus:border-vox-primary/30 transition-all uppercase"
                       value={metadata.version}
                       onChange={(e) => handleMetadataChange('version', e.target.value)}
                     />
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 p-3 rounded-xl flex flex-col gap-1">
                     <span className="text-[6px] font-black text-white/40 uppercase">CreatedBy</span>
                     <input 
                       className="bg-transparent text-[9px] font-black text-white/80 focus:outline-none border-b border-vox-primary/0 focus:border-vox-primary/30 transition-all uppercase"
                       value={metadata.author}
                       onChange={(e) => handleMetadataChange('author', e.target.value)}
                     />
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 p-3 rounded-xl flex flex-col gap-1 col-span-2">
                     <span className="text-[6px] font-black text-white/40 uppercase">Deployment Hash</span>
                     <input 
                       className="bg-transparent text-[9px] font-mono text-vox-primary/80 truncate focus:outline-none border-b border-vox-primary/0 focus:border-vox-primary/30 transition-all"
                       value={metadata.hash}
                       onChange={(e) => handleMetadataChange('hash', e.target.value)}
                     />
                  </div>
               </div>
            </section>

            {/* General Info */}
            <section className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Tag size={12} className="text-vox-primary/60" />
                  <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest italic">Core Identification</h4>
               </div>
               
               <div className="space-y-4 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-end">
                       <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Logical Label</label>
                       {!label && <span className="text-[7px] font-black text-red-400 uppercase">Required*</span>}
                    </div>
                    <div className="relative">
                      <Type className={cn("absolute left-3 top-1/2 -translate-y-1/2 transition-colors", !label ? "text-red-400" : "text-white/20")} size={12} />
                      <input 
                        type="text" 
                        value={label}
                        onChange={handleLabelChange}
                        className={cn(
                          "w-full bg-black/40 border rounded-xl py-3 pl-10 pr-4 text-[11px] font-black text-white focus:outline-none transition-all uppercase tracking-[0.1em] italic",
                          !label ? "border-red-500/50" : "border-vox-border focus:border-vox-primary/50"
                        )}
                      />
                    </div>
                  </div>
               </div>
            </section>

            {/* Logical Config / Params */}
            <section className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Database size={12} className="text-vox-primary/60" />
                  <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest italic">Signal Parameters</h4>
               </div>
               
               <div className="space-y-3">
                  {selectedNode.type === 'action' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[7px] font-black text-white/20 uppercase tracking-widest">Protocol Type</label>
                        <select 
                          className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 px-3 text-[10px] font-black text-white/60 focus:outline-none focus:border-vox-primary/30 transition-all uppercase appearance-none"
                          value={params.protocol || 'JSON'}
                          onChange={(e) => handleParamChange('protocol', e.target.value)}
                        >
                          <option>JSON-RPC</option>
                          <option>REST-MESH</option>
                          <option>WEBSOCKET-SENTIENT</option>
                          <option>GRAPHQL-NEURAL</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[7px] font-black text-white/20 uppercase tracking-widest">Retry Policy</label>
                        <div className="flex gap-2">
                          {['None', 'Linear', 'Exp'].map(policy => (
                            <button
                              key={policy}
                              onClick={() => handleParamChange('retry', policy)}
                              className={cn(
                                "flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all border",
                                params.retry === policy 
                                  ? "bg-vox-primary/10 border-vox-primary/40 text-vox-primary" 
                                  : "bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20"
                              )}
                            >
                              {policy}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[7px] font-black text-white/20 uppercase tracking-widest">Logic Script (Inline AI)</label>
                         <div className="p-4 bg-black/60 border border-white/5 rounded-xl font-mono text-[9px] text-vox-primary/40 leading-relaxed italic">
                            // Neural sequence auto-generated<br/>
                            await vox.dispatch("{label.toLowerCase()}");<br/>
                            return signal.ack();
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 rounded-xl bg-vox-primary/5 border border-vox-primary/10">
                      <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed text-center">
                        Entry-point trigger nodes utilize global environmental signals. Configuration inherited from Central Intelligence.
                      </p>
                    </div>
                  )}
               </div>
            </section>

            {/* Runtime Metrics */}
            <section className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Zap size={12} className="text-vox-primary/60" />
                  <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest italic">Neural Metrics</h4>
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                     <span className="text-[7px] font-black text-white/20 uppercase">Success Rate</span>
                     <span className="text-xs font-black text-vox-primary italic">99.8%</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                     <span className="text-[7px] font-black text-white/20 uppercase">Avg Latency</span>
                     <span className="text-xs font-black text-vox-primary italic">24ms</span>
                  </div>
               </div>
            </section>

            {/* Operational Status */}
            <section className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Terminal size={12} className="text-vox-primary/60" />
                  <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest italic">Live Heartbeat</h4>
               </div>
               
               <div className="bg-black/80 rounded-2xl border border-white/5 p-4 font-mono text-[9px] text-vox-primary/60 space-y-2 h-32 overflow-y-auto custom-scrollbar">
                  <div className="flex gap-2">
                     <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                     <span>INTEGRITY_CHECK: PASSED</span>
                  </div>
                  <div className="flex gap-2">
                     <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                     <span className={isExecuting ? "text-vox-primary" : ""}>
                        {isExecuting ? "SIGNAL_PROCESSING..." : "IDLE_STANDBY"}
                     </span>
                  </div>
                  {isExecuting && (
                    <div className="flex gap-2 items-center text-vox-primary animate-pulse">
                       <div className="w-1 h-1 rounded-full bg-vox-primary" />
                       <span>DATA_PACKET_MESH_SYNC...</span>
                    </div>
                  )}
               </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-black/40 border-t border-white/5 space-y-3">
             <button 
              onClick={handleRerun}
              disabled={isExecuting}
              className="w-full py-4 rounded-2xl bg-vox-primary/10 border border-vox-primary/30 text-vox-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-vox-primary/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
             >
                <RefreshCw size={16} className={cn("group-hover:rotate-180 transition-transform duration-700", isExecuting && "animate-spin")} />
                Manual Pulse Re-run
             </button>
             <button 
              onClick={handleDelete}
              className="w-full py-3 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 opacity-40 hover:opacity-100 hover:bg-red-500/10 transition-all text-[8px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"
             >
                <Trash2 size={12} />
                Decommission Instance
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
