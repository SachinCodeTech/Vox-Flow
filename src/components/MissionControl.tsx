import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Shield, 
  Cpu, 
  Zap, 
  Database, 
  Globe, 
  Layers,
  Thermometer,
  Cloud,
  Network,
  ChevronRight
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export const MissionControl = () => {
  const { workspaces, agents, healthHistory, systemVitals } = useWorkflowStore();

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[#020202] text-white p-6 md:p-12 space-y-12 pb-40">
      {/* OS Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-vox-primary/10 border border-vox-primary/20 flex items-center justify-center">
                <Network className="text-vox-primary" size={20} />
             </div>
             <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Mission_Control</h1>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Global System Telemetry</p>
             </div>
          </div>
        </div>
        
        <div className="flex gap-8 border-l border-white/5 pl-8 h-12 items-center">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Active_Threads</span>
              <span className="text-xl font-black text-vox-primary tabular-nums">{systemVitals.threads}</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Mesh_Load</span>
              <span className="text-xl font-black text-vox-secondary tabular-nums">{systemVitals.meshLoad}%</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Kernel_Temp</span>
              <span className="text-xl font-black text-vox-success tabular-nums">{systemVitals.kernelTemp}°C</span>
           </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Agent Grid */}
        <div className="md:col-span-2 space-y-6">
           <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
              <Cpu size={14} className="text-vox-primary" />
              Intelligence_Orchestra
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {agents.length === 0 ? (
                <div className="col-span-full py-8 border border-white/5 rounded-3xl flex flex-col items-center gap-3 opacity-30 grayscale">
                   <Cpu size={24} />
                   <p className="text-[9px] font-black uppercase tracking-widest">No active agents deployed</p>
                </div>
              ) : agents.map(agent => (
                <motion.div 
                  key={agent.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-vox-primary/30 transition-all group"
                >
                   <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        agent.status === 'executing' ? "bg-vox-primary animate-pulse shadow-[0_0_10px_#00F2FF]" : "bg-vox-success"
                      )} />
                      <span className="text-[8px] font-mono text-white/20">{agent.id}</span>
                   </div>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1 group-hover:text-vox-primary transition-colors">{agent.name}</h4>
                   <p className="text-[9px] font-black text-white/40 uppercase tracking-tighter mb-4">{agent.role}</p>
                   
                   <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                         <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Last_Action</span>
                         <p className="text-[8px] font-medium text-white/60 italic truncate max-w-[120px]">{agent.lastAction}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                         <Zap size={14} />
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Global Health Chart */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity size={14} className="text-vox-secondary" />
              Cognitive_Uptime_Telemetry
           </h3>
           <div className="h-[280px] w-full p-6 bg-white/[0.01] border border-white/5 rounded-[2.5rem] relative overflow-hidden backdrop-blur-md">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthHistory}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5DA9FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5DA9FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#5DA9FF" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-8 right-8 flex items-center gap-2 bg-vox-secondary/10 px-3 py-1 rounded-full border border-vox-secondary/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-vox-secondary animate-pulse" />
                 <span className="text-[8px] font-black text-vox-secondary uppercase tracking-widest">L7_Live_Feed</span>
              </div>
           </div>
        </div>

        {/* System Vitals Bento Icons */}
        <div className="grid grid-cols-2 gap-4 h-full">
           <div className="p-6 rounded-[2rem] bg-vox-primary/5 border border-vox-primary/10 flex flex-col justify-between aspect-square">
              <Database size={24} className="text-vox-primary" />
              <div>
                <span className="text-[18px] font-black">{systemVitals.storageUsed}</span>
                <p className="text-[8px] font-black text-vox-primary uppercase tracking-widest">Storage Used</p>
              </div>
           </div>
           <div className="p-6 rounded-[2rem] bg-vox-secondary/5 border border-vox-secondary/10 flex flex-col justify-between aspect-square">
              <Cloud size={24} className="text-vox-secondary" />
              <div>
                <span className="text-[18px] font-black">{systemVitals.networkOut}</span>
                <p className="text-[8px] font-black text-vox-secondary uppercase tracking-widest">Network Out</p>
              </div>
           </div>
           <div className="col-span-2 p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center">
                    <Shield size={20} className="text-vox-success" />
                 </div>
                 <div>
                    <span className="text-xs font-black uppercase tracking-widest">Zero Trust Active</span>
                    <p className="text-[8px] text-white/30 font-black uppercase">Level 9 Authorization Required</p>
                 </div>
              </div>
              <ChevronRight className="text-white/20" size={16} />
           </div>
        </div>

        {/* Workspace Quick-Access */}
        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Workspace_Nodes</h3>
           <div className="space-y-3">
              {workspaces.slice(0, 4).map(ws => (
                <div key={ws.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all flex items-center gap-3 group cursor-pointer">
                   <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:text-vox-primary transition-colors">
                      <Layers size={14} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h5 className="text-[10px] font-black text-white uppercase tracking-widest truncate">{ws.name}</h5>
                      <span className="text-[7px] text-white/30 uppercase font-black">{ws.nodes.length} Neural Nodes</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Sentient Background Interaction */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-vox-primary/10 rounded-full animate-[spin_60s_linear_infinite]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-vox-secondary/10 border-dashed rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      </div>
    </div>
  );
};
