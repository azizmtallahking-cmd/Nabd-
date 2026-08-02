/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen } from 'lucide-react';

interface DailyNotebookIconProps {
  unreadCount?: number;
  onClick: () => void;
  className?: string;
}

export const DailyNotebookIcon: React.FC<DailyNotebookIconProps> = ({
  unreadCount = 0,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer select-none transition-all duration-300 hover:scale-105 ${className}`}
      title="افتح دفتر اليوم لاستعراض سجل الحوار كاملاً"
    >
      {/* Leather/Cloth Bound Journal Icon Design */}
      <div className="w-14 h-16 bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 border-2 border-emerald-600/60 rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.8)] p-1.5 flex flex-col justify-between relative overflow-hidden group-hover:border-emerald-400 transition-colors">
        
        {/* Book Spine Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-emerald-950 border-l border-emerald-700/50 flex flex-col justify-around py-1">
          <div className="w-full h-0.5 bg-amber-500/60" />
          <div className="w-full h-0.5 bg-amber-500/60" />
          <div className="w-full h-0.5 bg-amber-500/60" />
        </div>

        {/* Emerald Gold Embossed Emblem */}
        <div className="flex-1 flex flex-col items-center justify-center me-2">
          <div className="w-6 h-6 rounded-full bg-emerald-800/40 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300 group-hover:text-amber-300 transition-colors" />
          </div>
          <span className="text-[8px] font-mono font-bold text-emerald-200 mt-1 tracking-tighter">
            سجل اليوم
          </span>
        </div>

        {/* Bookmark Ribbon Hanging Down */}
        <div className="absolute left-3 -bottom-1 w-2 h-4 bg-amber-500 rounded-b-sm shadow-md" />

        {/* Unread badge if any */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[9px] rounded-full flex items-center justify-center border border-stone-900 animate-bounce">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Shadow base on table */}
      <div className="w-12 h-1.5 bg-black/50 rounded-full blur-sm mx-auto mt-1" />
    </div>
  );
};
