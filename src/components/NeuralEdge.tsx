import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { motion } from 'motion/react';

import { useWorkflowStore } from '../store/useWorkflowStore';

export const NeuralEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  const nodes = useWorkflowStore(state => state.nodes);
  const sourceNode = nodes.find(n => n.id === source);
  const targetNode = nodes.find(n => n.id === target);
  
  const isSourceRunning = sourceNode?.data.status === 'running';
  const isSourceSuccess = sourceNode?.data.status === 'success';
  const isTargetRunning = targetNode?.data.status === 'running';

  const isExecuting = isSourceRunning || (isSourceSuccess && isTargetRunning);
  const isAmbient = useWorkflowStore(state => state.isExecutionMode || state.isExecuting);

  return (
    <>
      {/* Interaction Path (Invisible but wider for selection) */}
      <path
        id={id}
        style={{ fill: 'none', strokeOpacity: 0, strokeWidth: 20 }}
        className="react-flow__edge-interaction"
        d={edgePath}
      />

      {/* Background Glow Path - Even Stronger */}
      <path
        d={edgePath}
        fill="none"
        stroke="#00E5FF"
        strokeWidth={isExecuting ? 12 : 6}
        strokeOpacity={isExecuting ? 0.3 : isAmbient ? 0.15 : 0.05}
        strokeLinecap="round"
        style={{ filter: 'blur(12px)', transition: 'all 0.5s ease' }}
      />

      {/* Secondary Glow (Tight) */}
      <path
        d={edgePath}
        fill="none"
        stroke={isExecuting ? "#00E5FF" : isAmbient ? "#5DA9FF" : "rgba(255,255,255,0.05)"}
        strokeWidth={isExecuting ? 4 : 2}
        strokeOpacity={isExecuting ? 0.5 : isAmbient ? 0.2 : 0.1}
        strokeLinecap="round"
        style={{ filter: 'blur(2px)', transition: 'all 0.5s ease' }}
      />

      {/* Core Path - High Contrast (Thin) */}
      <path
        d={edgePath}
        fill="none"
        stroke={isExecuting ? "#00E5FF" : isAmbient ? "#5DA9FF" : "rgba(255,255,255,0.1)"}
        strokeWidth={isExecuting ? 1.5 : 0.8}
        strokeLinecap="round"
        markerEnd={markerEnd}
        style={{ 
          ...style, 
          transition: 'all 0.5s ease', 
          strokeOpacity: isExecuting ? 1 : 0.4, 
          filter: isExecuting ? 'drop-shadow(0 0 4px #00E5FF)' : 'none',
          zIndex: 100
        }}
      />

      {/* Pulsing Core Overlay */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="#00E5FF"
        strokeWidth={isExecuting ? 2 : 1}
        strokeLinecap="round"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: isExecuting ? [0.4, 1, 0.4] : isAmbient ? [0.1, 0.3, 0.1] : 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: 'blur(0.5px)' }}
      />

      {/* Animated Particle Path */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={isExecuting ? "#FFFFFF" : "#00E5FF"}
        strokeWidth={isExecuting ? 2 : 0.8}
        strokeDasharray="4, 60"
        strokeDashoffset="0"
        initial={{ strokeDashoffset: 100, opacity: 0 }}
        animate={{ 
          strokeDashoffset: [0, -300], 
          opacity: isExecuting ? 1 : isAmbient ? 0.4 : 0,
        }}
        transition={{ 
          duration: isExecuting ? 1 : 3, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </>
  );
};
