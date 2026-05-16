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
  ChevronRight
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';

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
  ]},
  { group: 'Data & Logic', items: [
    { label: 'Filter Data', icon: 'Filter', type: 'Action' },
    { label: 'JSON Map', icon: 'Braces', type: 'Action' },
    { label: 'Delay (5s)', icon: 'Clock', type: 'Action' },
    { label: 'Security Gate', icon: 'ShieldCheck', type: 'Action' },
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
    name: 'CAD Archival', 
    nodes: [
      { id: 't1', type: 'trigger', data: { label: 'CADD Update', icon: 'Layers' }, position: { x: 100, y: 100 } },
      { id: 'a1', type: 'action', data: { label: 'CAD Archive', icon: 'Zip' }, position: { x: 350, y: 100 } },
      { id: 'a2', type: 'action', data: { label: 'VoxDrive Sync', icon: 'Transfer' }, position: { x: 600, y: 100 } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'a1', animated: true },
      { id: 'e2', source: 'a1', target: 'a2', animated: true }
    ]
  },
  { 
    name: 'Team Alert', 
    nodes: [
      { id: 't1', type: 'trigger', data: { label: 'Form Entry', icon: 'FileText' }, position: { x: 100, y: 100 } },
      { id: 'a1', type: 'action', data: { label: 'Slack Notify', icon: 'Message' }, position: { x: 350, y: 100 } }
    ],
    edges: [{ id: 'e1', source: 't1', target: 'a1', animated: true }]
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
  Braces: Braces
};

export const Sidebar = ({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) => {
  const [search, setSearch] = useState('');
  
  const { 
    setNodes, 
    setEdges, 
  } = useWorkflowStore();

  const applyTemplate = (template: typeof templates[0]) => {
    setNodes(template.nodes as any);
    setEdges(template.edges as any);
  };

  const filteredNodeList = nodeIdList.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const onDragStart = (event: React.DragEvent, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', nodeData.type);
    event.dataTransfer.setData('application/label', nodeData.label);
    event.dataTransfer.setData('application/icon', nodeData.icon);
    event.dataTransfer.dropEffect = 'move';
  };

  const handleNodeClick = (nodeData: any) => {
    const { addNode } = useWorkflowStore.getState();
    const id = `${nodeData.type.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`;
    const position = { x: 400 + (Math.random() - 0.5) * 100, y: 300 + (Math.random() - 0.5) * 100 };
    
    addNode({
      id,
      type: nodeData.type.toLowerCase(),
      data: { label: nodeData.label, icon: nodeData.icon },
      position,
    });
  };

  return (
    <aside className="w-full h-full bg-[#050816] flex flex-col z-10 overflow-hidden border-r border-vox-border shadow-[40px_0_100px_rgba(0,0,0,0.5)]">
      {/* Top Header / Toggle */}
      <div className={cn(
        "p-6 border-b border-vox-border flex items-center transition-all bg-white/[0.01]",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic font-display">Engine Forge</span>
            <span className="text-[8px] font-black text-vox-primary/40 uppercase tracking-[0.2em]">Sovereign_OS Library</span>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="p-3 rounded-2xl bg-white/5 hover:bg-vox-primary/20 text-white/40 hover:text-vox-primary transition-all shadow-xl"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-6 border-b border-vox-border bg-white/[0.02]">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-vox-primary transition-colors" size={12} />
            <input 
              type="text" 
              placeholder="SEARCH_MODULE..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/60 border border-vox-border rounded-xl py-3 pl-10 pr-4 text-[9px] text-white focus:outline-none focus:border-vox-primary/40 focus:ring-1 focus:ring-vox-primary/20 transition-all placeholder:text-white/10 uppercase font-black tracking-[0.2em]"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 pb-32">
        {/* Templates Rail */}
        {!isCollapsed && search === '' && (
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-2 italic">Neural_Blueprints</h3>
            <div className="grid grid-cols-1 gap-2">
              {templates.map(t => (
                <button 
                  key={t.name}
                  onClick={() => applyTemplate(t)}
                  className="w-full group p-4 flex items-center gap-4 rounded-2xl bg-white/[0.01] border border-transparent hover:border-vox-primary/30 hover:bg-vox-primary/10 transition-all text-left shadow-lg overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-vox-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-white/20 group-hover:text-vox-primary group-hover:scale-110 transition-all relative z-10 border border-white/5">
                    <Zap size={16} className="text-glow" />
                  </div>
                  <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em] truncate relative z-10 italic">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Node Groups */}
        {filteredNodeList.map((group) => (
          <div key={group.group} className="space-y-4">
            {!isCollapsed && (
              <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] px-2 italic">{group.group}</h3>
            )}
            
            <div className={cn(
              "grid gap-3",
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
                      "group flex items-center justify-center rounded-[1.5rem] border border-vox-border bg-vox-panel/40 backdrop-blur-md hover:bg-vox-primary/10 hover:border-vox-primary/40 cursor-grab active:cursor-grabbing transition-all duration-500 relative overflow-hidden shadow-xl",
                      isCollapsed ? "p-4" : "flex-col p-6 gap-3 h-24"
                    )}
                    title={isCollapsed ? node.label : undefined}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-vox-primary/[0.02] to-transparent pointer-events-none" />
                    <div className={cn(
                      "rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]",
                      isCollapsed ? "w-10 h-10 bg-white/5 text-white/30 group-hover:text-vox-primary" : "w-12 h-12 bg-white/5 text-white/20 group-hover:text-vox-primary"
                    )}>
                      <Icon size={isCollapsed ? 18 : 22} />
                    </div>
                    {!isCollapsed && (
                      <span className="text-[9px] text-white/30 group-hover:text-white transition-colors font-black uppercase tracking-[0.1em] text-center leading-[1.1]">
                        {node.label}
                      </span>
                    )}
                    
                    {/* Atmospheric Glow */}
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-vox-primary/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
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
