/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, BookOpen, MessageSquare, Sparkles } from 'lucide-react';

interface UserReplyBarProps {
  onSendMessage: (text: string) => void;
  onOpenNotebook: () => void;
  className?: string;
}

export const UserReplyBar: React.FC<UserReplyBarProps> = ({
  onSendMessage,
  onOpenNotebook,
  className = '',
}) => {
  const [inputText, setInputText] = useState('');

  // Quick suggestion chips for quiet, low-friction reflection
  const quickResponses = [
    'سمعاً وطاعة، سأحرص على النية.',
    'تم ورد اليوم بفضل الله وحمده.',
    'أشعر بشرود اليوم، كيف أستعيد سكينتي؟',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickClick = (phrase: string) => {
    onSendMessage(phrase);
  };

  return (
    <div className={`w-full bg-stone-950/95 border-t border-stone-800/80 backdrop-blur-md px-4 py-3 z-30 flex flex-col gap-2 transition-all ${className}`} dir="rtl">
      {/* Top Header Label - Clear Spatial Separation */}
      <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 max-w-6xl mx-auto w-full px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <span className="font-bold text-amber-200/90 font-sans">شريط حديث السالك (ردك للمرشد):</span>
          <span className="text-stone-500 text-[10px] hidden sm:inline">• مساحة هادئة للحوار والرد المنفصل</span>
        </div>

        {/* Access to full notebook history */}
        <button
          onClick={onOpenNotebook}
          className="flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-mono transition-colors bg-stone-900/80 border border-stone-800 px-2.5 py-0.5 rounded-full"
          title="استعراض سجل اليوم كاملاً"
        >
          <BookOpen className="w-3 h-3" />
          <span>سجل اليوم الكامل</span>
        </button>
      </div>

      {/* Quick Reflection Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-6xl mx-auto w-full no-scrollbar px-1">
        <span className="text-[10px] text-stone-500 font-mono whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-400/70" />
          ردود سريعة:
        </span>
        {quickResponses.map((phrase, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickClick(phrase)}
            className="text-[11px] font-sans text-stone-300 hover:text-amber-200 bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-sm"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* User Text Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-6xl mx-auto w-full px-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب ردك أو تساؤلك للمرشد هنا..."
            className="w-full bg-stone-900/90 border border-stone-800 focus:border-amber-500/60 text-stone-100 placeholder-stone-500 text-xs md:text-sm px-4 py-2.5 rounded-lg focus:outline-none transition-colors font-sans shadow-inner"
          />
          <MessageSquare className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:hover:bg-amber-600 text-stone-950 font-bold text-xs md:text-sm rounded-lg flex items-center gap-2 transition-all font-mono shadow-md whitespace-nowrap"
        >
          <span>إرسال الرد</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
