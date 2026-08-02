/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export type MentorPresenceLevel = 'full' | 'reduced' | 'minimal' | 'withdrawn';

interface MentorFigureProps {
  spriteSrc: string;
  presenceLevel?: MentorPresenceLevel;
  onClick?: () => void;
  className?: string;
}

export const MentorFigure: React.FC<MentorFigureProps> = ({
  spriteSrc,
  presenceLevel = 'full',
  onClick,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Map presence level to opacity (0.0 to 1.0)
  const presenceOpacityMap: Record<MentorPresenceLevel, number> = {
    full: 1.0,
    reduced: 0.75,
    minimal: 0.45,
    withdrawn: 0.15,
  };

  const opacity = presenceOpacityMap[presenceLevel];

  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-700 select-none group flex flex-col items-center justify-end ${className}`}
      style={{ opacity }}
      title="المرشد الحكيم"
    >
      {!imageError ? (
        <img
          src={spriteSrc}
          alt="صورة المرشد"
          onError={() => setImageError(true)}
          className="max-h-[360px] w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-[1.01]"
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        /* Standard dignified placeholder frame when sprite image is pending */
        <div className="w-52 h-72 border-2 border-dashed border-emerald-500/50 bg-stone-900/90 backdrop-blur-md rounded-md flex flex-col items-center justify-center p-4 text-center text-stone-300 font-mono shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-stone-800">
          <div className="w-12 h-12 rounded bg-emerald-950 border border-emerald-600/60 flex items-center justify-center mb-3 text-emerald-400 text-xl shadow-inner">
            🧘‍♂️
          </div>
          <span className="text-xs font-bold text-emerald-400 mb-1 font-mono tracking-wide">
            بانتظار صورة المرشد
          </span>
          <span className="text-[10px] text-stone-400 font-mono dir-ltr truncate max-w-full px-1">
            {spriteSrc}
          </span>
          <span className="mt-3 text-[9px] bg-emerald-900/40 text-emerald-300 px-2 py-0.5 border border-emerald-800/60 font-sans">
            حضور كامل (Master Reference)
          </span>
        </div>
      )}

      {/* Subtle indicator halo when hovering */}
      <div className="absolute -bottom-2 w-32 h-2 bg-emerald-500/0 group-hover:bg-emerald-500/20 rounded-full blur-md transition-all duration-300 pointer-events-none" />
    </div>
  );
};
