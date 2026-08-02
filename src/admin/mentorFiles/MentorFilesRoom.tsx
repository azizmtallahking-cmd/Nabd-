/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMentorFiles } from './hooks/useMentorFiles';
import { FileTree } from './components/FileTree';
import { MetadataTable } from './components/MetadataTable';
import { FileDetailPanel } from './components/FileDetailPanel';
import { CreateFileModal } from './components/CreateFileModal';
import {
  FileText,
  Plus,
  Search,
  Filter,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertCircle,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';

export const MentorFilesRoom: React.FC = () => {
  const {
    folders,
    activeFile,
    selectedFileId,
    setSelectedFileId,
    selectedFolderPath,
    setSelectedFolderPath,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    loadingFilter,
    setLoadingFilter,
    filteredFiles,
    stats,
    addFile,
    updateFileMetadata,
    updateFileContent,
    uploadFileContent,
    downloadFileContent,
    deleteFile,
    resetToSeed,
  } = useMentorFiles();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'split'>('split');

  // List of folder paths for creation dropdown
  const folderPaths = [
    'Core',
    'Memory Governance',
    'Paths/Islamic',
    'Paths/General',
    'Learning',
    'Operational',
    'Mentor Emotional States',
  ];

  return (
    <div className="space-y-5 font-sans pb-12">
      {/* Top Header Banner */}
      <div className="p-5 bg-stone-900 text-stone-100 border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex flex-wrap items-center justify-between gap-4 border-r-4 border-r-emerald-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 text-stone-950 font-mono font-bold flex items-center justify-center border-2 border-stone-100 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-stone-100 tracking-wide flex items-center gap-2">
              <span>غرفة ملفات المرشد المعرفية</span>
              <span className="text-xs px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 font-normal">نبض — المرشد</span>
            </h1>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              لوحة إدارة وتعديل الملفات الموجهة للمدير — رفع الملفات (.md/.txt)، إلصاق النصوص، وإدارة التصنيفات.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono text-xs font-bold border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] flex items-center gap-1.5 transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة ملف جديد</span>
          </button>

          <button
            onClick={resetToSeed}
            className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono border-2 border-stone-700 flex items-center gap-1.5 transition-all"
            title="إعادة ضبط البنية التحتية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط البنية</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Cards & Empty Files Counter */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
          {/* Total Files */}
          <div className="p-3 bg-stone-900 border-2 border-stone-800 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] border-r-4 border-r-emerald-400">
            <div className="text-[11px] text-stone-400 font-bold">إجمالي الملفات</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {stats.total} <span className="text-[10px] text-stone-500 font-normal">ملف</span>
            </div>
          </div>

          {/* Approved */}
          <div className="p-3 bg-stone-900 border-2 border-stone-800 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] border-r-4 border-r-emerald-500">
            <div className="text-[11px] text-stone-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>معتمد (Approved)</span>
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {stats.approved} <span className="text-[10px] text-stone-500 font-normal">معتمد</span>
            </div>
          </div>

          {/* In Review */}
          <div className="p-3 bg-stone-900 border-2 border-stone-800 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] border-r-4 border-r-emerald-600">
            <div className="text-[11px] text-stone-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>قيد المراجعة</span>
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-1">
              {stats.inReview} <span className="text-[10px] text-stone-500 font-normal">ملف</span>
            </div>
          </div>

          {/* Always Loaded */}
          <div className="p-3 bg-stone-900 border-2 border-stone-800 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] border-r-4 border-r-emerald-500">
            <div className="text-[11px] text-stone-400 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>دائم التحميل</span>
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {stats.alwaysLoaded} <span className="text-[10px] text-stone-500 font-normal">دائم</span>
            </div>
          </div>

          {/* On Demand */}
          <div className="p-3 bg-stone-900 border-2 border-stone-800 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] border-r-4 border-r-emerald-700">
            <div className="text-[11px] text-stone-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>عند الطلب</span>
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-1">
              {stats.onDemand} <span className="text-[10px] text-stone-500 font-normal">طلبي</span>
            </div>
          </div>
        </div>

        {/* Subtle empty files counter */}
        {stats.empty > 0 && (
          <div className="text-[11px] font-mono text-stone-400 flex items-center gap-1.5 px-2 py-1 bg-stone-900/60 border border-stone-800 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-800 inline-block animate-pulse"></span>
            <span>{stats.empty} ملفاً فارغاً بانتظار رفع المحتوى</span>
          </div>
        )}
      </div>

      {/* Toolbar Filters */}
      <div className="p-3 bg-stone-200 border-2 border-stone-800 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Search */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الملف، المعرّف، التصنيف أو المحتوى..."
            className="w-full pr-9 pl-3 py-1.5 bg-stone-50 border-2 border-stone-800 text-xs font-sans text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 border border-stone-400">
            <Filter className="w-3.5 h-3.5 text-stone-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-stone-900 focus:outline-none text-xs font-mono"
            >
              <option value="all">كل الحالات</option>
              <option value="empty">فارغ (بانتظار الرفع)</option>
              <option value="in-review">قيد المراجعة</option>
              <option value="approved">معتمد</option>
            </select>
          </div>

          {/* Loading Mode Filter */}
          <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 border border-stone-400">
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            <select
              value={loadingFilter}
              onChange={(e) => setLoadingFilter(e.target.value as any)}
              className="bg-transparent text-stone-900 focus:outline-none text-xs font-mono"
            >
              <option value="all">كل أنماط التحميل</option>
              <option value="always">دائم التحميل</option>
              <option value="path-conditional">مشروط بالمسار</option>
              <option value="on-demand">عند الطلب</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center border border-stone-800 bg-stone-300 p-0.5">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1 ${viewMode === 'split' ? 'bg-emerald-500 text-stone-950 border border-stone-900' : 'text-stone-700'}`}
              title="عرض شجرة وجدول"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 ${viewMode === 'table' ? 'bg-emerald-500 text-stone-950 border border-stone-900' : 'text-stone-700'}`}
              title="عرض جدول كامل"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Folder Filter Indicator */}
      {selectedFolderPath && (
        <div className="p-2 bg-stone-900 border-2 border-stone-800 border-r-4 border-r-emerald-500 text-stone-200 font-mono text-xs flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
          <span>
            تصفية المجلد الحالي: <strong className="text-emerald-400">{selectedFolderPath}</strong> ({filteredFiles.length} ملف)
          </span>
          <button
            onClick={() => setSelectedFolderPath(null)}
            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-[10px] font-bold border border-stone-900"
          >
            إلغاء التصفية
          </button>
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Folder Tree (shown in split mode) */}
        {viewMode === 'split' && (
          <div className="lg:col-span-4">
            <FileTree
              folders={folders}
              files={filteredFiles}
              selectedFolderPath={selectedFolderPath}
              selectedFileId={selectedFileId}
              onSelectFolder={setSelectedFolderPath}
              onSelectFile={setSelectedFileId}
            />
          </div>
        )}

        {/* Center / Main Column: Metadata Table or Detail Panel */}
        <div className={viewMode === 'split' ? (activeFile ? 'lg:col-span-8' : 'lg:col-span-8') : 'lg:col-span-12'}>
          {activeFile ? (
            <div className="space-y-4">
              <FileDetailPanel
                file={activeFile}
                allFiles={filteredFiles}
                onClose={() => setSelectedFileId(null)}
                onUpdateMetadata={updateFileMetadata}
                onUpdateContent={updateFileContent}
                onUploadContent={uploadFileContent}
                onDownloadContent={downloadFileContent}
                onDeleteFile={deleteFile}
              />

              {/* Table below active file panel in split mode */}
              <div className="pt-2">
                <h3 className="text-xs font-mono font-bold text-stone-800 mb-2">جدول كافة ملفات المرشد:</h3>
                <MetadataTable
                  files={filteredFiles}
                  selectedFileId={selectedFileId}
                  onSelectFile={setSelectedFileId}
                  onDeleteFile={deleteFile}
                  onStatusChange={(id, status) => updateFileMetadata(id, { status })}
                />
              </div>
            </div>
          ) : (
            <MetadataTable
              files={filteredFiles}
              selectedFileId={selectedFileId}
              onSelectFile={setSelectedFileId}
              onDeleteFile={deleteFile}
              onStatusChange={(id, status) => updateFileMetadata(id, { status })}
            />
          )}
        </div>
      </div>

      {/* Create File Modal */}
      <CreateFileModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        folderPaths={folderPaths}
        defaultFolderPath={selectedFolderPath || 'Core'}
        onCreateFile={addFile}
      />
    </div>
  );
};
