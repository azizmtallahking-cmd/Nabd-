/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DailyNotebookState, NotebookMessage } from '../data/notebookSchema';
import { X, BookOpen, Send, Calendar, Archive } from 'lucide-react';

interface DailyNotebookModalProps {
  state: DailyNotebookState;
  onClose: () => void;
  onSendMessage?: (text: string) => void;
}

export const DailyNotebookModal: React.FC<DailyNotebookModalProps> = ({
  state,
  onClose,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  if (!state.isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (onSendMessage) {
      onSendMessage(inputText.trim());
    }
    setInputText('');
  };

  /**
   * Extension point for future archiving logic:
   * When the calendar date advances (e.g. state.date !== currentDate),
   * this state will automatically freeze and archive into Firestore/Local Storage.
   */
  const handleArchiveSyncHook = () => {
    console.log(`[Notebook Archive Sync Hook]: Today's record (${state.date}) ready for persistence.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 dir-rtl animate-fadeIn">
      {/* Journal Book Container */}
      <div className="w-full max-w-2xl bg-stone-900 border-2 border-emerald-600/60 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] overflow-hidden text-stone-100 font-sans relative">
        
        {/* Top Header */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-100 text-sm font-mono flex items-center gap-2">
                <span>دفتر الحوار اليومي</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  سجل اليوم الحقيقي
                </span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-400 font-mono mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>التاريخ: {state.date}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 rounded border border-stone-800 transition-colors"
            title="إغلاق الدفتر"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Stream (Messages) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950">
          {state.messages.length === 0 ? (
            <div className="py-12 text-center text-stone-500 font-mono text-xs">
              لا توجد تدوينات محفوظة في دفتر اليوم حتى الآن.
            </div>
          ) : (
            state.messages.map((msg) => {
              const isMentor = msg.sender === 'mentor';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMentor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-stone-400">
                    <span className={isMentor ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {isMentor ? 'المرشد الحكيم' : 'أنت (السالك)'}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-lg max-w-[85%] text-sm leading-relaxed ${
                      isMentor
                        ? 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-100 rounded-tr-none'
                        : 'bg-stone-800 border border-stone-700 text-stone-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب تدوينتك أو ردك للمرشد هنا..."
            className="flex-1 bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 px-3 py-2 text-xs rounded focus:outline-none focus:border-emerald-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-stone-950 font-bold text-xs rounded flex items-center gap-1.5 transition-colors font-mono"
          >
            <span>إرسال</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Archiving Extension Point Footer Notice */}
        <div className="px-4 py-1.5 bg-stone-900 border-t border-stone-800/60 text-[10px] text-stone-500 font-mono flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Archive className="w-3 h-3 text-emerald-500" />
            <span>نقطة أرشفة معلقة: سيتم ترحيل سجل اليوم تلقائياً عند انقضاء منتصف الليل.</span>
          </div>
          <button
            type="button"
            onClick={handleArchiveSyncHook}
            className="hover:text-emerald-400 underline transition-colors"
          >
            اختبار خطة الأرشفة
          </button>
        </div>
      </div>
    </div>
  );
};
