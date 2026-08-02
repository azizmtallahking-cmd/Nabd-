/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  MentorFile,
  FileStatus,
  LoadingMode,
  PathScope,
} from '../data/mentorFilesSchema';
import {
  FileText,
  Upload,
  Download,
  Save,
  Trash2,
  X,
  FileCode,
  Tag,
  Sliders,
  CheckCircle,
  AlertCircle,
  Clock,
  Copy,
  Check,
} from 'lucide-react';

interface FileDetailPanelProps {
  file: MentorFile;
  allFiles: MentorFile[];
  onClose: () => void;
  onUpdateMetadata: (id: string, updates: Partial<MentorFile>) => void;
  onUpdateContent: (id: string, content: string) => void;
  onUploadContent: (id: string, file: File) => Promise<void>;
  onDownloadContent: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

export const FileDetailPanel: React.FC<FileDetailPanelProps> = ({
  file,
  allFiles,
  onClose,
  onUpdateMetadata,
  onUpdateContent,
  onUploadContent,
  onDownloadContent,
  onDeleteFile,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'metadata'>('content');
  const [contentInputMode, setContentInputMode] = useState<'paste' | 'upload'>('upload');

  // Local state for direct text paste/editing
  const [pastedText, setPastedText] = useState<string>(file.content || '');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync pastedText if file changes
  React.useEffect(() => {
    setPastedText(file.content || '');
    setUploadSuccess(null);
    setUploadError(null);
  }, [file.id, file.content]);

  // Handle file drop or selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check extension
    const name = selectedFile.name.toLowerCase();
    if (!name.endsWith('.md') && !name.endsWith('.txt')) {
      setUploadError('يرجى اختيار ملف بأسلوب .md أو .txt فقط');
      return;
    }

    try {
      setUploadError(null);
      await onUploadContent(file.id, selectedFile);
      setUploadSuccess(`تم رفع الملف واستبدال المحتوى بنجاح (${selectedFile.name})`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setUploadError('حدث خطأ أثناء قراءة الملف المرفوع');
    }
  };

  const handleSavePastedText = () => {
    onUpdateContent(file.id, pastedText);
    setUploadSuccess('تم حفظ النص واستبدال محتوى الملف بنجاح');
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(file.content || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] font-sans">
      {/* Header */}
      <div className="p-4 bg-stone-900 text-stone-100 border-b-2 border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 text-stone-950 border-2 border-stone-100 flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-wide text-stone-100 font-mono">
              {file.displayNameAr}
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-mono dir-ltr text-right">
              <span>{file.folderPath}/{file.slug}.md</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDeleteFile(file.id)}
            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-rose-100 text-xs font-mono border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 transition-all active:translate-x-[1px] active:translate-y-[1px]"
            title="حذف الملف"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border-2 border-stone-700 transition-all"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Bar Info */}
      <div className="px-4 py-2 bg-stone-200 border-b-2 border-stone-800 flex flex-wrap items-center justify-between text-xs font-mono text-stone-800 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-2 py-0.5 bg-stone-900 text-emerald-400 border border-stone-800 font-bold">
            الحالة: {!file.content || file.content.trim() === '' || !file.status ? 'فارغ (بانتظار الرفع)' : file.status === 'in-review' ? 'قيد المراجعة' : 'معتمد'}
          </span>
          <span className="px-2 py-0.5 bg-stone-300 border border-stone-400 text-stone-800">
            النمط: {file.loadingMode === 'always' ? 'دائم التحميل' : file.loadingMode === 'path-conditional' ? 'مشروط بالمسار' : 'عند الطلب'}
          </span>
          <span className="px-2 py-0.5 bg-stone-300 border border-stone-400 text-stone-800">
            المجال: {file.pathScope === 'shared' ? 'مشترك' : file.pathScope === 'islamic-only' ? 'إسلامي فقط' : 'عام فقط'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-stone-600">
          <Clock className="w-3.5 h-3.5" />
          <span>آخر تحديث: {new Date(file.lastModified).toLocaleString('ar-SA')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-stone-800 bg-stone-100">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold font-mono flex items-center justify-center gap-2 border-r-2 border-stone-800 transition-colors ${
            activeTab === 'content'
              ? 'bg-emerald-950 text-emerald-300 border-b-2 border-b-emerald-500'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>تحديث ومحتوى الملف</span>
        </button>

        <button
          onClick={() => setActiveTab('metadata')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'metadata'
              ? 'bg-emerald-950 text-emerald-300 border-b-2 border-b-emerald-500'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>خصائص وتصنيف الملف (يدوي)</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 bg-stone-50">
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Download Button Banner */}
            <div className="p-3 bg-stone-100 border-2 border-stone-800 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-stone-900 font-mono">تنزيل المحتوى الحالي للملف</p>
                <p className="text-[11px] text-stone-600">يمكنك تنزيل النسخة الحالية لتعديلها في أداة خارجية ثم إعادة رفعها.</p>
              </div>
              <button
                onClick={() => onDownloadContent(file.id)}
                disabled={!file.content}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-emerald-400 border-2 border-stone-900 text-xs font-mono flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل (.md)</span>
              </button>
            </div>

            {/* Input Mode Switcher: Upload File vs Paste Text */}
            <div className="p-4 bg-stone-200 border-2 border-stone-800 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 font-mono">طريقة تحديث المحتوى:</span>
                <div className="flex items-center gap-1 bg-stone-200 p-1 border border-stone-400">
                  <button
                    type="button"
                    onClick={() => setContentInputMode('upload')}
                    className={`px-3 py-1 text-xs font-mono font-bold transition-all ${
                      contentInputMode === 'upload'
                        ? 'bg-emerald-500 text-stone-950 border border-stone-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    رفع ملف (.md / .txt)
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentInputMode('paste')}
                    className={`px-3 py-1 text-xs font-mono font-bold transition-all ${
                      contentInputMode === 'paste'
                        ? 'bg-emerald-500 text-stone-950 border border-stone-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    لصق/كتابة نص مباشر
                  </button>
                </div>
              </div>

              {/* Upload Option */}
              {contentInputMode === 'upload' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-700 leading-relaxed">
                    قم برفع ملف نصي (.md أو .txt) من جهازك ليتم استبدال محتوى حقل <code className="bg-stone-300 px-1 font-mono text-emerald-950 font-bold">content</code> بالكامل تلقائياً.
                  </p>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-stone-800 bg-stone-100 hover:bg-emerald-50/50 cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <Upload className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-stone-900 font-mono">
                      انقر هنا لاختيار ملف من جهازك (.md أو .txt)
                    </p>
                    <p className="text-[11px] text-stone-500">
                      سيتم تحديث المحتوى وتاريخ التعديل فوراً عند اختيار الملف.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Paste Text Option */}
              {contentInputMode === 'paste' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-700 leading-relaxed">
                    يمكنك كتابة أو لصق نص الملف مباشرة في مربع النص أدناه. كخيار بديل أسرع لا يتطلب حفظ ملف خارجي أولاً.
                  </p>

                  <div className="relative">
                    <textarea
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="أدخل نص الملف هنا..."
                      rows={12}
                      className="w-full p-3 font-mono text-xs bg-stone-900 text-emerald-400 border-2 border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed resize-y"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSavePastedText}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-stone-100 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ النص المباشر</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Alert Feedback */}
              {uploadSuccess && (
                <div className="mt-3 p-2.5 bg-emerald-100 border border-emerald-800 text-emerald-900 text-xs font-mono flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}
              {uploadError && (
                <div className="mt-3 p-2.5 bg-rose-100 border border-rose-800 text-rose-900 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Current View Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 font-mono">
                  معاينة المحتوى المخزَّن حالياً ({file.content ? `${file.content.length} حرف` : 'فارغ'}):
                </span>
                {file.content && (
                  <button
                    onClick={handleCopyContent}
                    className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-mono border border-stone-600 flex items-center gap-1"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ المحتوى</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {file.content ? (
                <pre className="p-4 bg-stone-900 text-emerald-400 font-mono text-xs border-2 border-stone-800 overflow-x-auto whitespace-pre-wrap max-h-96 leading-relaxed dir-ltr text-left">
                  {file.content}
                </pre>
              ) : (
                <div className="p-8 border-2 border-dashed border-stone-400 bg-stone-100 text-center text-stone-500 font-mono text-xs">
                  هذا الملف حالياً فارغ بلا محتوى مخزن. استخدم رفع الملف أو لصق النص أعلاه لإضافة المحتوى.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            <p className="text-xs text-emerald-400 font-mono bg-stone-900 p-3 border-2 border-stone-800 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
              ملاحظة إلزامية: حقول التصنيف والشروط تُدخل يدوياً بالكامل من قبل المدير. لا يوجد أي استنتاج تلقائي للمعلومات من محتوى الملف.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-900 font-mono block">
                  الاسم المعروض (بالعربية):
                </label>
                <input
                  type="text"
                  value={file.displayNameAr}
                  onChange={(e) => onUpdateMetadata(file.id, { displayNameAr: e.target.value })}
                  className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-sans text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Tag */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-900 font-mono block">
                  التصنيف الرئيسي (Tag):
                </label>
                <input
                  type="text"
                  value={file.tag}
                  onChange={(e) => onUpdateMetadata(file.id, { tag: e.target.value })}
                  className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-900 font-mono block">
                  حالة الملف (Status):
                </label>
                <select
                  value={file.status || 'in-review'}
                  onChange={(e) => onUpdateMetadata(file.id, { status: e.target.value as FileStatus })}
                  className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="in-review">قيد المراجعة (In Review)</option>
                  <option value="approved">معتمد (Approved)</option>
                </select>
              </div>

              {/* Loading Mode */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-900 font-mono block">
                  نمط التحميل (Loading Mode):
                </label>
                <select
                  value={file.loadingMode}
                  onChange={(e) => onUpdateMetadata(file.id, { loadingMode: e.target.value as LoadingMode })}
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
                  نطاق المسار (Path Scope):
                </label>
                <select
                  value={file.pathScope}
                  onChange={(e) => onUpdateMetadata(file.id, { pathScope: e.target.value as PathScope })}
                  className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="shared">مشترك (Shared - للجميع)</option>
                  <option value="islamic-only">المسار الإسلامي فقط (Islamic Only)</option>
                  <option value="general-only">المسار العام فقط (General Only)</option>
                </select>
              </div>

              {/* Folder Path */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-900 font-mono block">
                  المجلد المستهدف:
                </label>
                <input
                  type="text"
                  value={file.folderPath}
                  onChange={(e) => onUpdateMetadata(file.id, { folderPath: e.target.value })}
                  className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Custom Condition text if on-demand */}
            {file.loadingMode === 'on-demand' && (
              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-stone-900 font-mono block">
                  شرط التحميل عند الطلب (Loading Condition):
                </label>
                <textarea
                  value={file.loadingCondition || ''}
                  onChange={(e) => onUpdateMetadata(file.id, { loadingCondition: e.target.value })}
                  rows={2}
                  placeholder="مثال: عند استفسار السالك عن مرجع أو كتاب محدد..."
                  className="w-full p-2 bg-stone-100 border-2 border-stone-800 text-xs font-sans text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
