/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChalkboardState } from '../data/chalkboardSchema';

interface ChalkboardProps {
  state: ChalkboardState;
  onInteract?: () => void;
  className?: string;
}

export const Chalkboard: React.FC<ChalkboardProps> = ({
  state,
  onInteract,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isErasing, setIsErasing] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    // When current message changes, simulate a brief chalk erasure transition
    setIsErasing(true);
    const eraseTimer = setTimeout(() => {
      setIsErasing(false);
      setDisplayedText('');

      let index = 0;
      const targetText = state.currentMessage;
      
      const interval = setInterval(() => {
        if (index < targetText.length) {
          setDisplayedText(targetText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 35); // 35ms per character typing pace

      return () => clearInterval(interval);
    }, 250);

    return () => clearTimeout(eraseTimer);
  }, [state.currentMessage]);

  const isFullyTyped = displayedText.length === state.currentMessage.length && !isErasing;

  return (
    <div
      onClick={onInteract}
      className={`relative group cursor-pointer select-none transition-all duration-300 ${className}`}
      title="انقر على السبورة للتفاعل والاستماع للمزيد"
    >
      {/* Wooden Frame */}
      <div className="p-3 bg-gradient-to-b from-amber-900 via-amber-950 to-stone-900 border-4 border-amber-950 rounded-sm shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.1)] relative">
        {/* Brass Corner Caps */}
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-amber-500/60" />
        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-amber-500/60" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-amber-500/60" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-amber-500/60" />

        {/* Chalk Slate Canvas Surface */}
        <div className="w-full h-full min-h-[170px] bg-[#11221b] border border-emerald-950 rounded-[2px] p-4 relative overflow-hidden flex flex-col justify-between shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
          
          {/* Subtle Chalk Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 80%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 3px)',
            }}
          />

          {/* Erasing Dust Overlay */}
          {isErasing && (
            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] transition-opacity duration-200 z-10 flex items-center justify-center">
              <span className="text-[10px] text-emerald-300/60 font-mono tracking-widest animate-pulse">
                [ مسح وتحديث السبورة... ]
              </span>
            </div>
          )}

          {/* Main Goal Header Section */}
          <div className="border-b border-emerald-800/40 pb-2 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-300/80 uppercase">
                غاية اليوم:
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-100 tracking-wide font-sans bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-700/30">
              {state.mainGoalText}
            </span>
          </div>

          {/* Dynamic Dialogue Message (Typewriter Chalk Text) */}
          <div className="flex-1 flex items-center justify-center py-2 text-center">
            <p className="text-sm md:text-base font-medium text-stone-100 leading-relaxed font-sans text-shadow-chalk tracking-wide max-w-md">
              {displayedText}
              {!isFullyTyped && (
                <span className="inline-block w-2 h-4 bg-emerald-300/80 ms-1 animate-pulse" />
              )}
            </p>
          </div>

          {/* Bottom Chalk Tray & Chalk Dust Footer */}
          <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between text-[10px] text-emerald-400/60 font-mono">
            <span>[ السبورة التوجيهية ]</span>
            <div className="flex items-center gap-1">
              <span className="w-4 h-1 bg-amber-100/70 rounded-sm shadow-sm" title="طباشير أبيض" />
              <span className="w-3 h-1 bg-emerald-200/60 rounded-sm shadow-sm" title="طباشير أخضر" />
              <span className="text-[9px] text-emerald-500/80 font-sans ms-1 group-hover:text-emerald-300 transition-colors">
                انقر للتفاعل ✦
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chalk Tray Piece underneath frame */}
      <div className="mx-auto w-3/4 h-2 bg-amber-950 border-x border-b border-amber-900/80 rounded-b shadow-md flex items-center justify-center gap-4 px-2">
        <div className="w-6 h-1 bg-stone-200/80 rounded-full shadow-inner" />
        <div className="w-3 h-1 bg-emerald-300/80 rounded-full shadow-inner" />
      </div>
    </div>
  );
};
