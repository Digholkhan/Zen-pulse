import React, { useState, useEffect } from 'react';
import { YogaPose, YogaRoutine } from '@/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, SkipForward, CheckCircle2, Activity, Clock, Lightbulb } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { useUserStore } from '@/lib/store/useUserStore';
import { YogaPoseVisualizer } from './YogaPoseVisualizer';

interface YogaRoutineViewProps {
  routine: YogaRoutine;
  onFinish?: () => void;
}

export const YogaPosePreview: React.FC<{ pose: YogaPose }> = ({ pose }) => (
  <div className="space-y-3">
    <YogaPoseVisualizer pose={pose} />
    <div className="px-2 pb-1">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-bold text-base text-zen-900 dark:text-zen-100">{pose.name}</h3>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">{pose.durationSec}s</span>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-zen-600 dark:text-zen-400">{pose.targetArea}</p>
    </div>
  </div>
);

export const YogaRoutineView: React.FC<YogaRoutineViewProps> = ({ routine, onFinish }) => {
  const { recordCompletedSession } = useUserStore();

  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [poseTimerSec, setPoseTimerSec] = useState(routine.poses[0]?.durationSec || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [previewPoseIdx, setPreviewPoseIdx] = useState(0);

  const currentPose = routine.poses[currentPoseIdx];
  const displayedPose = routine.poses[previewPoseIdx] || currentPose;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && poseTimerSec > 0) {
      timer = setInterval(() => {
        setPoseTimerSec((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && poseTimerSec === 0) {
      // Advance logic
      if (isResting) {
        // Rest ended -> Start next pose
        setIsResting(false);
        const nextIdx = currentPoseIdx + 1;
        if (nextIdx < routine.poses.length) {
          setCurrentPoseIdx(nextIdx);
          setPreviewPoseIdx(nextIdx);
          setPoseTimerSec(routine.poses[nextIdx].durationSec);
          audioEngine.playBell(523.25, 2.0);
          audioEngine.speak(routine.poses[nextIdx].name);
        } else {
          // Finished routine
          setIsRunning(false);
          setIsFinished(true);
          audioEngine.playBell(432, 5.0);
          recordCompletedSession('yoga', routine.id, routine.title, routine.durationMins * 60);
          if (onFinish) onFinish();
        }
      } else {
        // Pose ended -> Start rest interval
        if (currentPoseIdx < routine.poses.length - 1 && routine.restBetweenPosesSec > 0) {
          setIsResting(true);
          setPoseTimerSec(routine.restBetweenPosesSec);
          audioEngine.playBell(330, 1.5);
          audioEngine.speak('Rest and change position');
        } else {
          // Last pose done
          setIsRunning(false);
          setIsFinished(true);
          audioEngine.playBell(432, 5.0);
          recordCompletedSession('yoga', routine.id, routine.title, routine.durationMins * 60);
          if (onFinish) onFinish();
        }
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, poseTimerSec, isResting, currentPoseIdx, routine, recordCompletedSession, onFinish]);

  const togglePlay = () => {
    if (!isRunning) {
      setIsRunning(true);
      audioEngine.speak(currentPose.name);
    } else {
      setIsRunning(false);
    }
  };

  const skipNext = () => {
    if (currentPoseIdx < routine.poses.length - 1) {
      const nextIdx = currentPoseIdx + 1;
      setCurrentPoseIdx(nextIdx);
      setPreviewPoseIdx(nextIdx);
      setIsResting(false);
      setPoseTimerSec(routine.poses[nextIdx].durationSec);
    }
  };

  if (isFinished) {
    return (
      <Card className="max-w-lg mx-auto text-center p-8 space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-display font-bold text-zen-900 dark:text-zen-100">
          Routine Completed!
        </h2>
        <p className="text-xs text-zen-600 dark:text-zen-400">
          You completed all {routine.poses.length} movement poses in {routine.title}.
        </p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Practice Again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto p-6 sm:p-8 space-y-6">
      {/* Routine Progress Header */}
      <div className="flex items-center justify-between border-b border-zen-200/50 dark:border-zen-800/50 pb-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-zen-500">
            Movement {currentPoseIdx + 1} of {routine.poses.length}
          </span>
          <h2 className="text-xl font-display font-semibold text-zen-900 dark:text-zen-100">
            {routine.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zen-100 dark:bg-zen-900 text-xs font-semibold text-zen-700 dark:text-zen-300">
          <Activity className="w-4 h-4 text-zen-500" />
          <span>{routine.difficulty}</span>
        </div>
      </div>

      {/* Main Pose Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-zen-500/10 via-teal-500/5 to-emerald-500/10 border border-zen-500/20 text-center space-y-4">
        <div className="inline-flex px-3 py-1 rounded-full bg-zen-500 text-white dark:bg-zen-400 dark:text-zen-950 text-xs font-bold uppercase tracking-wider">
          {isResting ? 'Rest & Transition' : displayedPose.name}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_190px] lg:items-center text-left">
          <YogaPoseVisualizer pose={displayedPose} isResting={isResting} />
          <div className="text-center lg:text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zen-500">Time remaining</span>
            <div className="font-display font-extrabold text-5xl sm:text-6xl text-zen-900 dark:text-zen-100 py-2">
              {formatTime(poseTimerSec)}
            </div>
            {previewPoseIdx !== currentPoseIdx && !isResting && (
              <p className="text-[11px] text-zen-500">Previewing another position</p>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm font-medium text-zen-700 dark:text-zen-300 leading-relaxed max-w-md mx-auto">
          {isResting ? 'Take a deep breath and prepare for the next movement pose.' : displayedPose.instructions}
        </p>

        {!isResting && (
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-zen-900/60 border border-zen-200/60 dark:border-zen-800/60 text-left flex items-start gap-2 text-xs">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-zen-600 dark:text-zen-400">{displayedPose.tips}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zen-500">All positions</span>
          <span className="text-[10px] text-zen-500">Select a pose to view it</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {routine.poses.map((pose, idx) => (
            <div key={pose.id} className="shrink-0 w-[112px]">
              <YogaPoseVisualizer
                pose={pose}
                compact
                isActive={idx === previewPoseIdx}
                onClick={() => setPreviewPoseIdx(idx)}
              />
              <p className="mt-1 truncate text-center text-[10px] font-semibold text-zen-600 dark:text-zen-400">{idx + 1}. {pose.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs font-medium text-zen-500">
          Target: <span className="text-zen-800 dark:text-zen-200 font-semibold">{displayedPose.targetArea}</span>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={togglePlay} variant="primary" className="gap-2 px-6">
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause Pose' : 'Start Pose'}</span>
          </Button>

          <Button onClick={skipNext} variant="ghost" title="Skip to next pose">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
