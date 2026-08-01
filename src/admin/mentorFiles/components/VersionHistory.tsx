/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GitCommit, Plus, Calendar, AlertTriangle, FileText, Check } from 'lucide-react';
import { ChangeNote } from '../data/mentorFilesSchema';

interface VersionHistoryProps {
  currentVersion: number;
  changeNotes: ChangeNote[];
  onAddNewVersionNote: (noteText: string) => void;
  disabled?: boolean;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  currentVersion,
  changeNotes,
  onAddNewVersionNote,
  disabled = false
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) {
      setErrorMsg('كتابة ملاحظة التغيير إجبارية قبل حفظ إصدار جديد.');
      return;
    }

    try {
      onAddNewVersionNote(noteText.trim());
      setNoteText('');
      setErrorMsg('');
      setShowAddModal(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'تعذر حفظ الإصدار الجديد.');
    }
  };

  return (
    <div className="bg-stone-950/60 border border-stone-800 rounded-md p-3 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-stone-200 font-mono">
            سجل الإصدارات والتغييرات (Version History)
          </h4>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
            v{currentVersion}
          </span>
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-xs bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/50 px-2.5 py-1 rounded transition-colors font-mono"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            حفظ إصدار جديد (v{currentVersion + 1})
          </button>
        )}
      </div>

      {/* Timeline list (reverse chronological) */}
      <div className="space-y-3 relative before:absolute before:right-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-800">
        {changeNotes && changeNotes.length > 0 ? (
          changeNotes.map((item, idx) => (
            <div key={idx} className="flex gap-3 relative pr-1">
              {/* Timeline marker node */}
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-bold z-10 flex-shrink-0 ${
                idx === 0
                  ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'bg-stone-900 border-stone-700 text-stone-400'
              }`}>
                v{item.version}
              </div>

              {/* Note Content Box */}
              <div className="flex-1 bg-stone-900/80 border border-stone-800 rounded p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-stone-400" />
                    الإصدار {item.version} {idx === 0 && <span className="text-[10px] text-emerald-400 font-mono">(الأحدث)</span>}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-500" />
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-stone-300 whitespace-pre-line leading-relaxed">
                  {item.note}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-stone-400 text-center py-4">لا يوجد سجل إصدارات سابق لهذا الملف.</p>
        )}
      </div>

      {/* Mandatory Change Note Modal / Form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border-2 border-amber-500/80 rounded-lg max-w-lg w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
                <GitCommit className="w-4 h-4" />
                <span>إضافة ملاحظة التغيير للإصدار v{currentVersion + 1}</span>
              </div>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/80 px-2 py-0.5 rounded font-mono">
                إجباري (Mandatory)
              </span>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1">
                  سبب وتفاصيل التغيير في المحتوى أو البيانات الوصفية <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  rows={4}
                  placeholder="مثال: تم تعديل أسلوب التعامل مع السالك المتردد، وتحديث شروط التوجيه لورد المحاسبة..."
                  className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed font-sans"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-950/80 border border-red-800 rounded flex items-center gap-2 text-xs text-red-200 font-mono">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setErrorMsg('');
                  }}
                  className="px-4 py-1.5 text-xs text-stone-400 hover:text-stone-200 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 font-mono"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-stone-950 font-bold bg-amber-400 hover:bg-amber-300 rounded border border-amber-300 shadow-[2px_2px_0px_0px_rgba(217,119,6,0.5)] flex items-center gap-1.5 font-mono"
                >
                  <Check className="w-4 h-4" />
                  اعتماد الإصدار v{currentVersion + 1}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
