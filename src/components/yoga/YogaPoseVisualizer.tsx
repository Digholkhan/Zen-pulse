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

type PoseMotion = {
  figure: { y: number[]; rotate: number[] };
  head: { y: number[]; rotate: number[] };
  arms: { rotate: number[] };
  legs: { y: number[]; rotate: number[] };
  shift?: { torso: [number, number]; arms: [number, number]; legs: [number, number] };
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
  warrior_ii: { head: [150, 34], torso: 'M150 52 L150 111', arms: ['M150 70 L78 70 L45 61', 'M150 70 L190 70 L218 61'], legs: ['M150 111 L109 150 L70 158', 'M150 111 L177 139 L213 151'], ground: 'M38 162 H218' },
  tree: { head: [150, 32], torso: 'M150 50 L150 128', arms: ['M150 72 L116 45 L97 25', 'M150 72 L184 45 L203 25'], legs: ['M150 128 L150 158', 'M150 128 Q177 124 177 99 Q177 88 164 82'], ground: 'M112 162 H188' },
  downward_dog: { head: [102, 93], torso: 'M114 96 L151 76 L178 91', arms: ['M114 96 L84 133 L66 158', 'M127 101 L104 139 L91 158'], legs: ['M151 76 L178 45 L207 25', 'M151 76 L178 111 L207 151'], ground: 'M54 162 H214' },
  bridge: { head: [54, 128], torso: 'M70 126 Q111 91 151 101 Q177 108 190 130', arms: ['M93 111 L71 145', 'M111 104 L92 144'], legs: ['M151 101 L176 75 L205 72', 'M158 104 L183 137 L209 151'], ground: 'M38 162 H216' },
  side_bend: { head: [128, 50], torso: 'M133 68 Q144 95 135 127', arms: ['M135 78 L103 42 L80 22', 'M135 78 L171 49 L195 31'], legs: ['M135 127 L108 159', 'M135 127 L163 159'], ground: 'M82 163 H190' },
  low_lunge: { head: [142, 48], torso: 'M142 66 Q130 90 119 111', arms: ['M136 78 L106 47 L83 25', 'M145 78 L176 47 L198 25'], legs: ['M119 111 L78 132 L46 151', 'M119 111 L157 132 L199 151'], ground: 'M34 162 H210' },
  seated_pose: { head: [150, 50], torso: 'M150 68 L150 116', arms: ['M150 83 L121 104 L99 96', 'M150 83 L179 104 L201 96'], legs: ['M150 116 Q119 128 91 151', 'M150 116 Q181 128 209 151'], ground: 'M76 162 H224' },
  happy_baby: { head: [108, 128], torso: 'M121 119 Q151 101 166 119', arms: ['M133 111 L114 83 L101 64', 'M151 108 L176 81 L193 62'], legs: ['M166 119 Q181 93 174 62', 'M166 119 Q148 91 132 64'], ground: 'M76 162 H205' },
  sphinx: { head: [82, 109], torso: 'M96 113 Q126 99 158 111', arms: ['M109 112 L103 142 L91 158', 'M123 110 L119 141 L109 158'], legs: ['M158 111 L187 128 L213 150', 'M158 113 L188 142 L216 158'], ground: 'M42 162 H220' },
  pigeon: { head: [104, 81], torso: 'M119 96 Q141 106 160 126', arms: ['M125 103 L102 128 L82 145', 'M136 108 L119 136 L105 158'], legs: ['M160 126 Q132 133 91 151', 'M160 126 L187 143 L215 155'], ground: 'M62 162 H220' },
  dancer: { head: [137, 34], torso: 'M141 52 Q146 87 137 120', arms: ['M141 70 L107 61 L77 54', 'M142 71 L173 102 L205 126'], legs: ['M137 120 L109 155 L84 159', 'M137 120 Q169 108 178 78 Q183 64 174 51'], ground: 'M62 162 H205' },
  wide_fold: { head: [145, 111], torso: 'M145 78 Q143 98 145 117', arms: ['M140 91 L113 126 L94 153', 'M150 91 L174 126 L194 153'], legs: ['M145 78 L109 81 L72 83', 'M145 78 L181 81 L218 83'], ground: 'M58 162 H222' },
  figure_four: { head: [82, 116], torso: 'M99 111 Q129 99 154 112', arms: ['M111 111 L94 136 L78 154', 'M125 108 L111 137 L97 158'], legs: ['M154 112 Q177 91 186 69', 'M154 112 Q183 128 211 151'], ground: 'M48 162 H220' },
  corpse: { head: [48, 137], torso: 'M66 133 Q109 119 153 132 Q178 139 193 145', arms: ['M89 129 L59 147 L39 158', 'M107 126 L79 146 L60 158'], legs: ['M153 132 L184 151 L215 158', 'M157 134 L188 143 L218 149'], ground: 'M28 162 H222' },
};

