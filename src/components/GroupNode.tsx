import React, { memo } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';
import { Layers, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export const GroupNode = memo(({ id, data, selected }: NodeProps) => {
  const { isExecutionMode, nodes, updateNodeData, setNodesHidden, deleteNode } = useWorkflowStore();
  const isCollapsed = data.isCollapsed || false;

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const children = nodes.filter(n => n.parentNode === id).map(n => n.id);
    const newState = !isCollapsed;
    updateNodeData(id, { isCollapsed: newState });
    setNodesHidden(children, newState);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Decommission this neural cluster? Children will be preserved but detached.')) {
      deleteNode(id);
    }
  };
  
  return (
    <div className={cn(
      "transition-all duration-700 relative flex flex-col",
      isCollapsed ? "h-16 w-64 shadow-lg" : "h-full w-full",
      "rounded-[2.5rem] border",
      selected ? "border-vox-primary bg-vox-primary/5 shadow-[0_0_50px_rgba(0,229,255,0.1)]" : "border-white/10 bg-white/[0.02] backdrop-blur-3xl",
      isExecutionMode && "border-vox-primary/40 shadow-[0_0_40px_rgba(0,229,255,0.1)]"
    )}>
      {!isCollapsed && (
        <NodeResizer 
          minWidth={200} 
          minHeight={150} 
          isVisible={selected} 
          lineClassName="border-vox-primary/50" 
          handleClassName="h-4 w-4 bg-vox-primary rounded-full border-2 border-vox-bg shadow-[0_0_10px_rgba(0,229,255,0.5)]"
        />
      )}
      
      {/* Label/Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3 pointer-events-none">
          <div className="w-8 h-8 rounded-xl bg-vox-primary/10 flex items-center justify-center">
            <Layers size={14} className="text-vox-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-vox-primary uppercase tracking-[0.4em] italic">
              Neural_Cluster
            </span>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">
              {data.label || 'INIT_GROUP_01'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selected && (
            <button 
              onClick={handleDelete}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all z-10"
              title="Decommission Cluster"
            >
              <Trash2 size={12} />
            </button>
          )}
          <button 
            onClick={toggleCollapse}
            className="p-2 rounded-xl bg-white/5 hover:bg-vox-primary/10 text-white/20 hover:text-vox-primary transition-all z-10 border border-white/10"
          >
            {isCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
        </div>
      </div>

      {/* Decorative corners */}
      {!isCollapsed && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-vox-primary/20 rounded-tl-[2rem]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-vox-primary/20 rounded-br-[2rem]" />
        </>
      )}
    </div>
  );
});
