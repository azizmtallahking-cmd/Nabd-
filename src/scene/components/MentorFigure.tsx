/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PixelMentorCanvas } from './PixelMentorCanvas';
import { useLivingMentor } from '../hooks/useLivingMentor';
import {
  MentorAnimState,
  OutfitCategory,
  HeldObject,
  MentorPresenceLevel,
  MentorState,
  OUTFIT_CONFIGS,
} from '../types/mentorSystem';
import { Shirt, Hand, Activity, Eye, Sparkles, ChevronDown } from 'lucide-react';

export type { MentorPresenceLevel };

import { TimeOfDayInfo } from '../hooks/useTimeOfDayLighting';

export interface MentorFigureProps {
  presenceLevel?: MentorPresenceLevel;
  animState?: MentorAnimState;
  outfit?: OutfitCategory;
  heldObject?: HeldObject;
  mentorState?: MentorState;
  onClick?: () => void;
  onAnimStateChange?: (state: MentorAnimState) => void;
  onOutfitChange?: (outfit: OutfitCategory) => void;
  onHeldObjectChange?: (object: HeldObject) => void;
  timeInfo?: TimeOfDayInfo;
  className?: string;
  showControls?: boolean;
}

export const MentorFigure: React.FC<MentorFigureProps> = ({
  presenceLevel = 'full',
  animState,
  outfit,
  heldObject,
  mentorState: externalMentorState,
  onClick,
  onAnimStateChange,
  onOutfitChange,
  onHeldObjectChange,
  timeInfo,
  className = '',
  showControls = true,
}) => {
  // Use internal programmable state engine if no external state object provided
  const internalMentor = useLivingMentor({
    initialState: animState || 'IDLE',
    initialOutfit: outfit || 'default',
    initialHeldObject: heldObject || 'prayer_beads',
    initialPresence: presenceLevel,
  });

  const activeMentorState: MentorState = externalMentorState || internalMentor.mentorState;

  // Control panel toggle for modular customization (outfit, held object, anim state)
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const handleAnimChange = (state: MentorAnimState) => {
    internalMentor.setAnimState(state);
    if (onAnimStateChange) onAnimStateChange(state);
  };

  const handleOutfitSelect = (newOutfit: OutfitCategory) => {
    internalMentor.setOutfit(newOutfit);
    if (onOutfitChange) onOutfitChange(newOutfit);
  };

  const handleHeldObjectSelect = (newObject: HeldObject) => {
    internalMentor.setHeldObject(newObject);
    if (onHeldObjectChange) onHeldObjectChange(newObject);
  };

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-end ${className}`}
      dir="rtl"
    >
      {/* 1. LIVING PIXEL MENTOR CANVAS RENDERER */}
      <div
        onClick={onClick}
        className="cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex flex-col items-center group"
        title="المرشد الحكيم — انقر للاستماع للتوجيه"
      >
        <PixelMentorCanvas
          mentorState={activeMentorState}
          timeInfo={timeInfo}
          width={256}
          height={384}
        />

        {/* Status Badge below character */}
        <div className="mt-2 flex items-center gap-1.5 bg-stone-900/90 border border-stone-800 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-[11px] font-mono font-bold text-emerald-300">
            المرشد الرقمي
          </span>
          <span className="text-[10px] font-sans text-stone-400">
            • {OUTFIT_CONFIGS[activeMentorState.appearance.outfit]?.nameArShort || 'حي'}
          </span>
        </div>
      </div>

      {/* 2. MODULAR MENTOR SYSTEM CONTROL TRAY (For Contextual Customization) */}
      {showControls && (
        <div className="mt-3 w-full max-w-xs z-20">
          <button
            onClick={() => setIsControlsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] font-mono text-stone-300 hover:text-emerald-300 bg-stone-900/90 hover:bg-stone-800/90 border border-stone-800 px-3 py-1.5 rounded-lg transition-all shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>تخصيص نظام المرشد البرمجي</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isControlsOpen ? 'rotate-180 text-emerald-400' : 'text-stone-500'
              }`}
            />
          </button>

          {isControlsOpen && (
            <div className="mt-2 p-3 bg-stone-950/95 border border-stone-800 rounded-xl backdrop-blur-md flex flex-col gap-3 shadow-2xl animate-fadeIn text-xs">
              
              {/* Animation State Selector */}
              <div>
                <label className="text-[10px] font-mono text-stone-400 flex items-center gap-1 mb-1.5">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>حالة الحركة البرمجية (Animation State):</span>
                </label>
                <div className="grid grid-cols-3 gap-1 font-sans">
                  {[
                    { id: 'IDLE', label: 'سكون (Idle)' },
                    { id: 'LISTENING', label: 'إصغاء (Listening)' },
                    { id: 'THINKING', label: 'تفكير (Thinking)' },
                    { id: 'SPEAKING', label: 'حديث (Speaking)' },
                    { id: 'SILENT', label: 'صمت تام (Silent)' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleAnimChange(st.id as MentorAnimState)}
                      className={`px-2 py-1 rounded text-[10px] transition-all font-mono border ${
                        activeMentorState.animState === st.id
                          ? 'bg-emerald-600 text-stone-950 font-bold border-emerald-400 shadow-sm'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contextual Outfit Selector */}
              <div>
                <label className="text-[10px] font-mono text-stone-400 flex items-center gap-1 mb-1.5">
                  <Shirt className="w-3 h-3 text-amber-400" />
                  <span>نظام الكساء والهيئة (Outfit System):</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(OUTFIT_CONFIGS) as OutfitCategory[]).map((key) => {
                    const cfg = OUTFIT_CONFIGS[key];
                    const isSelected = activeMentorState.appearance.outfit === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleOutfitSelect(key)}
                        className={`px-2.5 py-1.5 rounded text-[11px] text-right font-sans transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 border-amber-500/60 font-bold'
                            : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                        }`}
                      >
                        <span>{cfg.nameArShort}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-stone-700 shadow-inner"
                          style={{ backgroundColor: cfg.palette.primaryRobe }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Handheld Object Selector */}
              <div>
                <label className="text-[10px] font-mono text-stone-400 flex items-center gap-1 mb-1.5">
                  <Hand className="w-3 h-3 text-emerald-400" />
                  <span>العنصر المحمول (Handheld Object):</span>
                </label>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-sans">
                  {[
                    { id: 'prayer_beads', label: 'مسبحة' },
                    { id: 'book', label: 'مخطوطة' },
                    { id: 'walking_stick', label: 'عصا' },
                    { id: 'notebook', label: 'دفتر وقلم' },
                    { id: 'cup', label: 'كوب' },
                    { id: 'none', label: 'بدون' },
                  ].map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => handleHeldObjectSelect(obj.id as HeldObject)}
                      className={`px-2 py-1 rounded transition-all border font-mono ${
                        activeMentorState.appearance.heldObject === obj.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                      }`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};