const fallbackShape = POSE_SHAPES.mountain;

const getPathEndpoint = (path: string): [number, number] => {
  const coordinates = path.match(/-?\d+(?:\.\d+)?/g);
  if (!coordinates || coordinates.length < 2) return [0, 0];
  return [Number(coordinates[coordinates.length - 2]), Number(coordinates[coordinates.length - 1])];
};

const shiftPath = (path: string, [shiftX, shiftY]: [number, number]) => {
  let coordinateIndex = 0;
  return path.replace(/-?\d+(?:\.\d+)?/g, (value) => {
    const shiftedValue = Number(value) + (coordinateIndex % 2 === 0 ? shiftX : shiftY);
    coordinateIndex += 1;
    return String(shiftedValue);
  });
};

const POSE_MOTIONS: Record<string, PoseMotion> = {
  cat_cow: { figure: { y: [0, -4, 0, 4, 0], rotate: [0, -2, 0, 2, 0] }, head: { y: [0, -5, 0, 4, 0], rotate: [0, -8, 0, 8, 0] }, arms: { rotate: [0, -2, 0, 2, 0] }, legs: { y: [0, 2, 0, -2, 0], rotate: [0, 2, 0, -2, 0] } },
  neck_roll: { figure: { y: [0, 2, 0], rotate: [0, -1, 0] }, head: { y: [0, 3, 0], rotate: [0, -12, 0] }, arms: { rotate: [0, 1, 0] }, legs: { y: [0, 1, 0], rotate: [0, -1, 0] } },
  eagle_arms: { figure: { y: [0, -3, 0, 3, 0], rotate: [0, 1, 0, -1, 0] }, head: { y: [0, -2, 0, 2, 0], rotate: [0, 2, 0, -2, 0] }, arms: { rotate: [0, -7, 0, 7, 0] }, legs: { y: [0, 1, 0, -1, 0], rotate: [0, 1, 0, -1, 0] } },
  twist: { figure: { y: [0, -2, 0, 2, 0], rotate: [0, -5, 0, 5, 0] }, head: { y: [0, -1, 0, 1, 0], rotate: [0, -8, 0, 8, 0] }, arms: { rotate: [0, -5, 0, 5, 0] }, legs: { y: [0, 1, 0], rotate: [0, 1, 0] } },
  mountain: { figure: { y: [0, -5, 0, 3, 0], rotate: [0, 1, 0, -1, 0] }, head: { y: [0, -3, 0, 2, 0], rotate: [0, 1, 0, -1, 0] }, arms: { rotate: [0, -3, 0, 3, 0] }, legs: { y: [0, 1, 0, -1, 0], rotate: [0, 1, 0, -1, 0] }, shift: { torso: [0, -5], arms: [0, -8], legs: [0, 2] } },
  forward_fold: { figure: { y: [0, 3, 0, -2, 0], rotate: [0, -2, 0, 2, 0] }, head: { y: [0, 5, 0, -3, 0], rotate: [0, -5, 0, 5, 0] }, arms: { rotate: [0, 5, 0, -5, 0] }, legs: { y: [0, 1, 0], rotate: [0, -2, 0] } },
  cobra: { figure: { y: [0, -5, 0, 2, 0], rotate: [0, -2, 0, 2, 0] }, head: { y: [0, -7, 0, 2, 0], rotate: [0, -4, 0, 4, 0] }, arms: { rotate: [0, -2, 0, 2, 0] }, legs: { y: [0, 1, 0], rotate: [0, 1, 0] } },
  child_pose: { figure: { y: [0, 3, 0, -2, 0], rotate: [0, 1, 0, -1, 0] }, head: { y: [0, 4, 0, -2, 0], rotate: [0, -3, 0, 3, 0] }, arms: { rotate: [0, 3, 0, -3, 0] }, legs: { y: [0, 1, 0], rotate: [0, -1, 0] } },
  warrior_ii: { figure: { y: [0, -4, 0, 2, 0], rotate: [0, 1, 0, -1, 0] }, head: { y: [0, -2, 0, 2, 0], rotate: [0, 2, 0, -2, 0] }, arms: { rotate: [0, -4, 0, 4, 0] }, legs: { y: [0, 2, 0, -1, 0], rotate: [0, -2, 0, 2, 0] }, shift: { torso: [0, -4], arms: [0, -6], legs: [0, 4] } },
  tree: { figure: { y: [0, -4, 0, 2, 0], rotate: [0, 1, 0, -1, 0] }, head: { y: [0, -2, 0, 2, 0], rotate: [0, 1, 0, -1, 0] }, arms: { rotate: [0, -3, 0, 3, 0] }, legs: { y: [0, 2, 0, -1, 0], rotate: [0, 2, 0, -2, 0] }, shift: { torso: [0, -4], arms: [0, -7], legs: [3, 0] } },
  downward_dog: { figure: { y: [0, 4, 0, -3, 0], rotate: [0, -2, 0, 2, 0] }, head: { y: [0, 5, 0, -3, 0], rotate: [0, 4, 0, -4, 0] }, arms: { rotate: [0, 3, 0, -3, 0] }, legs: { y: [0, -2, 0, 2, 0], rotate: [0, 2, 0, -2, 0] }, shift: { torso: [0, 5], arms: [0, 6], legs: [0, -5] } },
  bridge: { figure: { y: [0, -4, 0, 3, 0], rotate: [0, -1, 0, 1, 0] }, head: { y: [0, 2, 0, -1, 0], rotate: [0, -2, 0, 2, 0] }, arms: { rotate: [0, -2, 0, 2, 0] }, legs: { y: [0, -3, 0, 2, 0], rotate: [0, 2, 0, -2, 0] }, shift: { torso: [0, -6], arms: [0, 3], legs: [0, -6] } },
  side_bend: { figure: { y: [0, -3, 0, 3, 0], rotate: [0, -3, 0, 3, 0] }, head: { y: [0, -2, 0, 2, 0], rotate: [0, -5, 0, 5, 0] }, arms: { rotate: [0, -5, 0, 5, 0] }, legs: { y: [0, 1, 0], rotate: [0, 1, 0] }, shift: { torso: [3, 0], arms: [4, -2], legs: [0, 1] } },
  low_lunge: { figure: { y: [0, -3, 0, 2, 0], rotate: [0, 1, 0, -1, 0] }, head: { y: [0, -2, 0, 2, 0], rotate: [0, 2, 0, -2, 0] }, arms: { rotate: [0, -4, 0, 4, 0] }, legs: { y: [0, 2, 0, -1, 0], rotate: [0, -2, 0, 2, 0] } },
  seated_pose: { figure: { y: [0, -3, 0, 2, 0], rotate: [0, -1, 0, 1, 0] }, head: { y: [0, -2, 0, 2, 0], rotate: [0, -4, 0, 4, 0] }, arms: { rotate: [0, -5, 0, 5, 0] }, legs: { y: [0, 1, 0], rotate: [0, 1, 0] } },
  happy_baby: { figure: { y: [0, 3, 0, -2, 0], rotate: [0, -2, 0, 2, 0] }, head: { y: [0, 3, 0, -2, 0], rotate: [0, 2, 0, -2, 0] }, arms: { rotate: [0, 4, 0, -4, 0] }, legs: { y: [0, -4, 0, 3, 0], rotate: [0, 5, 0, -5, 0] } },
  sphinx: { figure: { y: [0, -2, 0, 2, 0], rotate: [0, -1, 0, 1, 0] }, head: { y: [0, -2, 0, 2, 0], rotate: [0, -3, 0, 3, 0] }, arms: { rotate: [0, 1, 0, -1, 0] }, legs: { y: [0, 1, 0], rotate: [0, 1, 0] } },
  pigeon: { figure: { y: [0, 3, 0, -2, 0], rotate: [0, -2, 0, 2, 0] }, head: { y: [0, 2, 0, -2, 0], rotate: [0, -4, 0, 4, 0] }, arms: { rotate: [0, -2, 0, 2, 0] }, legs: { y: [0, 2, 0, -1, 0], rotate: [0, -1, 0, 1, 0] } },
  dancer: { figure: { y: [0, -4, 0, 2, 0], rotate: [0, 2, 0, -2, 0] }, head: { y: [0, -3, 0, 2, 0], rotate: [0, 3, 0, -3, 0] }, arms: { rotate: [0, -4, 0, 4, 0] }, legs: { y: [0, 2, 0, -2, 0], rotate: [0, 3, 0, -3, 0] } },
  wide_fold: { figure: { y: [0, 3, 0, -2, 0], rotate: [0, -1, 0, 1, 0] }, head: { y: [0, 4, 0, -3, 0], rotate: [0, -4, 0, 4, 0] }, arms: { rotate: [0, 3, 0, -3, 0] }, legs: { y: [0, 1, 0], rotate: [0, -1, 0] } },
  figure_four: { figure: { y: [0, -3, 0, 2, 0], rotate: [0, -1, 0, 1, 0] }, head: { y: [0, -2, 0, 2, 0], rotate: [0, -3, 0, 3, 0] }, arms: { rotate: [0, -2, 0, 2, 0] }, legs: { y: [0, -2, 0, 2, 0], rotate: [0, 2, 0, -2, 0] } },
  corpse: { figure: { y: [0, 1, 0, -1, 0], rotate: [0, 0, 0, 0, 0] }, head: { y: [0, 1, 0, -1, 0], rotate: [0, -2, 0, 2, 0] }, arms: { rotate: [0, 1, 0, -1, 0] }, legs: { y: [0, 1, 0], rotate: [0, -1, 0] } },
};

