import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  ChevronDown, 
  Zap, 
  Globe, 
  Shield, 
  Info, 
  HelpCircle, 
  RefreshCw,
  FilePlus, 
  Save, 
  LogOut, 
  Undo2, 
  Redo2, 
  Trash2, 
  Layers, 
  Play, 
  Settings2, 
  LayoutDashboard, 
  Compass, 
  Database as DbIcon,
  Columns,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useWorkflowStore } from '../store/useWorkflowStore';

interface HeaderProps {
  currentWorkspace: string;
  onSwitchWorkspace: (id: string) => void;
  workspaces: any[];
  onSetViewMode: (mode: string) => void;
  viewMode: string;
}

export const Header = ({ 
  currentWorkspace, 
  onSwitchWorkspace, 
  workspaces, 
  onSetViewMode, 
  viewMode,
}: HeaderProps) => {
  const { 
    executeSequence, 
    isExecuting, 
    logout, 
    currentUser,
    undo,
    redo,
    resetWorkflow,
    saveWorkflow,
    toggleExecutionMode,
    isExecutionMode,
    isSplitLayout,
    toggleSplitLayout,
    updateWorkspaceName,
    deferredPrompt,
    setDeferredPrompt
  } = useWorkflowStore();

  const [time, setTime] = React.useState(new Date());
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState('');

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for clicks outside dropdown to close it
  React.useEffect(() => {
    if (!activeDropdown) return;
    const clickAway = () => setActiveDropdown(null);
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [activeDropdown]);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const menuItems: Record<string, { label: string; icon: any; action: () => void; shortcut?: string }[]> = {
    File: [
      { 
        label: 'New Workflow', 
        icon: FilePlus, 
        action: () => {
          if (confirm('Clear current workspace and launch a new core sequence?')) {
            resetWorkflow();
            onSetViewMode('canvas');
          }
        },
        shortcut: 'Ctrl+N'
      },
      { 
        label: 'Save Snapshot', 
        icon: Save, 
        action: () => {
          saveWorkflow();
          alert('System state snapshotted successfully.');
        },
        shortcut: 'Ctrl+S'
      },
      { 
        label: 'Exit / Decommission', 
        icon: LogOut, 
        action: () => {
          if (confirm('Decommission active operational link and terminate session?')) {
            logout();
          }
        }
      }
    ],
    Edit: [
      { 
        label: 'Undo Action', 
        icon: Undo2, 
        action: () => undo(),
        shortcut: 'Ctrl+Z'
      },
      { 
        label: 'Redo Action', 
        icon: Redo2, 
        action: () => redo(),
        shortcut: 'Ctrl+Y'
      },
      { 
        label: 'Clear Workspace', 
        icon: Trash2, 
        action: () => {
          if (confirm('Decommission all nodes from the active canvas?')) {
            resetWorkflow();
          }
        }
      }
    ],
    Kernel: [
      { 
        label: 'Pulse (Execute)', 
        icon: Play, 
        action: () => {
          executeSequence();
        },
        shortcut: 'PULSE'
      },
      { 
        label: 'Toggle Draft Mode', 
        icon: Settings2, 
        action: () => toggleExecutionMode(),
        shortcut: isExecutionMode ? 'DRAFT_ON' : 'DRAFT_OFF'
      }
    ],
    Mesh: [
      { 
        label: 'Central HUD', 
        icon: LayoutDashboard, 
        action: () => onSetViewMode('dashboard')
      },
      { 
        label: 'Logic Builder', 
        icon: Layers, 
        action: () => onSetViewMode('canvas')
      },
      { 
        label: 'Digital Twin', 
        icon: Globe, 
        action: () => onSetViewMode('neural')
      }
    ],
    Window: [
      { 
        label: 'Governance Hub', 
        icon: Shield, 
        action: () => onSetViewMode('governance')
      },
      { 
        label: 'AI Executive Advisor', 
        icon: Compass, 
        action: () => onSetViewMode('advisor')
      },
      { 
        label: 'Live Mission', 
        icon: Zap, 
        action: () => onSetViewMode('mission')
      },
      { 
        label: 'Enterprise Cosmos', 
        icon: DbIcon, 
        action: () => onSetViewMode('cosmos')
      }
    ],
    Help: [
      { 
        label: "Pilot's Manual", 
        icon: HelpCircle, 
        action: () => onSetViewMode('guide')
      },
      { 
        label: 'About VoxOS', 
        icon: Info, 
        action: () => onSetViewMode('about')
      },
      { 
        label: 'Privacy Policy', 
        icon: Shield, 
        action: () => onSetViewMode('privacy')
      }
    ]
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="h-10 flex items-center justify-between px-6 border-b border-vox-border bg-vox-panel/60 backdrop-blur-3xl z-[60] shrink-0 sticky top-0"
    >
      {/* OS Logo & Name */}
      <div className="flex items-center gap-3 lg:gap-4 shrink-0">
        <div 
          onClick={() => onSetViewMode('canvas')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <Terminal className="text-vox-primary group-hover:rotate-95 transition-transform" size={14} />
          <span className="text-[11px] font-black text-white tracking-widest leading-none">Vox Flow OS</span>
        </div>

        {/* Editable Workspace Name */}
        <div className="flex items-center gap-1 text-white/30 text-[9px] select-none shrink-0" id="header-workspace-rename-container">
          <span className="opacity-50">/</span>
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => {
                if (tempName.trim()) {
                  updateWorkspaceName(currentWorkspace, tempName.trim());
                }
                setIsEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (tempName.trim()) {
                    updateWorkspaceName(currentWorkspace, tempName.trim());
                  }
                  setIsEditingName(false);
                } else if (e.key === 'Escape') {
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="bg-black/60 border border-vox-primary/50 rounded px-2 py-0.5 text-[9px] text-vox-primary focus:outline-none font-black uppercase tracking-widest w-24 sm:w-36 md:w-48"
            />
          ) : (
            <button 
              onClick={() => {
                const ws = workspaces.find(w => w.id === currentWorkspace);
                setTempName(ws ? ws.name : '');
                setIsEditingName(true);
              }}
              title="Click to rename active workspace"
              className="font-black text-white/60 hover:text-vox-primary cursor-pointer border-b border-dashed border-white/20 hover:border-vox-primary/40 uppercase tracking-widest text-[9px] transition-all bg-transparent px-1 leading-none py-0.5 rounded"
            >
              {workspaces.find(w => w.id === currentWorkspace)?.name || 'UNNAMED_MESH'}
            </button>
          )}
        </div>

      {/* Horizontal Navigation Tab Bar */}
      <div className="hidden sm:flex items-center gap-1 bg-white/[0.02] border border-white/5 px-1 py-0.5 rounded-full shrink-0 select-none">
           {[
             { id: 'canvas', label: 'BUILD' },
             { id: 'dashboard', label: 'OPS' },
             { id: 'neural', label: 'MAP' },
             { id: 'mission', label: 'LIVE' },
             { id: 'governance', label: 'GOV' },
             { id: 'advisor', label: 'AI INTEL' }, { id: 'architect', label: 'AI ARCHITECT' }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => tab.id === 'architect' ? window.dispatchEvent(new CustomEvent('toggle-ai-architect', { detail: { open: true } })) : onSetViewMode(tab.id)}
               className={cn(
                 "px-2.5 py-0.5 rounded-full text-[8.5px] font-black tracking-widest transition-all",
                 viewMode === tab.id 
                   ? "bg-vox-primary text-vox-bg font-black shadow-[0_0_12px_rgba(0,229,255,0.4)]" 
                   : "text-white/40 hover:text-white hover:bg-white/5"
               )}
             >
               {tab.label}
             </button>
           ))}
        </div>

        <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-6 h-4 relative">
           {Object.keys(menuItems).map(item => (
             <div key={item} className="relative">
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   setActiveDropdown(activeDropdown === item ? null : item);
                 }}
                 className={cn(
                   "text-[10px] font-medium transition-colors px-1.5 py-0.5 rounded hover:bg-white/5",
                   activeDropdown === item ? "text-vox-primary bg-white/5 font-bold" : "text-white/40 hover:text-white"
                 )}
               >
                 {item}
               </button>

               <AnimatePresence>
                 {activeDropdown === item && (
                   <motion.div 
                     initial={{ opacity: 0, y: 8, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 8, scale: 0.95 }}
                     transition={{ duration: 0.15 }}
                     className="absolute left-0 top-6 min-w-[200px] bg-vox-panel/95 backdrop-blur-3xl border border-vox-border rounded-xl p-2.5 shadow-2xl z-[1000] flex flex-col gap-1.5"
                   >
                     {menuItems[item].map((menuItem, idx) => {
                       const IconComp = menuItem.icon;
                       return (
                         <button
                           key={idx}
                           onClick={() => {
                             setActiveDropdown(null);
                             menuItem.action();
                           }}
                           className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-white/70 hover:text-vox-primary hover:bg-vox-primary/10 rounded-lg flex items-center justify-between transition-all group/item"
                         >
                           <span className="flex items-center gap-2.5">
                             <IconComp size={12} className="text-white/30 group-hover/item:text-vox-primary transition-colors" />
                             {menuItem.label}
                           </span>
                           {menuItem.shortcut && (
                             <span className="text-[7px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded leading-none">
                               {menuItem.shortcut}
                             </span>
                           )}
                         </button>
                       );
                     })}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           ))}
        </div>

        {/* Mobile Dropdown Menu Trigger */}
        <div className="md:hidden relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(activeDropdown === 'mobile-system' ? null : 'mobile-system');
            }}
            className={cn(
              "text-[9px] uppercase tracking-widest font-black transition-all px-2.5 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1 text-white/60 hover:text-white",
              activeDropdown === 'mobile-system' && "text-vox-primary bg-white/10 border-vox-primary/30"
            )}
          >
            <span>Menu</span>
            <ChevronDown size={10} />
          </button>

          <AnimatePresence>
            {activeDropdown === 'mobile-system' && (
              <motion.div 
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-6 min-w-[220px] max-h-[80vh] overflow-y-auto bg-vox-panel/95 backdrop-blur-3xl border border-vox-border rounded-xl p-2.5 shadow-2xl z-[1000] flex flex-col gap-2 custom-scrollbar"
              >
                {Object.keys(menuItems).map((category) => (
                  <div key={category} className="space-y-1">
                    <div className="px-2.5 pt-1 pb-0.5 text-[7px] font-black text-white/30 tracking-[0.3em] uppercase border-b border-white/5">
                      {category}
                    </div>
                    {menuItems[category].map((menuItem, idx) => {
                      const IconComp = menuItem.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveDropdown(null);
                            menuItem.action();
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/70 hover:text-vox-primary hover:bg-vox-primary/10 rounded-lg flex items-center justify-between transition-all group/item"
                        >
                          <span className="flex items-center gap-2">
                            <IconComp size={10} className="text-white/30 group-hover/item:text-vox-primary transition-colors" />
                            {menuItem.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center Logic: Clock */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col items-center select-none">
         <span className="text-[10px] font-black text-white/80 tabular-nums">{formattedTime}</span>
         <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] -mt-0.5">{formattedDate}</span>
      </div>

      {/* System Actions & Tray */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          {deferredPrompt && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                const promptEvent = deferredPrompt;
                if (promptEvent) {
                  promptEvent.prompt();
                  const { outcome } = await promptEvent.userChoice;
                  console.log(`User response to installation prompt: ${outcome}`);
                  setDeferredPrompt(null);
                }
              }}
              className="px-2.5 py-1 rounded-lg border border-vox-primary/50 bg-vox-primary/10 text-vox-primary hover:bg-vox-primary/25 text-[8.5px] font-black uppercase tracking-widest transition-all flex items-center gap-1 sm:gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.15)] animate-pulse"
              title="Install VoxFlow OS PWA"
            >
              <Download size={11} />
              INSTALL OS
            </motion.button>
          )}

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSplitLayout}
            className={cn(
               "px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
               isSplitLayout 
                 ? "bg-vox-secondary/15 text-vox-secondary border-vox-secondary/50 shadow-[0_0_15px_rgba(255,45,200,0.15)]" 
                 : "bg-white/5 border-white/10 text-white/40 hover:text-white"
            )}
            title="Split Workstation Layout (Ctrl+\)"
          >
            <Columns size={12} />
            {isSplitLayout ? 'SPLIT_ON' : 'SPLIT_OFF'}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={executeSequence}
            disabled={isExecuting}
            className={cn(
               "px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
               isExecuting 
                 ? "bg-amber-400 text-black border-amber-500 animate-pulse" 
                 : "bg-vox-primary/10 border-vox-primary/30 text-vox-primary hover:bg-vox-primary hover:text-vox-bg"
            )}
          >
            {isExecuting ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} className="fill-current" />}
            {isExecuting ? 'SEQ_ACTIVE' : 'PULSE'}
          </motion.button>

          <div className="w-px h-4 bg-white/10" />

          <div className="flex items-center gap-2 pr-3">
             <Globe size={13} className="text-white/20" />
             <Shield size={13} className="text-vox-success" />
             <Zap size={13} className="text-vox-secondary" />
          </div>

          <div 
            onClick={() => {
              if (confirm('Decommission operational vector and terminate session?')) {
                logout();
              }
            }}
            className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition-all"
          >
             <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-vox-primary/40 to-vox-secondary/40 flex items-center justify-center overflow-hidden">
                <span className="text-[8px] font-black text-white uppercase">
                   {currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                </span>
             </div>
             <span className="text-[10px] font-black text-white/40 group-hover:text-white transition-colors">{currentUser?.name || 'VOX_AGENT'}</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};


const NavGroup = ({ title, children }: any) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] ml-4">{title}</span>
    <div className="flex items-center gap-1">
      {children}
    </div>
  </div>
);

const HeaderNavButton = ({ active, children, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group overflow-hidden",
      active ? "text-vox-primary" : "text-white/40 hover:text-white"
    )}
  >
    <span className="relative z-10">{children}</span>
    {active && (
      <motion.div 
        layoutId="activeHeaderTab"
        className="absolute inset-0 bg-vox-primary/10 border border-vox-primary/20 rounded-xl"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {!active && (
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors" />
    )}
  </button>
);

const HeaderIconButton = ({ icon: Icon, onClick, tooltip }: any) => (
  <button 
    onClick={onClick}
    className="p-2.5 rounded-xl text-white/30 hover:text-vox-primary hover:bg-vox-primary/10 transition-all relative group"
  >
    <Icon size={18} />
    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-vox-bg border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-90 group-hover:scale-100 shadow-2xl">
      {tooltip}
    </span>
  </button>
);
