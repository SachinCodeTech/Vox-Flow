import React from 'react';
import { motion } from 'motion/react';
import { Wifi, Shield, Cpu, Activity, Database, Globe } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';

export const StatusBar = () => {
  const { isExecuting, executionState, currentWorkspaceId, workspaces } = useWorkflowStore();
  const currentWs = workspaces.find(w => w.id === currentWorkspaceId);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 sm:h-6 bg-vox-bg border-t border-white/5 flex items-center px-4 justify-between z-[9000] backdrop-blur-md select-none">
       <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <div className={cn(
               "w-1.5 h-1.5 rounded-full",
               isExecuting ? "bg-vox-primary animate-pulse" : "bg-vox-success"
             )} />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">
                Mesh_Status: <span className={isExecuting ? "text-vox-primary" : "text-vox-success"}>{isExecuting ? `EXECUTING_${executionState.toUpperCase()}` : 'READY_STANDBY'}</span>
             </span>
          </div>
          <div className="h-3 w-px bg-white/10 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
             <Activity size={10} className="text-white/20" />
             <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Workspace: {currentWs?.name}</span>
          </div>
       </div>

       <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
             <div className="flex items-center gap-1.5 grayscale opacity-30">
                <Globe size={10} />
                <span className="text-[8px] font-black uppercase">L7_Edge</span>
             </div>
             <div className="flex items-center gap-1.5 grayscale opacity-30">
                <Database size={10} />
                <span className="text-[8px] font-black uppercase">Sync_Vault</span>
             </div>
             <div className="flex items-center gap-1.5 text-vox-primary/40">
                <Shield size={10} />
                <span className="text-[8px] font-black uppercase">Zero_Trust</span>
             </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/10">
             <Wifi size={10} className="text-vox-success" />
             <span className="text-[8px] font-mono text-white/40">12ms_latency</span>
          </div>
          <div className="text-[8px] font-mono text-white/10 uppercase tracking-widest hidden sm:block">
             v4.0.12-sentient
          </div>
       </div>
    </div>
  );
};