export const YogaPoseVisualizer: React.FC<PoseVisualizerProps> = ({
  pose,
  isResting = false,
  compact = false,
  onClick,
  isActive = false,
}) => {
  const shape = POSE_SHAPES[pose.illustrationKey] || fallbackShape;
  const poseMotion = POSE_MOTIONS[pose.illustrationKey] || POSE_MOTIONS.mountain;
  const isInteractive = Boolean(onClick);
  const motionDuration = compact ? 5 : 4;
  const movementShift = poseMotion.shift || { torso: [0, -4] as [number, number], arms: [0, -5] as [number, number], legs: [0, 2] as [number, number] };

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
            animate={isResting ? { y: [0, 2, 0], rotate: [0, -1, 0] } : poseMotion.figure}
            transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.g
              animate={isResting ? { y: [0, 2, 0], rotate: [0, -1, 0] } : poseMotion.head}
              transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: `${shape.head[0]}px ${shape.head[1]}px` }}
            >
              <circle cx={shape.head[0]} cy={shape.head[1]} r="12" fill="#f0b58f" stroke="#203b45" strokeWidth="3" />
              <circle cx={shape.head[0] + 4} cy={shape.head[1] - 2} r="1.5" fill="#203b45" />
              <path d={`M${shape.head[0] + 4} ${shape.head[1] + 4} q3 2 5 0`} fill="none" stroke="#203b45" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
            <motion.path
              d={shape.torso}
              animate={isResting ? { d: shape.torso } : { d: [shape.torso, shiftPath(shape.torso, movementShift.torso), shape.torso] }}
              transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }}
              fill="none"
              stroke="#203b45"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <motion.path
              d={shape.torso}
              animate={isResting ? { d: shape.torso } : { d: [shape.torso, shiftPath(shape.torso, movementShift.torso), shape.torso] }}
              transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }}
              fill="none"
              stroke="#3f7f7b"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <motion.g
              animate={isResting ? { rotate: [0, 1, 0] } : poseMotion.arms}
              transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '150px 90px' }}
            >
              {shape.arms.map((arm) => {
                const [handX, handY] = getPathEndpoint(arm);
                return (
                  <React.Fragment key={arm}>
                    <motion.path d={arm} animate={isResting ? { d: arm } : { d: [arm, shiftPath(arm, movementShift.arms), arm] }} transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }} fill="none" stroke="#8b4f45" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
                    <motion.path d={arm} animate={isResting ? { d: arm } : { d: [arm, shiftPath(arm, movementShift.arms), arm] }} transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }} fill="none" stroke="#d98a72" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx={handX} cy={handY} r="5" fill="#f0b58f" stroke="#8b4f45" strokeWidth="2" />
                  </React.Fragment>
                );
              })}
            </motion.g>
            <motion.g
              animate={isResting ? { y: [0, 1, 0] } : poseMotion.legs}
              transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }}
            >
              {shape.legs.map((leg) => {
                const [footX, footY] = getPathEndpoint(leg);
                return (
                  <React.Fragment key={leg}>
                    <motion.path d={leg} animate={isResting ? { d: leg } : { d: [leg, shiftPath(leg, movementShift.legs), leg] }} transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }} fill="none" stroke="#8b4f45" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                    <motion.path d={leg} animate={isResting ? { d: leg } : { d: [leg, shiftPath(leg, movementShift.legs), leg] }} transition={{ duration: isResting ? 3 : motionDuration, repeat: Infinity, ease: 'easeInOut' }} fill="none" stroke="#d98a72" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                    <ellipse cx={footX} cy={footY} rx="8" ry="4" fill="#f0b58f" stroke="#8b4f45" strokeWidth="2" />
                  </React.Fragment>
                );
              })}
            </motion.g>
            <path d={shape.ground} fill="none" stroke="#2a9d8f" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          </motion.g>
        </svg>
      </div>
      {!compact && (
        <div className="relative text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
            {isResting ? 'Transition' : 'Follow the moving figure'}
          </span>
          <p className="mt-1 text-sm font-semibold text-zen-900 dark:text-zen-100">{pose.name}</p>
        </div>
      )}
    </div>
  );
};