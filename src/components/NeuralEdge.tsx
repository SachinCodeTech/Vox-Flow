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
        style={{ fill: 'none', strokeOpacity: 0, strokeWidth: 24 }}
        className="react-flow__edge-interaction cursor-pointer"
        d={edgePath}
      />

      {/* Background Glow Path - Thicker and Much Brighter Cyan Glow */}
      <path
        d={edgePath}
        fill="none"
        stroke="#00E5FF"
        strokeWidth={isExecuting ? 16 : 8}
        strokeOpacity={isExecuting ? 0.45 : 0.25}
        strokeLinecap="round"
        style={{ filter: 'blur(10px)', transition: 'all 0.3s ease' }}
      />

      {/* Secondary Glow (Tight definition glow) */}
      <path
        d={edgePath}
        fill="none"
        stroke="#00E5FF"
        strokeWidth={isExecuting ? 6 : 3.5}
        strokeOpacity={isExecuting ? 0.7 : 0.4}
        strokeLinecap="round"
        style={{ filter: 'blur(3px)', transition: 'all 0.3s ease' }}
      />

      {/* Core Path - Thicker, Highly Visible High Contrast Vector */}
      <path
        d={edgePath}
        fill="none"
        stroke={isExecuting ? "#FFFFFF" : "#00E5FF"}
        strokeWidth={isExecuting ? 2.5 : 2.0}
        strokeLinecap="round"
        markerEnd={markerEnd}
        style={{ 
          ...style, 
          transition: 'all 0.3s ease', 
          strokeOpacity: isExecuting ? 1.0 : 0.85, 
          filter: isExecuting ? 'drop-shadow(0 0 6px #00E5FF)' : 'drop-shadow(0 0 2px rgba(0,229,255,0.4))',
          zIndex: 100
        }}
      />

      {/* Pulsing Core Overlay */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="#00E5FF"
        strokeWidth={isExecuting ? 3.0 : 1.5}
        strokeLinecap="round"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: isExecuting ? [0.6, 1.0, 0.6] : [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: 'blur(0.5px)' }}
      />

      {/* Animated Flow Particles (Always running to convey live mesh status, speeds up when executing) */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={isExecuting ? "#FFFFFF" : "#5DA9FF"}
        strokeWidth={isExecuting ? 3.0 : 1.5}
        strokeDasharray="8, 45"
        strokeDashoffset="0"
        initial={{ strokeDashoffset: 100, opacity: 0 }}
        animate={{ 
          strokeDashoffset: [0, -250], 
          opacity: 0.95,
        }}
        transition={{ 
          duration: isExecuting ? 0.8 : 2.2, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </>
  );
};
