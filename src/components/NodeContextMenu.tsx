import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Edit, 
  Copy, 
  Trash2, 
  Play, 
  X,
  Info,
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';

export const NodeContextMenu = () => {
  const { 
    contextMenu, 
    setContextMenu, 
    deleteNode, 
    addNode, 
    nodes,
    setIsExecuting,
    addRuntimeJob,
    createGroup
  } = useWorkflowStore();

  if (!contextMenu) return null;

  const node = nodes.find(n => n.id === contextMenu.id);
  if (!node) return null;

  const handleAction = (action: () => void) => {
    action();
    setContextMenu(null);
  };

  const selectedNodes = nodes.filter(n => n.selected);

  const menuItems = [
    { 
      label: 'Execute Node', 
      icon: Play, 
      color: 'text-vox-primary',
      action: () => {
        setIsExecuting(true);
        addRuntimeJob({ workspaceId: 'manual', nodeId: node.id, status: 'running' });
        setTimeout(() => {
          setIsExecuting(false);
          addRuntimeJob({ workspaceId: 'manual', nodeId: node.id, status: 'success' });
        }, 1500);
      }
    },
    { 
      label: 'Cluster Selected', 
      icon: Layers, 
      hidden: selectedNodes.length < 2,
      action: () => {
        const name = prompt('Neural Cluster Identifier:', 'WORKFLOW_SEGMENT_01');
        if (name) createGroup(selectedNodes.map(n => n.id), name);
      }
    },
    { 
      label: 'Duplicate', 
      icon: Copy, 
      action: () => {
        const newNode = {
          ...node,
          id: `dup-${Date.now()}`,
          position: { x: node.position.x + 20, y: node.position.y + 20 },
          selected: false
        };
        addNode(newNode);
      }
    },
    { 
      label: 'Inspect Logic', 
      icon: Info, 
      action: () => {
        // Logic inspection trigger
      }
    },
    { 
      label: 'Delete Instance', 
      icon: Trash2, 
      color: 'text-red-400',
      action: () => {
        if (confirm('Decommission this neural instance?')) {
          deleteNode(node.id);
        }
      }
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-[1000]" 
      onMouseDown={() => setContextMenu(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        style={{ left: contextMenu.x, top: contextMenu.y }}
        className="absolute w-56 bg-vox-bg/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-1"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between mb-1">
           <div className="flex flex-col">
              <span className="text-[7px] font-black text-vox-primary uppercase tracking-widest italic">Node Options</span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter truncate max-w-[120px]">
                {node.data.label}
              </span>
           </div>
           <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
              <ChevronRight size={10} className="text-white/20" />
           </div>
        </div>

        {menuItems.filter(i => !i.hidden).map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleAction(item.action)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <item.icon size={14} className={cn("text-white/40 group-hover:scale-110 transition-transform", item.color)} />
              <span className={cn("text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white", item.color)}>
                {item.label}
              </span>
            </div>
          </button>
        ))}

        <div className="mt-2 pt-2 border-t border-white/5 px-3 py-2 flex items-center justify-between opacity-30 select-none">
           <span className="text-[6px] font-black uppercase tracking-[0.3em]">Neural Sec-Ops</span>
           <span className="text-[6px] font-mono">0X-442</span>
        </div>
      </motion.div>
    </div>
  );
};
