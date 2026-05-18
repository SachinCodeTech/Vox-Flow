import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { motion } from 'motion/react';

export const NeuralEdge = ({
  id,
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  const isExecuting = data?.isExecuting || false;

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
        strokeOpacity={isExecuting ? 0.3 : 0.1}
        strokeLinecap="round"
        style={{ filter: 'blur(12px)', transition: 'all 0.5s ease' }}
      />

      {/* Secondary Glow (Tight) */}
      <path
        d={edgePath}
        fill="none"
        stroke="#00E5FF"
        strokeWidth={isExecuting ? 4 : 2}
        strokeOpacity={isExecuting ? 0.5 : 0.2}
        strokeLinecap="round"
        style={{ filter: 'blur(2px)', transition: 'all 0.5s ease' }}
      />

      {/* Core Path - High Contrast (Thin) */}
      <path
        d={edgePath}
        fill="none"
        stroke="#00E5FF"
        strokeWidth={isExecuting ? 1.5 : 0.8}
        strokeLinecap="round"
        markerEnd={markerEnd}
        style={{ 
          ...style, 
          transition: 'all 0.5s ease', 
          strokeOpacity: 0.8, 
          filter: 'drop-shadow(0 0 2px #00E5FF)',
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
        animate={{ opacity: isExecuting ? [0.4, 1, 0.4] : [0.1, 0.3, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: 'blur(0.5px)' }}
      />

      {/* Animated Particle Path */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={isExecuting ? 1.5 : 0.8}
        strokeDasharray="4, 60"
        strokeDashoffset="0"
        initial={{ strokeDashoffset: 100, opacity: 0 }}
        animate={{ 
          strokeDashoffset: [0, -300], 
          opacity: isExecuting ? 1 : 0.4,
        }}
        transition={{ 
          duration: isExecuting ? 1.5 : 3, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </>
  );
};
