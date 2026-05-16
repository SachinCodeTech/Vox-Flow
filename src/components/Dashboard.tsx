import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Users, 
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  LayoutDashboard,
  Briefcase,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useWorkflowStore } from '../store/useWorkflowStore';

const MetricCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8 rounded-[3rem] bg-vox-panel/40 backdrop-blur-2xl border border-vox-border relative overflow-hidden group"
  >
    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 transition-opacity group-hover:opacity-20", color)} />
    <div className="flex justify-between items-start mb-6">
      <div className={cn("p-4 rounded-2xl bg-white/5 border border-vox-border text-white/40 group-hover:text-vox-primary transition-all")}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1.5 text-[10px] font-black text-vox-success bg-vox-success/10 px-3 py-1 rounded-full border border-vox-success/20">
          <TrendingUp size={12} /> {trend}%
        </span>
      )}
    </div>
    <div className="space-y-2">
      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter italic font-display">{value}</span>
        <span className="text-[10px] font-black text-vox-primary uppercase tracking-[0.2em]">{unit}</span>
      </div>
    </div>
    {/* Decorative Scanning line */}
    <motion.div 
      animate={{ y: [0, 160, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute inset-x-0 h-px bg-vox-primary/5 pointer-events-none"
    />
  </motion.div>
);

const ConfidenceRing = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center gap-4 p-8 rounded-[3rem] bg-vox-panel/20 border border-vox-border">
     <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
           <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
           <motion.circle 
              cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" 
              fill="transparent" className="text-vox-primary"
              strokeDasharray="377" 
              initial={{ strokeDashoffset: 377 }}
              animate={{ strokeDashoffset: 377 - (377 * value) / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
           />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-3xl font-black text-white font-display tracking-tighter">{value}%</span>
           <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Confidence</span>
        </div>
        {/* Animated Particles orbiting ring */}
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 flex items-center justify-center"
        >
           <div className="w-1.5 h-1.5 rounded-full bg-vox-primary blur-[2px] -translate-y-16" />
        </motion.div>
     </div>
     <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] text-center">{label}</span>
  </div>
);

const AIInsightsPanel = () => {
  const { aiInsights } = useWorkflowStore();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
          <Lightbulb size={14} className="text-vox-secondary" />
          Cognitive Insights
        </h2>
        <span className="text-[9px] font-black text-vox-secondary bg-vox-secondary/10 px-2 py-0.5 rounded border border-vox-secondary/20 uppercase tracking-widest">AOC_ACTIVE</span>
      </div>
      
      <div className="space-y-3">
        {aiInsights.length === 0 ? (
          <div className="p-12 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col items-center gap-4 text-center">
            <Cpu className="text-white/10 animate-pulse" size={32} />
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Synthesizing operational patterns...</p>
          </div>
        ) : (
          aiInsights.map((insight, i) => (
            <motion.div 
              key={insight.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl bg-white/5",
                  insight.type === 'risk' ? "text-red-400" : insight.type === 'optimization' ? "text-vox-primary" : "text-vox-secondary"
                )}>
                  {insight.type === 'risk' ? <AlertCircle size={16} /> : insight.type === 'optimization' ? <Zap size={16} /> : <Cpu size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{insight.title}</h4>
                    <span className={cn(
                      "text-[8px] font-black px-2 py-0.5 rounded border uppercase",
                      insight.impact === 'high' ? "text-red-400 border-red-400/20 bg-red-400/10" : "text-white/40 border-white/10 bg-white/5"
                    )}>{insight.impact} IMPACT</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-tight">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const AgentEcosystem = () => {
  const { agents } = useWorkflowStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
          <Users size={14} className="text-vox-primary" />
          Agent Ecosystem
        </h2>
        <span className="text-[9px] font-black text-vox-primary bg-vox-primary/10 px-2 py-0.5 rounded border border-vox-primary/20 uppercase tracking-widest">ORCHESTRATING</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent, i) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-vox-primary/30 transition-all group relative overflow-hidden"
          >
             <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  agent.status === 'executing' ? "bg-vox-primary text-vox-bg animate-pulse" : "bg-white/5 text-white/20"
                )}>
                  <Cpu size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{agent.name}</h4>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{agent.role}</p>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  agent.status === 'idle' ? "bg-white/10" : 
                  agent.status === 'executing' ? "bg-vox-primary shadow-[0_0_10px_rgba(0,242,255,0.5)]" : "bg-vox-secondary"
                )} />
             </div>
             <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 italic">Last Action:</p>
                <p className="text-[10px] text-vox-primary font-bold uppercase truncate tracking-tight">{agent.lastAction}</p>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ActivityLog = () => {
  const { runtimeJobs, workspaces } = useWorkflowStore();
  
  const displayJobs = runtimeJobs.length > 0 ? runtimeJobs.slice(0, 5) : [
    { id: '1', workspaceId: 'arch-dept-001', status: 'success', timestamp: new Date().toISOString(), nodeId: 'Syncing CAD Repo' },
    { id: '2', workspaceId: 'arch-dept-001', status: 'running', timestamp: new Date().toISOString(), nodeId: 'AI Analysis' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
          <Activity size={12} className="text-vox-primary" />
          Runtime Feed
        </h2>
      </div>
      <div className="space-y-2">
        {displayJobs.map((job: any, i) => {
          const ws = workspaces.find(w => w.id === job.workspaceId);
          return (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex items-center gap-4"
            >
              <div className={cn(
                "w-1 h-1 rounded-full",
                job.status === 'running' ? "bg-vox-secondary animate-pulse" : "bg-vox-primary"
              )} />
              <div className="flex-1">
                <p className="text-[10px] text-white/50">
                  <span className="text-white/20 uppercase text-[8px] font-bold mr-2">[{ws?.name || 'System'}]</span>
                  <span className="text-white/80">{job.nodeId || 'Op'}</span>
                </p>
              </div>
              <span className="text-[8px] font-bold text-white/10 uppercase">{new Date(job.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { setViewMode, workspaces, currentWorkspaceId } = useWorkflowStore();
  const currentWs = workspaces.find(w => w.id === currentWorkspaceId);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 lg:p-12 space-y-12 pb-48 sm:pb-28">
      {/* Executive Intelligence Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-vox-primary">
            <LayoutDashboard size={16} className="sm:w-5 sm:h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] leading-none mb-1">Autonomous Intelligence HUD</span>
            <div className="h-4 w-px bg-vox-border hidden sm:block" />
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] hidden sm:block">Enterprise Node v4.0</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter italic uppercase leading-[0.8] font-display">
            Central <br className="sm:hidden" /><span className="text-vox-primary">Command</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setViewMode('neural')}
            className="px-8 py-4 rounded-full bg-vox-primary text-vox-bg text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <Globe size={16} /> Deploy Neural Map
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="System Confidence" value="98.2" unit="%" icon={Cpu} color="bg-vox-primary" trend={2.4} />
        <MetricCard title="Vault Integrity" value="0.99" unit="SAFE" icon={ShieldCheck} color="bg-vox-secondary" />
        <MetricCard title="Neural Mesh" value={workspaces.length} unit="NODES" icon={Briefcase} color="bg-vox-primary" />
        <MetricCard title="Throughput" value="1.4M" unit="SYN" icon={Zap} color="bg-vox-success" />
      </div>

      {/* Cognitive Layer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <ConfidenceRing value={94} label="Strategic Alignment" />
         <ConfidenceRing value={87} label="Market Prediction" />
         <ConfidenceRing value={99} label="Security Readiness" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Intelligence Feed */}
        <div className="lg:col-span-2 space-y-12">
          <AgentEcosystem />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                    <Briefcase size={14} className="text-vox-primary" />
                    Operational Units
                  </h2>
                </div>
                <div className="space-y-3">
                  {workspaces.map(ws => (
                    <motion.div key={ws.id} className="p-4 rounded-3xl bg-white/[0.01] border border-white/[0.05] hover:border-vox-primary/30 transition-all flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-vox-primary group-hover:bg-vox-primary/10 transition-all">
                             <Activity size={14} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black text-white tracking-widest uppercase">{ws.name}</h4>
                            <p className="text-[8px] font-black text-white/20 uppercase">{ws.nodes.length} Active Pipelines</p>
                          </div>
                       </div>
                       <div className="w-1.5 h-1.5 rounded-full bg-vox-primary shadow-[0_0_10px_rgba(0,242,255,0.4)]" />
                    </motion.div>
                  ))}
                </div>
             </div>
             <ActivityLog />
          </div>
        </div>

        {/* Cognitive Layer Sidebar */}
        <div className="space-y-8">
          <AIInsightsPanel />
          
          <div className="p-8 rounded-[3rem] bg-emerald-500/[0.02] border border-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.05)] space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Guardian Protocol v4</span>
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed uppercase font-black tracking-widest italic">
              Autonomous security layer active. All inter-departmental synapses are link-encrypted with zero-trust validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
