/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import {
  MentorAnimState,
  OutfitCategory,
  HeldObject,
  MentorPresenceLevel,
  MentorState,
  OUTFIT_CONFIGS,
} from '../types/mentorSystem';

export interface UseLivingMentorOptions {
  initialState?: MentorAnimState;
  initialOutfit?: OutfitCategory;
  initialHeldObject?: HeldObject;
  initialPresence?: MentorPresenceLevel;
}

export function useLivingMentor(options: UseLivingMentorOptions = {}) {
  const [animState, setAnimState] = useState<MentorAnimState>(options.initialState || 'IDLE');
  const [outfit, setOutfit] = useState<OutfitCategory>(options.initialOutfit || 'default');
  const [heldObject, setHeldObject] = useState<HeldObject>(options.initialHeldObject || 'prayer_beads');
  const [presenceLevel, setPresenceLevel] = useState<MentorPresenceLevel>(options.initialPresence || 'full');
  
  const [isBlinking, setIsBlinking] = useState(false);
  const [breathTick, setBreathTick] = useState(0);

  // 1. Continuous Breathing Cycle (Subtle 60fps or 20fps pixel tick)
  useEffect(() => {
    // If SILENT, we do minimal breathing without attention-seeking movements
    const tickRateMs = animState === 'SILENT' ? 1200 : 400;
    
    const interval = setInterval(() => {
      setBreathTick((prev) => (prev + 1) % 1000);
    }, tickRateMs);

    return () => clearInterval(interval);
  }, [animState]);

  // 2. Random Gentle Eye Blink Timer (Random interval 4s-9s)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      // SILENT state blinks less frequently
      const delayMs = animState === 'SILENT' ? 8000 + Math.random() * 6000 : 4000 + Math.random() * 5000;
      
      timer = setTimeout(() => {
        setIsBlinking(true);
        // Eyelid remains closed for 150ms
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150);
      }, delayMs);
    };

    scheduleNextBlink();

    return () => clearTimeout(timer);
  }, [animState]);

  // Helper actions to interface with external AI brain or user triggers
  const triggerListening = useCallback(() => {
    setAnimState('LISTENING');
  }, []);

  const triggerThinking = useCallback(() => {
    setAnimState('THINKING');
  }, []);

  const triggerSpeaking = useCallback(() => {
    setAnimState('SPEAKING');
  }, []);

  const triggerIdle = useCallback(() => {
    setAnimState('IDLE');
  }, []);

  const triggerSilent = useCallback(() => {
    setAnimState('SILENT');
  }, []);

  const activePalette = OUTFIT_CONFIGS[outfit]?.palette || OUTFIT_CONFIGS.default.palette;

  const mentorState: MentorState = {
    animState,
    presenceLevel,
    appearance: {
      outfit,
      heldObject,
      palette: activePalette,
    },
    isBlinking,
    breathTick,
  };

  return {
    mentorState,
    animState,
    outfit,
    heldObject,
    presenceLevel,
    setAnimState,
    setOutfit,
    setHeldObject,
    setPresenceLevel,
    triggerListening,
    triggerThinking,
    triggerSpeaking,
    triggerIdle,
    triggerSilent,
  };
}
