import React, { useState, useEffect } from 'react';
import { YogaRoutine } from '@/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, SkipForward, CheckCircle2, Activity, Clock, Lightbulb } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { useUserStore } from '@/lib/store/useUserStore';

interface YogaRoutineViewProps {
  routine: YogaRoutine;
  onFinish?: () => void;
}

export const YogaRoutineView: React.FC<YogaRoutineViewProps> = ({ routine, onFinish }) => {
  const { recordCompletedSession } = useUserStore();

  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [poseTimerSec, setPoseTimerSec] = useState(routine.poses[0]?.durationSec || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentPose = routine.poses[currentPoseIdx];

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
          {isResting ? 'Rest & Transition' : currentPose.name}
        </div>

        <div className="font-display font-extrabold text-5xl sm:text-6xl text-zen-900 dark:text-zen-100 py-2">
          {formatTime(poseTimerSec)}
        </div>

        <p className="text-xs sm:text-sm font-medium text-zen-700 dark:text-zen-300 leading-relaxed max-w-md mx-auto">
          {isResting ? 'Take a deep breath and prepare for the next movement pose.' : currentPose.instructions}
        </p>

        {!isResting && (
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-zen-900/60 border border-zen-200/60 dark:border-zen-800/60 text-left flex items-start gap-2 text-xs">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-zen-600 dark:text-zen-400">{currentPose.tips}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs font-medium text-zen-500">
          Target: <span className="text-zen-800 dark:text-zen-200 font-semibold">{currentPose.targetArea}</span>
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
