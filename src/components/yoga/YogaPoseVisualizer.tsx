'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { YogaPose } from '@/types';
import { cn } from '@/lib/utils';

interface PoseVisualizerProps {
  pose: YogaPose;
  isResting?: boolean;
  compact?: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

type PoseShape = {
  head: [number, number];
  torso: string;
  arms: string[];
  legs: string[];
  ground: string;
};

const POSE_SHAPES: Record<string, PoseShape> = {
  cat_cow: { head: [150, 70], torso: 'M150 88 Q130 112 108 128', arms: ['M125 108 L92 142 L72 142', 'M112 123 L84 155 L65 155'], legs: ['M108 128 L76 116 L54 126', 'M108 128 L78 138 L58 151'], ground: 'M42 158 H174' },
  neck_roll: { head: [140, 62], torso: 'M140 80 L140 132', arms: ['M140 98 L104 136 L88 158', 'M140 101 L174 124 L184 151'], legs: ['M140 132 L108 158', 'M140 132 L172 158'], ground: 'M82 162 H190' },
  eagle_arms: { head: [150, 48], torso: 'M150 66 L150 128', arms: ['M150 85 L111 101 L126 119 L103 128', 'M150 85 L189 101 L174 119 L197 128'], legs: ['M150 128 L121 158', 'M150 128 L179 158'], ground: 'M100 162 H200' },
  twist: { head: [160, 48], torso: 'M150 68 L136 128', arms: ['M149 86 L116 105 L92 91', 'M148 88 L180 108 L202 94'], legs: ['M136 128 L107 158', 'M136 128 L169 158'], ground: 'M92 162 H210' },
  mountain: { head: [150, 38], torso: 'M150 56 L150 126', arms: ['M150 76 L120 42 L105 22', 'M150 76 L180 42 L195 22'], legs: ['M150 126 L126 160', 'M150 126 L174 160'], ground: 'M94 164 H206' },
  forward_fold: { head: [132, 116], torso: 'M145 82 Q134 101 128 122', arms: ['M140 92 L110 130 L91 155', 'M151 91 L151 132 L166 155'], legs: ['M145 82 L174 84 L201 82', 'M145 82 L115 82 L88 86'], ground: 'M78 162 H210' },
  cobra: { head: [150, 70], torso: 'M150 86 Q126 112 98 132', arms: ['M127 108 L95 142 L79 153', 'M116 119 L87 147 L70 153'], legs: ['M98 132 L64 144 L39 150', 'M98 132 L67 151 L44 158'], ground: 'M34 162 H190' },
  child_pose: { head: [92, 119], torso: 'M108 112 Q137 119 154 137', arms: ['M119 123 L155 151 L194 158', 'M111 128 L142 157 L174 160'], legs: ['M154 137 Q177 139 185 157', 'M150 137 Q133 145 126 160'], ground: 'M78 162 H205' },
};

const fallbackShape = POSE_SHAPES.mountain;

export const YogaPoseVisualizer: React.FC<PoseVisualizerProps> = ({
  pose,
  isResting = false,
  compact = false,
  onClick,
  isActive = false,
}) => {
  const shape = POSE_SHAPES[pose.illustrationKey] || fallbackShape;
  const isInteractive = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 transition-all',
        compact ? 'min-w-[112px] p-2' : 'min-h-[290px] p-4 sm:p-6',
        isActive ? 'border-emerald-400 shadow-neon' : 'border-zen-200/60 dark:border-zen-800/60',
        isInteractive && 'cursor-pointer hover:border-emerald-400/70'
      )}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(event) => {
        if (isInteractive && (event.key === 'Enter' || event.key === ' ')) onClick?.();
      }}
    >
      <div className={cn('relative mx-auto aspect-[5/4] max-w-sm', compact ? 'w-24' : 'w-full')}>
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-400/10 blur-2xl"
          animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <svg viewBox="0 0 220 180" className="relative h-full w-full" aria-label={`${pose.name} animated pose`}>
          <motion.g
            animate={isResting ? { y: [0, 2, 0], rotate: [0, -1, 0] } : { y: [0, -3, 0], rotate: [0, 1, 0] }}
            transition={{ duration: isResting ? 3 : 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx={shape.head[0]} cy={shape.head[1]} r="11" fill="#f4c7a1" stroke="#125a47" strokeWidth="3" />
            <path d={shape.torso} fill="none" stroke="#10ae82" strokeWidth="12" strokeLinecap="round" />
            {shape.arms.map((arm) => <path key={arm} d={arm} fill="none" stroke="#10ae82" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />)}
            {shape.legs.map((leg) => <path key={leg} d={leg} fill="none" stroke="#0f7d68" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />)}
            <path d={shape.ground} fill="none" stroke="#10ef9c" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
          </motion.g>
        </svg>
      </div>
      {!compact && (
        <div className="relative text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
            {isResting ? 'Transition' : 'Follow the shape'}
          </span>
          <p className="mt-1 text-sm font-semibold text-zen-900 dark:text-zen-100">{pose.name}</p>
        </div>
      )}
    </div>
  );
};