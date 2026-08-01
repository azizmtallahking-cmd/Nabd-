/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderGit2, 
  Search, 
  Plus, 
  RotateCcw, 
  Filter, 
  Sparkles, 
  Layers, 
  FileText,
  SlidersHorizontal,
  ChevronDown,
  X
} from 'lucide-react';
import { useMentorFiles } from './hooks/useMentorFiles';
import { FileTree } from './components/FileTree';
import { MetadataTable } from './components/MetadataTable';
import { FileDetailPanel } from './components/FileDetailPanel';
import { CreateFileModal } from './components/CreateFileModal';
import { FileStatus, LoadingMode } from './data/mentorFilesSchema';

export const MentorFilesRoom: React.FC = () => {
  const {
    files,
    filteredFiles,
    folders,
    selectedFolder,
    selectedFileId,
    selectedFile,
    searchQuery,
    statusFilter,
    loadingModeFilter,
    folderFileCounts,
    setSelectedFolder,
    setSelectedFileId,
    setSearchQuery,
    setStatusFilter,
    setLoadingModeFilter,
    updateFileMeta,
    createNewVersion,
    createFile,
    deleteFile,
    resetToSeed
  } = useMentorFiles();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-950 text-stone-100 overflow-hidden font-sans">
      {/* Room Header & Toolbar */}
      <header className="bg-stone-900 border-b border-stone-800 p-4 flex flex-col gap-3 select-none">
        {/* Top Row: Room Title & Primary Actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 border-2 border-amber-500/60 rounded flex items-center justify-center text-amber-400 shadow-[2px_2px_0px_0px_rgba(245,158,11,0.3)]">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-stone-100 font-sans">غرفة ملفات المرشد</h1>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  {files.length} ملفات معرّفة
                </span>
              </div>
              <p className="text-xs text-stone-400">
                إدارة وحوكمة ملفات الشخصية والمعرفة والمسارات التي تشكّل عقل المرشد «نبض»
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded text-xs flex items-center gap-1.5 font-mono shadow-[2px_2px_0px_0px_rgba(16,185,129,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              إضافة ملف معرفي جديد
            </button>

            <button
              onClick={() => {
                if (window.confirm('هل تود إعادة تعيين كافة البيانات إلى الحالة الأولية المعتمدة؟')) {
                  resetToSeed();
                }
              }}
              className="px-2.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 rounded text-xs flex items-center gap-1 font-mono transition-colors"
              title="إعادة التعيين إلى البيانات التجريبية الأولية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة تعيين Seed</span>
            </button>
          </div>
        </div>

        {/* Second Row: Search & Filters */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-stone-500 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الملف، التصنيف، Slug، أو المحتوى..."
              className="w-full bg-stone-950 border border-stone-800 rounded-md py-1.5 pr-9 pl-8 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-2 text-stone-500 hover:text-stone-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-stone-950 border border-stone-800 px-2.5 py-1 rounded">
              <span className="text-stone-400 text-[11px]">الحالة:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-emerald-300 focus:outline-none cursor-pointer"
              >
                <option value="all">الكل (All Statuses)</option>
                <option value="approved">approved (معتمد)</option>
                <option value="in-review">in-review (قيد المراجعة)</option>
                <option value="draft">draft (مسودة)</option>
              </select>
            </div>

            {/* Loading Mode Filter */}
            <div className="flex items-center gap-1.5 bg-stone-950 border border-stone-800 px-2.5 py-1 rounded">
              <span className="text-stone-400 text-[11px]">التحميل:</span>
              <select
                value={loadingModeFilter}
                onChange={(e) => setLoadingModeFilter(e.target.value as any)}
                className="bg-transparent text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="all">الكل (All Modes)</option>
                <option value="always">always (دائم)</option>
                <option value="path-conditional">path-conditional (شرطي)</option>
                <option value="on-demand">on-demand (عند الطلب)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Area (Tree + Table + Detail Drawer) */}
      <main className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* Left/Right Tree Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block h-full">
          <FileTree
            folders={folders}
            selectedFolderPath={selectedFolder}
            folderFileCounts={folderFileCounts}
            totalFilesCount={files.length}
            onSelectFolder={setSelectedFolder}
          />
        </div>

        {/* Center Workspace Table */}
        <div className="flex-1 h-full min-w-0 flex flex-col">
          {/* Currently Active Folder Filter Badge Bar */}
          {selectedFolder && (
            <div className="bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-t-md mb-2 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-300">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>المجلد النشط: <strong>{selectedFolder}</strong></span>
              </div>
              <button
                onClick={() => setSelectedFolder(null)}
                className="text-stone-400 hover:text-stone-100 text-[11px] underline"
              >
                إلغاء التصفية
              </button>
            </div>
          )}

          <div className="flex-1 min-h-0">
            <MetadataTable
              files={filteredFiles}
              selectedFileId={selectedFileId}
              onSelectFile={setSelectedFileId}
              onDeleteFile={deleteFile}
            />
          </div>
        </div>

        {/* Detail Panel Drawer / Inspector */}
        {selectedFile && (
          <div className="w-full lg:w-[480px] xl:w-[540px] flex-shrink-0 h-full">
            <FileDetailPanel
              file={selectedFile}
              allFiles={files}
              onClose={() => setSelectedFileId(null)}
              onUpdateFileMeta={updateFileMeta}
              onCreateNewVersion={createNewVersion}
              onSelectLinkedFile={(linkedId) => setSelectedFileId(linkedId)}
              onDeleteFile={deleteFile}
            />
          </div>
        )}
      </main>

      {/* Modal for Creating New File */}
      {showCreateModal && (
        <CreateFileModal
          initialFolder={selectedFolder}
          onClose={() => setShowCreateModal(false)}
          onCreateFile={createFile}
        />
      )}
    </div>
  );
};
