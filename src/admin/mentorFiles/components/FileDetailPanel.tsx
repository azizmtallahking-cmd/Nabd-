/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  X, 
  Save, 
  GitCommit, 
  Link2, 
  FileText, 
  Edit3, 
  Eye, 
  Tag, 
  Zap, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Trash2,
  Folder,
  Layers
} from 'lucide-react';
import { MentorFile, LoadingMode, FileStatus, PathScope } from '../data/mentorFilesSchema';
import { VersionHistory } from './VersionHistory';

interface FileDetailPanelProps {
  file: MentorFile;
  allFiles: MentorFile[];
  onClose: () => void;
  onUpdateFileMeta: (id: string, updates: Partial<MentorFile>) => void;
  onCreateNewVersion: (id: string, noteText: string, newContent?: string, metaUpdates?: Partial<MentorFile>) => void;
  onSelectLinkedFile: (linkedId: string) => void;
  onDeleteFile?: (id: string) => void;
}

export const FileDetailPanel: React.FC<FileDetailPanelProps> = ({
  file,
  allFiles,
  onClose,
  onUpdateFileMeta,
  onCreateNewVersion,
  onSelectLinkedFile,
  onDeleteFile
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'history'>('content');
  const [contentMode, setContentMode] = useState<'edit' | 'preview'>('edit');

  // Form states for active file
  const [content, setContent] = useState(file.content);
  const [displayNameAr, setDisplayNameAr] = useState(file.displayNameAr);
  const [slug, setSlug] = useState(file.slug);
  const [folderPath, setFolderPath] = useState(file.folderPath);
  const [tag, setTag] = useState(file.tag);
  const [loadingMode, setLoadingMode] = useState<LoadingMode>(file.loadingMode);
  const [loadingCondition, setLoadingCondition] = useState(file.loadingCondition || '');
  const [pathScope, setPathScope] = useState<PathScope>(file.pathScope);
  const [status, setStatus] = useState<FileStatus>(file.status);
  const [linkedFileIds, setLinkedFileIds] = useState<string[]>(file.linkedFileIds || []);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync state when selected file changes
  useEffect(() => {
    setContent(file.content);
    setDisplayNameAr(file.displayNameAr);
    setSlug(file.slug);
    setFolderPath(file.folderPath);
    setTag(file.tag);
    setLoadingMode(file.loadingMode);
    setLoadingCondition(file.loadingCondition || '');
    setPathScope(file.pathScope);
    setStatus(file.status);
    setLinkedFileIds(file.linkedFileIds || []);
    setHasUnsavedChanges(false);
  }, [file]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Check unsaved status
  const checkChanges = () => {
    const changed = 
      content !== file.content ||
      displayNameAr !== file.displayNameAr ||
      slug !== file.slug ||
      folderPath !== file.folderPath ||
      tag !== file.tag ||
      loadingMode !== file.loadingMode ||
      loadingCondition !== (file.loadingCondition || '') ||
      pathScope !== file.pathScope ||
      status !== file.status ||
      JSON.stringify(linkedFileIds) !== JSON.stringify(file.linkedFileIds || []);
    setHasUnsavedChanges(changed);
  };

  useEffect(() => {
    checkChanges();
  }, [content, displayNameAr, slug, folderPath, tag, loadingMode, loadingCondition, pathScope, status, linkedFileIds]);

  // Quick save meta/draft (without bumping version)
  const handleQuickSave = () => {
    onUpdateFileMeta(file.id, {
      content,
      displayNameAr,
      slug,
      folderPath,
      tag,
      loadingMode,
      loadingCondition,
      pathScope,
      status,
      linkedFileIds
    });
    setHasUnsavedChanges(false);
    showToast('تم حفظ التغييرات الحالية بنجاح.');
  };

  // Save as new Version (bumps version, asks for mandatory change note)
  const handleSaveNewVersionNote = (noteText: string) => {
    onCreateNewVersion(file.id, noteText, content, {
      displayNameAr,
      slug,
      folderPath,
      tag,
      loadingMode,
      loadingCondition,
      pathScope,
      status,
      linkedFileIds
    });
    setHasUnsavedChanges(false);
    showToast(`تم الترقية إلى الإصدار v${file.version + 1} مع توثيق الملاحظة.`);
  };

  const toggleLinkedFile = (linkedId: string) => {
    setLinkedFileIds(prev => 
      prev.includes(linkedId) ? prev.filter(id => id !== linkedId) : [...prev, linkedId]
    );
  };

  return (
    <div className="bg-stone-900 border-r border-stone-800 text-stone-100 flex flex-col h-full overflow-hidden shadow-2xl relative">
      {/* Top Header */}
      <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
            v{file.version}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-100 font-sans">{file.displayNameAr}</h2>
              <span className="text-[10px] font-mono bg-stone-900 text-stone-400 px-1.5 py-0.5 rounded border border-stone-800">
                {file.slug}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono mt-0.5">
              📁 المسار: {file.folderPath}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-[10px] text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded font-mono animate-pulse">
              تغييرات غير محفوظة
            </span>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            title="إغلاق لوحة التفاصيل"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-stone-800 bg-stone-950/50 px-3 text-xs font-mono select-none">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'content'
              ? 'border-emerald-500 text-emerald-300 font-bold bg-stone-900/50'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          محتوى التوجيه (Content)
        </button>

        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'metadata'
              ? 'border-emerald-500 text-emerald-300 font-bold bg-stone-900/50'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Tag className="w-4 h-4" />
          الحقول الوصفية (Metadata)
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'history'
              ? 'border-amber-500 text-amber-300 font-bold bg-stone-900/50'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <GitCommit className="w-4 h-4 text-amber-400" />
          سجل الإصدارات ({file.changeNotes?.length || 0})
        </button>
      </div>

      {/* Main Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-3 bg-emerald-950 border border-emerald-600 rounded text-xs text-emerald-200 font-mono flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* --- TAB 1: CONTENT EDITOR & PREVIEW --- */}
        {activeTab === 'content' && (
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
              <span className="text-stone-400 font-mono">
                توجيهات المرشد باللغة العربية والفرعية (Markdown)
              </span>

              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded border border-stone-800 font-mono text-[11px]">
                <button
                  onClick={() => setContentMode('edit')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                    contentMode === 'edit'
                      ? 'bg-stone-800 text-emerald-300 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  تحرير (Edit)
                </button>
                <button
                  onClick={() => setContentMode('preview')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                    contentMode === 'preview'
                      ? 'bg-stone-800 text-emerald-300 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  معاينة (Preview)
                </button>
              </div>
            </div>

            {contentMode === 'edit' ? (
              <div className="flex-1 flex flex-col">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-80 bg-stone-950 border border-stone-800 rounded-md p-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                  placeholder="أدخل توجيهات ومبادئ المرشد بأسلوب Markdown..."
                />
                <p className="text-[10px] text-stone-500 font-mono mt-1">
                  ملاحظة: النص الطويل يُعرض بخط قياسي سلس للعين بدلاً من بكسل زخرفي للمراجعة المريحة.
                </p>
              </div>
            ) : (
              <div className="h-80 bg-stone-950 border border-stone-800 rounded-md p-4 overflow-y-auto text-sm leading-relaxed text-stone-200 font-sans prose prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: METADATA FORM --- */}
        {activeTab === 'metadata' && (
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Name */}
              <div>
                <label className="block text-stone-300 font-mono mb-1">
                  الاسم المعروض (Arabic Display Name)
                </label>
                <input
                  type="text"
                  value={displayNameAr}
                  onChange={(e) => setDisplayNameAr(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none font-sans"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-stone-300 font-mono mb-1">
                  الاسم البرمجي (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Folder Path */}
              <div>
                <label className="block text-stone-300 font-mono mb-1">
                  مسار المجلد (Folder Path)
                </label>
                <input
                  type="text"
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none font-mono"
                  placeholder="Core أو Paths/Islamic..."
                />
              </div>

              {/* Tag / Category */}
              <div>
                <label className="block text-stone-300 font-mono mb-1">
                  التصنيف الرئيسي (Tag)
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none font-mono"
                >
                  <option value="Core">Core (أساسي)</option>
                  <option value="Memory Governance">Memory Governance (حوكمة الذاكرة)</option>
                  <option value="Paths">Paths (المسارات)</option>
                  <option value="Learning">Learning (التعلّم)</option>
                  <option value="Operational">Operational (التشغيلي)</option>
                  <option value="Mentor Emotional States">Mentor Emotional States (مواقف المرشد)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-stone-800 pt-3">
              {/* Loading Mode */}
              <div>
                <label className="block text-stone-300 font-mono mb-1">
                  حالة التحميل (Loading Mode)
                </label>
                <select
                  value={loadingMode}
                  onChange={(e) => setLoadingMode(e.target.value as LoadingMode)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none font-mono"
                >
                  <option value="always">always (دائم التحميل)</option>
                  <option value="path-conditional">path-conditional (شرطي المسار)</option>
                  <option value="on-demand">on-demand (عند الطلب)</option>
                </select>
              </div>

              {/* Path Scope */}
              <div>
                <label className="block text-stone-300 font-mono mb-1">
                  مجال المسار (Path Scope)
                </label>
                <select
                  value={pathScope}
                  onChange={(e) => setPathScope(e.target.value as PathScope)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none font-mono"
                >
                  <option value="shared">shared (مشترك)</option>
                  <option value="islamic-only">islamic-only (إسلامي فقط)</option>
                  <option value="general-only">general-only (عام فقط)</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-stone-300 font-mono mb-1">
                  حالة الاعتماد (Status)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FileStatus)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none font-mono"
                >
                  <option value="draft">draft (مسودة)</option>
                  <option value="in-review">in-review (قيد المراجعة)</option>
                  <option value="approved">approved (معتمد)</option>
                </select>
              </div>
            </div>

            {/* Condition Field (Only if on-demand) */}
            {loadingMode === 'on-demand' && (
              <div className="bg-amber-950/30 border border-amber-800/60 rounded p-3">
                <label className="block text-amber-300 font-mono mb-1">
                  شرط التحميل عند الطلب (Loading Condition)
                </label>
                <input
                  type="text"
                  value={loadingCondition}
                  onChange={(e) => setLoadingCondition(e.target.value)}
                  placeholder="مثال: عند سؤال السالك عن مرجع فقهي أو عند انزعاج المرشد..."
                  className="w-full bg-stone-950 border border-stone-700 rounded p-2.5 text-xs text-stone-100 focus:border-amber-500 focus:outline-none font-sans"
                />
              </div>
            )}

            {/* Linked Files Picker Section */}
            <div className="border-t border-stone-800 pt-3">
              <label className="block text-stone-300 font-mono mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-amber-400" />
                  الملفات المرتبطة منطقياً ({linkedFileIds.length})
                </span>
                <span className="text-[10px] text-stone-500 font-mono">انقر للربط/إلغاء الربط</span>
              </label>

              {/* Currently linked chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {linkedFileIds.length === 0 ? (
                  <span className="text-stone-500 text-xs italic">لا توجد ملفات مرتبطة حالياً.</span>
                ) : (
                  linkedFileIds.map(linkedId => {
                    const linked = allFiles.find(f => f.id === linkedId);
                    return (
                      <button
                        key={linkedId}
                        onClick={() => onSelectLinkedFile(linkedId)}
                        className="bg-amber-950/60 hover:bg-amber-900 border border-amber-700/80 text-amber-200 px-2.5 py-1 rounded text-xs flex items-center gap-1.5 font-sans group transition-colors"
                      >
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>{linked ? linked.displayNameAr : linkedId}</span>
                        <span className="text-[10px] text-amber-400 font-mono underline opacity-75 group-hover:opacity-100">
                          انتقال
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Selector checklist */}
              <details className="bg-stone-950 border border-stone-800 rounded p-2 text-xs">
                <summary className="cursor-pointer font-mono text-stone-400 hover:text-stone-200">
                  تعديل قائمة الربط بالملفات الأخرى...
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto space-y-1 pr-1">
                  {allFiles.filter(f => f.id !== file.id).map(f => (
                    <label key={f.id} className="flex items-center gap-2 p-1 hover:bg-stone-900 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={linkedFileIds.includes(f.id)}
                        onChange={() => toggleLinkedFile(f.id)}
                        className="accent-amber-500"
                      />
                      <span className="text-stone-200">{f.displayNameAr}</span>
                      <span className="text-[10px] font-mono text-stone-500">({f.slug})</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>
          </div>
        )}

        {/* --- TAB 3: VERSION HISTORY --- */}
        {activeTab === 'history' && (
          <VersionHistory
            currentVersion={file.version}
            changeNotes={file.changeNotes || []}
            onAddNewVersionNote={handleSaveNewVersionNote}
          />
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
        <div>
          {onDeleteFile && (
            <button
              onClick={() => {
                if (window.confirm(`هل أنت تأكد من حذف الملف المعرفي "${file.displayNameAr}"؟`)) {
                  onDeleteFile(file.id);
                }
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-950/50 p-1.5 rounded border border-red-900/60 flex items-center gap-1"
              title="حذف الملف"
            >
              <Trash2 className="w-4 h-4" />
              حذف
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick save button (saves current draft without version bump) */}
          <button
            onClick={handleQuickSave}
            disabled={!hasUnsavedChanges}
            className={`px-3 py-1.5 rounded border flex items-center gap-1.5 font-bold transition-all ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 border-emerald-400 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.4)]'
                : 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed opacity-60'
            }`}
          >
            <Save className="w-4 h-4" />
            حفظ التغييرات
          </button>

          {/* New version bump trigger button */}
          <button
            onClick={() => setActiveTab('history')}
            className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/60 rounded flex items-center gap-1.5 font-bold transition-all"
          >
            <GitCommit className="w-4 h-4 text-amber-400" />
            اعتماد v{file.version + 1}
          </button>
        </div>
      </div>
    </div>
  );
};
