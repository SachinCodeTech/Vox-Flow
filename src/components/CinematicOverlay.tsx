import React from 'react';
import { motion } from 'motion/react';

export const CinematicOverlay = () => {
  return (
    <>
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.06] select-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-[9997] overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
            x: [-20, 20, -20],
            y: [-20, 20, -20]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-vox-primary/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1.1, 1, 1.1],
            x: [20, -20, 20],
            y: [20, -20, 20]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-vox-secondary/5 blur-[120px] rounded-full"
        />
      </div>

      {/* Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[9996] shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
    </>
  );
};
