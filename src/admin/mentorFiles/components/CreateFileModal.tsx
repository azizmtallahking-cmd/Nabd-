/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, X, Folder, Tag, Zap, AlertTriangle, Check } from 'lucide-react';
import { LoadingMode, FileStatus, PathScope, MentorFile } from '../data/mentorFilesSchema';

interface CreateFileModalProps {
  initialFolder: string | null;
  onClose: () => void;
  onCreateFile: (
    newFileData: Omit<MentorFile, 'id' | 'version' | 'changeNotes' | 'lastModified'> & { changeNote: string }
  ) => void;
}

export const CreateFileModal: React.FC<CreateFileModalProps> = ({
  initialFolder,
  onClose,
  onCreateFile
}) => {
  const [displayNameAr, setDisplayNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [folderPath, setFolderPath] = useState(initialFolder || 'Core');
  const [tag, setTag] = useState('Core');
  const [loadingMode, setLoadingMode] = useState<LoadingMode>('always');
  const [loadingCondition, setLoadingCondition] = useState('');
  const [pathScope, setPathScope] = useState<PathScope>('shared');
  const [status, setStatus] = useState<FileStatus>('draft');
  const [changeNote, setChangeNote] = useState('الإصدار التأسيسي الأول للملف المعرفي');
  const [content, setContent] = useState('# عنوان الملف المعرفي الجديد\n\nأدخل التوجيهات والقواعد المعرفية هنا...');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayNameAr.trim()) {
      setError('الرجاء إدخال الاسم المعروض باللغة العربية.');
      return;
    }
    if (!slug.trim()) {
      setError('الرجاء إدخال الاسم البرمجي (slug).');
      return;
    }
    if (!changeNote.trim()) {
      setError('كتابة ملاحظة التغيير التأسيسية إجبارية قبل إنشاء الملف.');
      return;
    }

    onCreateFile({
      displayNameAr: displayNameAr.trim(),
      slug: slug.trim(),
      folderPath: folderPath.trim() || 'Core',
      tag,
      loadingMode,
      loadingCondition: loadingMode === 'on-demand' ? loadingCondition : undefined,
      pathScope,
      status,
      content,
      linkedFileIds: [],
      changeNote: changeNote.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-stone-900 border-2 border-emerald-500/80 rounded-lg max-w-2xl w-full p-5 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
            <Plus className="w-5 h-5" />
            <span>إضافة ملف معرفي جديد للمرشد (Add Mentor File)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded flex items-center gap-2 text-red-200 font-mono">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                الاسم المعروض بالعربية <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={displayNameAr}
                onChange={(e) => setDisplayNameAr(e.target.value)}
                placeholder="مثال: التوجيه في أوقات الشدة"
                className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                الاسم البرمجي (Slug) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="مثال: adversity-guidance"
                className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                مسار المجلد داخل الشجرة
              </label>
              <input
                type="text"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                placeholder="Core أو Paths/Islamic أو Learning..."
                className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                التصنيف الرئيسي (Tag)
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
              >
                <option value="Core">Core</option>
                <option value="Memory Governance">Memory Governance</option>
                <option value="Paths">Paths</option>
                <option value="Learning">Learning</option>
                <option value="Operational">Operational</option>
                <option value="Mentor Emotional States">Mentor Emotional States</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-stone-950 p-3 rounded border border-stone-800">
            <div>
              <label className="block text-stone-300 mb-1 font-mono">حالة التحميل</label>
              <select
                value={loadingMode}
                onChange={(e) => setLoadingMode(e.target.value as LoadingMode)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-stone-100 font-mono"
              >
                <option value="always">always (دائم)</option>
                <option value="path-conditional">path-conditional (شرطي)</option>
                <option value="on-demand">on-demand (عند الطلب)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-300 mb-1 font-mono">مجال المسار</label>
              <select
                value={pathScope}
                onChange={(e) => setPathScope(e.target.value as PathScope)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-stone-100 font-mono"
              >
                <option value="shared">shared (مشترك)</option>
                <option value="islamic-only">islamic-only (إسلامي)</option>
                <option value="general-only">general-only (عام)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-300 mb-1 font-mono">حالة الاعتماد</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FileStatus)}
                className="w-full bg-stone-900 border border-stone-700 rounded p-1.5 text-stone-100 font-mono"
              >
                <option value="draft">draft (مسودة)</option>
                <option value="in-review">in-review (مراجعة)</option>
                <option value="approved">approved (معتمد)</option>
              </select>
            </div>
          </div>

          {loadingMode === 'on-demand' && (
            <div>
              <label className="block text-stone-200 font-semibold mb-1">
                شرط التحميل عند الطلب
              </label>
              <input
                type="text"
                value={loadingCondition}
                onChange={(e) => setLoadingCondition(e.target.value)}
                placeholder="شرط حر يحدد متى يُجلب الملف..."
                className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 font-sans"
              />
            </div>
          )}

          <div>
            <label className="block text-stone-200 font-semibold mb-1">
              ملاحظة الإصدار الأول التأسيسي v1 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="ملاحظة التغيير التأسيسية إجبارية..."
              className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-100 font-sans"
            />
          </div>

          <div>
            <label className="block text-stone-200 font-semibold mb-1">
              المحتوى والتوجيهات الأولوية (Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-100 font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-mono"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded flex items-center gap-1.5 font-mono shadow-[2px_2px_0px_0px_rgba(16,185,129,0.4)]"
            >
              <Check className="w-4 h-4" />
              إنشاء وحفظ الملف v1
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
