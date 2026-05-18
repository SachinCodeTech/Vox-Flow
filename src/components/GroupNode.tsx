import React, { memo } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';
import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

export const GroupNode = memo(({ id, data, selected }: NodeProps) => {
  const { isExecutionMode, nodes, updateNodeData, setNodesHidden } = useWorkflowStore();
  const isCollapsed = data.isCollapsed || false;

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const children = nodes.filter(n => n.parentNode === id).map(n => n.id);
    const newState = !isCollapsed;
    updateNodeData(id, { isCollapsed: newState });
    setNodesHidden(children, newState);
  };
  
  return (
    <div className={cn(
      "transition-all duration-700 relative flex flex-col",
      isCollapsed ? "h-16 w-64" : "h-full w-full",
      "rounded-[2rem] border",
      selected ? "border-vox-primary/50 bg-vox-primary/5" : "border-white/5 bg-white/[0.01]",
      isExecutionMode && "border-vox-primary/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]"
    )}>
      {!isCollapsed && (
        <NodeResizer 
          minWidth={200} 
          minHeight={150} 
          isVisible={selected} 
          lineClassName="border-vox-primary/30" 
          handleClassName="h-3 w-3 bg-vox-primary rounded-full border-2 border-vox-bg"
        />
      )}
      
      {/* Label/Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 pointer-events-none">
          <Layers size={10} className="text-vox-primary/60" />
          <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] italic">
            {data.label || 'NEURAL_CLUSTER'}
          </span>
        </div>
        <button 
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all z-10"
        >
          {isCollapsed ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
        </button>
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
