import React, { useState } from 'react';
import { 
  Upload, 
  FileArchive, 
  FolderInput, 
  ArrowRightLeft, 
  Database, 
  Bell, 
  Cpu, 
  Search,
  Activity,
  Layers,
  Zap,
  Filter,
  Clock,
  Webhook,
  Send,
  Share2,
  MessageSquare,
  Globe,
  RefreshCw,
  FileText,
  SearchCode,
  Users,
  ShieldCheck,
  Braces,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
  Copy,
  Star
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';
import { getNodeDocumentation } from '../lib/docs';

const nodeIdList = [
  { group: 'Triggers', items: [
    { label: 'File Watcher', icon: 'Upload', type: 'Trigger' },
    { label: 'Cloud Event', icon: 'Activity', type: 'Trigger' },
    { label: 'Webhook In', icon: 'Webhook', type: 'Trigger' },
    { label: 'CADD Update', icon: 'Layers', type: 'Trigger' },
    { label: 'Form Entry', icon: 'FileText', type: 'Trigger' },
    { label: 'Cron Timer', icon: 'Clock', type: 'Trigger' },
  ]},
  { group: 'Communication', items: [
    { label: 'Slack Notify', icon: 'Message', type: 'Action' },
    { label: 'Discord Push', icon: 'Activity', type: 'Action' },
    { label: 'Teams Bridge', icon: 'Users', type: 'Action' },
    { label: 'Email SMTP', icon: 'Send', type: 'Action' },
    { label: 'WhatsApp API', icon: 'Globe', type: 'Action' },
  ]},
  { group: 'Engineering', items: [
    { label: 'CAD Archive', icon: 'Zip', type: 'Action' },
    { label: 'Layer Map', icon: 'Layers', type: 'Action' },
    { label: 'Plot Check', icon: 'FileText', type: 'Action' },
    { label: 'Revise Sync', icon: 'Refresh', type: 'Action' },
    { label: 'Sub-Workflow', icon: 'Workflow', type: 'Action' },
    { label: 'Human Approval', icon: 'ShieldCheck', type: 'Action' },
    { label: 'Logic Gate', icon: 'Scale', type: 'Action' },
    { label: 'Figma Hook', icon: 'Layout', type: 'Trigger' },
    { label: 'VoxCadd Sync', icon: 'Box', type: 'Trigger' },
    { label: 'Rhino Link', icon: 'Zap', type: 'Action' },
    { label: 'SolidWorks Ops', icon: 'Settings', type: 'Action' },
  ]},
  { group: 'Specialized AI', items: [
     { label: 'AI Trigger', icon: 'Sparkles', type: 'Trigger', description: 'Natural language defined trigger' },
     { label: 'Figma Parser', icon: 'LayoutTemplate', type: 'Action' },
     { label: 'CAD Archival', icon: 'Archive', type: 'Action' },
  ]},
  { group: 'Data & Logic', items: [
    { label: 'Filter Data', icon: 'Filter', type: 'Action' },
    { label: 'JSON Map', icon: 'Braces', type: 'Action' },
    { label: 'Delay (5s)', icon: 'Clock', type: 'Action' },
    { label: 'Security Gate', icon: 'ShieldCheck', type: 'Action' },
    { label: 'Process Data', icon: 'Database', type: 'Action' },
  ]},
  { group: 'AI & Automation', items: [
    { label: 'AI Classify', icon: 'AI', type: 'Action' },
    { label: 'Auto Summarize', icon: 'FileText', type: 'Action' },
    { label: 'Vector Index', icon: 'Search', type: 'Action' },
    { label: 'Agent Hub', icon: 'Cpu', type: 'Action' },
  ]},
  { group: 'Autonomous Agents', items: [
    { label: 'Archive Agent', icon: 'Store', type: 'Action' },
    { label: 'Coord Agent', icon: 'Clock', type: 'Action' },
    { label: 'CAD Agent', icon: 'Layers', type: 'Action' },
    { label: 'Guardian', icon: 'ShieldCheck', type: 'Action' },
  ]}
];

const templates = [
  { 
    name: 'AI Studio & GitHub Sync', 
    nodes: [
      { id: 't1', type: 'trigger', data: { label: 'Google AI Studio', icon: 'AI' }, position: { x: 50, y: 150 } },
      { id: 'a1', type: 'action', data: { label: 'Backup GitHub', icon: 'Zip' }, position: { x: 300, y: 150 } },
      { id: 'a2', type: 'action', data: { label: 'Connectivity Check', icon: 'Globe' }, position: { x: 550, y: 150 } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'a1', animated: true, type: 'neural' },
      { id: 'e2', source: 'a1', target: 'a2', animated: true, type: 'neural' }
    ]
  },
  { 
    name: 'CAD Approval Pipeline', 
    nodes: [
      { id: 't1', type: 'trigger', data: { label: 'Junior Upload', icon: 'Upload' }, position: { x: 50, y: 150 } },
      { id: 'a1', type: 'action', data: { label: 'Senior Review', icon: 'Search' }, position: { x: 300, y: 150 } },
      { id: 'a2', type: 'action', data: { label: 'Principal Approval', icon: 'ShieldCheck' }, position: { x: 550, y: 150 } },
      { id: 'a3', type: 'action', data: { label: 'Notify Consultant', icon: 'Send' }, position: { x: 800, y: 150 } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'a1', animated: true, type: 'neural' },
      { id: 'e2', source: 'a1', target: 'a2', animated: true, type: 'neural' },
      { id: 'e3', source: 'a2', target: 'a3', animated: true, type: 'neural' }
    ]
  },
  { 
    name: 'Site Coordination Sync', 
    nodes: [
      { id: 't1', type: 'trigger', data: { label: 'Weekly Update', icon: 'Clock' }, position: { x: 50, y: 150 } },
      { id: 'a1', type: 'action', data: { label: 'Fetch Site Logs', icon: 'Database' }, position: { x: 300, y: 150 } },
      { id: 'a2', type: 'action', data: { label: 'Teams Sync', icon: 'Users' }, position: { x: 550, y: 150 } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'a1', animated: true, type: 'neural' },
      { id: 'e2', source: 'a1', target: 'a2', animated: true, type: 'neural' }
    ]
  },
  { 
    name: 'CAD Intelligence Mesh', 
    nodes: [
      { id: 't1', type: 'trigger', data: { label: 'CADD Update', icon: 'Layers' }, position: { x: 50, y: 150 } },
      { id: 'a1', type: 'action', data: { label: 'Layer Map', icon: 'Layers' }, position: { x: 300, y: 150 } },
      { id: 'a2', type: 'action', data: { label: 'AI Classify', icon: 'AI' }, position: { x: 550, y: 150 } },
      { id: 'a3', type: 'action', data: { label: 'CAD Archive', icon: 'Zip' }, position: { x: 800, y: 150 } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'a1', animated: true, type: 'neural' },
      { id: 'e2', source: 'a1', target: 'a2', animated: true, type: 'neural' },
      { id: 'e3', source: 'a2', target: 'a3', animated: true, type: 'neural' }
    ]
  },
  { 
    name: 'Ops Monitoring Core', 
    nodes: [
      { id: 't1', type: 'trigger', data: { label: 'Cloud Event', icon: 'Activity' }, position: { x: 50, y: 300 } },
      { id: 'a1', type: 'action', data: { label: 'Security Gate', icon: 'ShieldCheck' }, position: { x: 300, y: 300 } },
      { id: 'a2', type: 'action', data: { label: 'Slack Notify', icon: 'Message' }, position: { x: 550, y: 300 } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'a1', animated: true, type: 'neural' },
      { id: 'e2', source: 'a1', target: 'a2', animated: true, type: 'neural' }
    ]
  }
];

const iconSidebarMap = {
  Upload: Upload,
  Zip: FileArchive,
  Extract: FolderInput,
  Transfer: ArrowRightLeft,
  Store: Database,
  Notify: Bell,
  AI: Cpu,
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
  Braces: Braces,
  Workflow: Zap // Or find a better one from Lucide-react if needed, for now Zap is placeholder or I'll use Layers
};

export const Sidebar = ({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) => {
  const [search, setSearch] = useState('');
  const [vaultSearch, setVaultSearch] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  
  const { 
    setNodes, 
    setEdges, 
    nodes,
    edges,
    workspaces, 
    currentWorkspaceId, 
    switchWorkspace, 
    deleteWorkspace,
    addWorkspace,
    addTemplate,
    agents,
    updateAgent,
    toggleFavoriteWorkspace,
    duplicateWorkspace,
    searchQuery,
    setSearchQuery
  } = useWorkflowStore();

  const handleCreateTemplate = () => {
    const name = prompt('Blueprint Identifier:');
    if (name) {
      addTemplate({ name, nodes, edges });
      alert('Neural Blueprint Archived to Vault');
    }
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setNodes(template.nodes as any);
    setEdges(template.edges as any);
  };

  const filteredNodeList = nodeIdList.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.icon.toLowerCase().includes(search.toLowerCase()) ||
      group.group.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const onDragStart = (event: React.DragEvent, nodeData: any) => {
    // Specifically for React Flow drag-and-drop
    event.dataTransfer.setData('application/reactflow', nodeData.type);
    event.dataTransfer.setData('application/label', nodeData.label);
    event.dataTransfer.setData('application/icon', nodeData.icon);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = (nodeData: any) => {
    const { addNode } = useWorkflowStore.getState();
    const id = `${nodeData.type.toLowerCase()}_${Date.now()}`;
    const position = { x: 400 + (Math.random() - 0.5) * 100, y: 300 + (Math.random() - 0.5) * 100 };
    
    addNode({
      id,
      type: nodeData.type.toLowerCase(),
      data: { 
        label: nodeData.label, 
        icon: nodeData.icon,
        documentation: getNodeDocumentation(nodeData.label)
      },
      position,
    });
  };

  return (
    <aside className="w-full h-full bg-vox-bg/20 flex flex-col z-10 overflow-hidden">
      {/* Top Header / Toggle */}
      <div className={cn(
        "p-4 border-b border-vox-border flex items-center transition-all bg-black/20",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Engine Forge</span>
            <div className="flex items-center gap-2">
               <span className="w-1 h-1 rounded-full bg-vox-primary animate-ping" />
               <span className="text-[7px] font-black text-vox-primary/50 uppercase tracking-[0.2em]">Operational Library • ACTIVE</span>
            </div>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="p-2 rounded-lg bg-white/5 hover:bg-vox-primary/10 text-white/40 hover:text-vox-primary transition-all active:scale-90"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-b border-vox-border grid grid-cols-3 gap-2 bg-black/40">
           {[
             { id: 'canvas', icon: Layers, label: 'Build' },
             { id: 'dashboard', icon: Activity, label: 'Ops' },
             { id: 'neural', icon: SearchCode, label: 'Map' },
             { id: 'mission', icon: Zap, label: 'Live' },
             { id: 'governance', icon: ShieldCheck, label: 'Gov' },
             { id: 'advisor', icon: Cpu, label: 'Intel AI' }
           ].map((nav) => (
             <button
               key={nav.id}
               onClick={() => useWorkflowStore.getState().setViewMode(nav.id as any)}
               className={cn(
                 "flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all group",
                 useWorkflowStore.getState().viewMode === nav.id
                   ? "bg-vox-primary/10 border-vox-primary/40 text-vox-primary shadow-[0_4px_15px_rgba(0,229,255,0.1)]"
                   : "bg-white/[0.02] border-white/5 hover:border-white/20 text-white/30 hover:text-white"
               )}
             >
               <nav.icon size={12} className={cn(useWorkflowStore.getState().viewMode === nav.id && "animate-pulse")} />
               <span className="text-[7px] font-black uppercase tracking-widest">{nav.label}</span>
             </button>
           ))}
        </div>
      )}

      {!isCollapsed && (
        <div className="px-4 pb-2 pt-1.5 bg-vox-primary/5 border-b border-vox-primary/20 flex flex-col gap-1.5"><button onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-architect', { detail: { open: true } }))} className="w-full py-2 rounded-xl border border-vox-secondary/30 bg-vox-secondary/10 hover:bg-vox-secondary/25 text-vox-secondary hover:text-white transition-all duration-350 flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(112,0,255,0.1)] hover:shadow-[0_0_20px_rgba(112,0,255,0.25)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer" id="sidebar-ai-architect-btn"><Sparkles size={11} className="animate-pulse text-vox-secondary group-hover:text-white" /><span className="text-[8.5px] font-black uppercase tracking-[0.25em]">AI Architect Prompt</span></button>
           <div className="flex items-center gap-2 overflow-hidden">
              <Activity size={10} className="text-vox-primary shrink-0 animate-pulse" />
              <marquee className="text-[8px] font-black text-vox-primary/60 uppercase tracking-widest whitespace-nowrap italic pointer-events-none">
                 NEURAL MESH SYNCHRONIZED • ALL SYSTEMS NOMINAL • DATA SOVEREIGNTY PROTOCOL ACTIVE • [DEPT: ARCHITECTURE] • UPTIME: 99.987% • STANDBY FOR NEW INSTRUCTIONS...
              </marquee>
           </div>
        </div>
      )}

      {!isCollapsed && (
        <div className="p-4 border-b border-vox-border bg-white/[0.02] space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={12} />
            <input 
              type="text" 
              placeholder="Search components..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-vox-border rounded-lg py-2.5 pl-9 pr-4 text-[10px] text-white focus:outline-none focus:border-vox-primary/50 transition-all placeholder:text-white/30 uppercase font-black tracking-widest shadow-inner sm:text-xs"
            />
          </div>
          <div className="relative">
            <SearchCode className="absolute left-3 top-1/2 -translate-y-1/2 text-vox-primary/55" size={12} />
            <input 
              type="text" 
              placeholder="Search canvas nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-vox-border/50 rounded-lg py-2.5 pl-9 pr-4 text-[10px] text-vox-primary focus:outline-none focus:border-vox-primary/50 transition-all placeholder:text-vox-primary/30 uppercase font-black tracking-widest shadow-inner sm:text-xs"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-8 pb-20">
        {/* Saved Workflows (The Vault) */}
        {!isCollapsed && search === '' && (
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[9px] font-black text-vox-primary uppercase tracking-[0.3em]">Workflow Vault</h3>
                <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Persistence Layer</span>
             </div>

             {/* Vault search and filter bar */}
             <div className="flex gap-1.5 px-0.5">
               <div className="relative flex-1">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" size={10} />
                 <input 
                   type="text" 
                   value={vaultSearch}
                   onChange={(e) => setVaultSearch(e.target.value)}
                   placeholder="Search vault..."
                   className="w-full bg-black/40 border border-vox-border/50 rounded-lg py-1.5 pl-7 pr-2 text-[9px] font-medium text-white focus:outline-none focus:border-vox-primary/40 transition-all placeholder:text-white/20 uppercase tracking-wider"
                 />
               </div>
               <button 
                 onClick={() => setOnlyFavorites(!onlyFavorites)}
                 className={cn(
                   "p-1.5 rounded-lg border transition-all flex items-center justify-center shrink-0",
                   onlyFavorites 
                     ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400" 
                     : "bg-black/40 border-vox-border/50 text-white/40 hover:text-white"
                 )}
                 title={onlyFavorites ? "Show all" : "Show only favorites"}
               >
                 <Star size={10} className={onlyFavorites ? "fill-yellow-400" : ""} />
               </button>
             </div>

             <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar">
                {workspaces.filter(ws => {
                  const matchesSearch = ws.name.toLowerCase().includes(vaultSearch.toLowerCase());
                  const matchesFavorite = !onlyFavorites || !ws || !!ws.isFavorite;
                  return matchesSearch && matchesFavorite;
                }).map(ws => {
                  const isCurrent = currentWorkspaceId === ws.id;
                  return (
                    <div key={ws.id} className="group relative">
                      <button 
                        onClick={() => switchWorkspace(ws.id)}
                        className={cn(
                          "w-full p-2 flex items-center gap-2 rounded-xl border transition-all text-left overflow-hidden pr-20",
                          isCurrent 
                            ? "bg-vox-primary/10 border-vox-primary/30 shadow-[0_0_10px_rgba(0,229,255,0.05)]" 
                            : "bg-white/[0.01] border-white/5 hover:border-white/15 hover:bg-white/[0.03]"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded flex items-center justify-center transition-all shrink-0",
                          isCurrent ? "bg-vox-primary text-vox-bg" : "bg-white/10 text-white/60 group-hover:text-vox-primary"
                        )}>
                          <Database size={10} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest truncate",
                            isCurrent ? "text-white" : "text-white/80"
                          )}>{ws.name}</span>
                          <span className="text-[6.5px] font-black text-white/30 uppercase tracking-tighter italic">Modified: {new Date(ws.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </button>

                      {/* Floating actions container */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/95 p-0.5 rounded border border-white/5 shadow-md">
                        {/* Favorite button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteWorkspace(ws.id);
                          }}
                          className={cn(
                            "p-1 rounded transition-all",
                            ws.isFavorite 
                              ? "text-yellow-400" 
                              : "text-white/40 hover:text-yellow-400"
                          )}
                          title={ws.isFavorite ? "Unfavorite" : "Favorite"}
                        >
                          <Star size={9} className={ws.isFavorite ? "fill-yellow-400" : ""} />
                        </button>

                        {/* Duplicate button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateWorkspace(ws.id);
                          }}
                          className="p-1 rounded text-white/40 hover:text-vox-primary transition-all"
                          title="Duplicate"
                        >
                          <Copy size={9} />
                        </button>

                        {/* Delete button */}
                        {workspaces.length > 1 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Decommission "${ws.name}"?`)) {
                                deleteWorkspace(ws.id);
                              }
                            }}
                            className="p-1 rounded text-white/40 hover:text-red-400 transition-all"
                            title="Decommission"
                          >
                            <Trash2 size={9} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {workspaces.filter(ws => {
                  const matchesSearch = ws.name.toLowerCase().includes(vaultSearch.toLowerCase());
                  const matchesFavorite = !onlyFavorites || !ws || !!ws.isFavorite;
                  return matchesSearch && matchesFavorite;
                }).length === 0 && (
                  <div className="text-center py-4 border border-dashed border-white/5 rounded-xl bg-black/10">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">No workflows found</span>
                  </div>
                )}
             </div>
             <button 
              onClick={() => {
                const name = prompt('Enter Workflow Name:');
                if (name) addWorkspace(name);
              }}
              className="w-full py-2 rounded-xl border border-dashed border-white/10 hover:border-vox-primary/40 hover:bg-vox-primary/5 text-[9px] font-black text-white/30 hover:text-vox-primary transition-all uppercase tracking-[0.2em]"
             >
                + Initialize New Workflow
             </button>
          </div>
        )}

        {/* Templates Rail */}
        {!isCollapsed && search === '' && (
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] italic">Enterprise Blueprints</h3>
                <button 
                  onClick={handleCreateTemplate}
                  className="p-1 rounded-md bg-vox-primary/10 border border-vox-primary/20 text-vox-primary hover:bg-vox-primary hover:text-vox-bg transition-all"
                  title="Archive Current Pattern"
                >
                  <Share2 size={10} />
                </button>
             </div>
            <div className="space-y-1">
              {templates.map(t => (
                <button 
                  key={t.name}
                  onClick={() => applyTemplate(t)}
                  className="w-full group p-2.5 flex items-center gap-3 rounded-lg bg-white/[0.02] border border-transparent hover:border-vox-primary/20 hover:bg-vox-primary/5 transition-all text-left"
                >
                  <div className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-white/50 group-hover:text-vox-primary transition-all">
                    <Zap size={12} />
                  </div>
                  <span className="text-[9px] font-black text-white/70 group-hover:text-white uppercase tracking-widest truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Agent Configuration (New Section) */}
        {!isCollapsed && (
          <div className="space-y-4 pt-4 border-t border-white/5">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[9px] font-black text-vox-primary uppercase tracking-[0.3em]">Agent Sync</h3>
                <span className="text-[7px] font-mono text-white/20">CONFIG_MODE</span>
             </div>
             <div className="space-y-4">
                {agents.map(agent => (
                  <div key={agent.id} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-vox-primary h-px bg-vox-primary/20 flex-1" />
                        <span className="text-[7px] font-mono text-white/30 uppercase">{agent.id}</span>
                     </div>
                     <div className="space-y-2">
                        <input 
                          type="text" 
                          value={agent.name}
                          onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 px-3 text-[9px] font-black text-white focus:border-vox-primary/40 transition-all uppercase"
                          placeholder="Agent Name"
                        />
                        <input 
                          type="text" 
                          value={agent.role}
                          onChange={(e) => updateAgent(agent.id, { role: e.target.value })}
                          className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 px-3 text-[9px] font-black text-white/40 focus:border-vox-primary/40 transition-all uppercase"
                          placeholder="Agent Role"
                        />
                     </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const name = prompt('Neural Agent Identity:');
                    if (name) {
                      const { addAgent } = useWorkflowStore.getState();
                      addAgent({
                        id: `agent-${Date.now()}`,
                        name,
                        role: 'General Purpose Intelligence',
                        status: 'idle',
                        lastAction: 'Awaiting deployment...'
                      });
                    }
                  }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-vox-primary/20 hover:border-vox-primary hover:bg-vox-primary/5 text-[8px] font-black text-vox-primary/40 hover:text-vox-primary transition-all uppercase tracking-[0.2em]"
                >
                  + Initialize Intelligence Node
                </button>
             </div>
          </div>
        )}

        {/* Node Groups */}
        {filteredNodeList.map((group) => (
          <div key={group.group} className="space-y-3">
            {!isCollapsed && (
              <h3 className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] px-1">{group.group}</h3>
            )}
            
            <div className={cn(
              "grid gap-2",
              isCollapsed ? "grid-cols-1" : "grid-cols-2"
            )}>
              {group.items.map((node) => {
                const Icon = iconSidebarMap[node.icon as keyof typeof iconSidebarMap] || Activity;
                return (
                  <div
                    key={node.label}
                    draggable
                    onDragStart={(e) => onDragStart(e, node)}
                    onClick={() => handleNodeClick(node)}
                    className={cn(
                      "group flex items-center justify-center rounded-xl border border-vox-border bg-vox-panel/40 hover:bg-vox-primary/5 hover:border-vox-primary/30 cursor-grab active:cursor-grabbing transition-all duration-300 relative",
                      isCollapsed ? "p-3" : "flex-col p-4 gap-2 h-20"
                    )}
                    title={isCollapsed ? node.label : undefined}
                  >
                    <div className={cn(
                      "rounded-lg flex items-center justify-center transition-all group-hover:scale-110",
                      isCollapsed ? "w-8 h-8 bg-white/10 text-white/60 group-hover:text-vox-primary" : "w-10 h-10 bg-white/10 text-white/40 group-hover:text-vox-primary"
                    )}>
                      <Icon size={isCollapsed ? 14 : 18} />
                    </div>
                    {!isCollapsed && (
                      <span className="text-[8px] text-white/60 group-hover:text-white transition-colors font-black uppercase tracking-[0.1em] text-center leading-none">
                        {node.label}
                      </span>
                    )}
                    
                    {/* Hover Glow Particle (Atmospheric) */}
                    <div className="absolute inset-0 bg-vox-primary/0 group-hover:bg-vox-primary/5 transition-all -z-10 blur-xl opacity-0 group-hover:opacity-100" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
