/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { MentorFile, FileStatus, LoadingMode, PathScope } from '../data/mentorFilesSchema';
import { X, Plus, Upload, FileText, AlertCircle } from 'lucide-react';

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderPaths: string[];
  defaultFolderPath?: string;
  onCreateFile: (newFile: Omit<MentorFile, 'id' | 'lastModified'>) => void;
}

export const CreateFileModal: React.FC<CreateFileModalProps> = ({
  isOpen,
  onClose,
  folderPaths,
  defaultFolderPath = 'Core',
  onCreateFile,
}) => {
  const [displayNameAr, setDisplayNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [folderPath, setFolderPath] = useState(defaultFolderPath);
  const [tag, setTag] = useState('Core');
  const [loadingMode, setLoadingMode] = useState<LoadingMode>('always');
  const [loadingCondition, setLoadingCondition] = useState('');
  const [pathScope, setPathScope] = useState<PathScope>('shared');
  const [status, setStatus] = useState<FileStatus>('in-review');

  // Content input mode: 'upload' or 'paste'
  const [contentMode, setContentMode] = useState<'upload' | 'paste'>('upload');
  const [content, setContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Auto-fill slug from arabic name if empty
  const handleNameChange = (val: string) => {
    setDisplayNameAr(val);
    if (!slug) {
      const generatedSlug = val
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name.toLowerCase();
    if (!name.endsWith('.md') && !name.endsWith('.txt')) {
      setErrorMsg('يرجى رفع ملف بصيغة .md أو .txt فقط');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setContent(text);
        setUploadedFileName(file.name);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayNameAr.trim()) {
      setErrorMsg('اسم الملف بالعربية مطلوب');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('المعرّف التقني (Slug) مطلوب');
      return;
    }

    const hasContent = content && content.trim() !== '';

    onCreateFile({
      displayNameAr: displayNameAr.trim(),
      slug: slug.trim().toLowerCase(),
      folderPath,
      tag: tag.trim() || 'Core',
      loadingMode,
      loadingCondition: loadingMode === 'on-demand' ? loadingCondition : undefined,
      pathScope,
      status: hasContent ? status : undefined,
      linkedFileIds: [],
      content: content || '',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs font-sans">
      <div className="w-full max-w-2xl bg-stone-50 border-2 border-stone-800 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b-2 border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs border border-stone-100">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm font-mono tracking-wide text-stone-100">
              إضافة ملف معرفي جديد إلى غرفة المرشد
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-100 border border-stone-700 hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-100 border border-rose-800 text-rose-900 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Arabic Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-900 font-mono block">
                اسم الملف بالعربية *
              </label>
              <input
                type="text"
                required
                value={displayNameAr}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثال: منهجية العادات الصغرى"
                className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-sans text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-900 font-mono block">
                المعرّف التقني (Slug) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="micro-habits-methodology"
                className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 dir-ltr text-left"
              />
            </div>

            {/* Folder */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-900 font-mono block">
                المجلد المستهدف
              </label>
              <select
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {folderPaths.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-900 font-mono block">
                التصنيف (Tag)
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Loading Mode */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-900 font-mono block">
                نمط التحميل
              </label>
              <select
                value={loadingMode}
                onChange={(e) => setLoadingMode(e.target.value as LoadingMode)}
                className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="always">دائم التحميل (Always)</option>
                <option value="path-conditional">مشروط بالمسار (Path-Conditional)</option>
                <option value="on-demand">عند الطلب (On-Demand)</option>
              </select>
            </div>

            {/* Path Scope */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-900 font-mono block">
                نطاق المسار
              </label>
              <select
                value={pathScope}
                onChange={(e) => setPathScope(e.target.value as PathScope)}
                className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="shared">مشترك (Shared)</option>
                <option value="islamic-only">المسار الإسلامي فقط</option>
                <option value="general-only">المسار العام فقط</option>
              </select>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 font-mono block">
              حالة الملف عند توفر محتوى
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FileStatus)}
              className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="in-review">قيد المراجعة (In Review)</option>
              <option value="approved">معتمد (Approved)</option>
            </select>
            <p className="text-[10px] text-stone-500 font-mono">
              * في حال عدم إدخال محتوى، سيبقى الملف بوضع (فارغ — بانتظار الرفع) تلقائياً.
            </p>
          </div>

          {/* Content Source Selection: Dual Options (Upload or Paste) */}
          <div className="space-y-2 pt-2 border-t-2 border-stone-300">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 font-mono block">
                محتوى الملف الإبتدائي (اختياري)
              </label>

              <div className="flex items-center gap-1 bg-stone-200 p-1 border border-stone-400">
                <button
                  type="button"
                  onClick={() => setContentMode('upload')}
                  className={`px-2.5 py-0.5 text-xs font-mono font-bold transition-all ${
                    contentMode === 'upload'
                      ? 'bg-emerald-500 text-stone-950 border border-stone-900'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  رفع ملف
                </button>
                <button
                  type="button"
                  onClick={() => setContentMode('paste')}
                  className={`px-2.5 py-0.5 text-xs font-mono font-bold transition-all ${
                    contentMode === 'paste'
                      ? 'bg-emerald-500 text-stone-950 border border-stone-900'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  لصق نص
                </button>
              </div>
            </div>

            {contentMode === 'upload' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-5 border-2 border-dashed border-stone-800 bg-stone-100 hover:bg-emerald-50/50 cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-1"
              >
                <Upload className="w-6 h-6 text-emerald-600" />
                <span className="text-xs font-bold font-mono text-stone-900">
                  {uploadedFileName ? `تم اختيار: ${uploadedFileName}` : 'انقر لاختيار ملف (.md أو .txt)'}
                </span>
                <span className="text-[10px] text-stone-500">أو يمكنك ترك الملف فارغاً ورفعه لاحقاً</span>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب أو الصق نص الملف المبدئي هنا..."
                rows={5}
                className="w-full p-2.5 bg-stone-900 text-emerald-400 font-mono text-xs border-2 border-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dir-ltr"
              />
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t-2 border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-mono font-bold border-2 border-stone-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono text-xs font-bold border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء الملف</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
