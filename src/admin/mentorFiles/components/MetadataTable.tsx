/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  GitCommit, 
  Clock, 
  Sparkles,
  Zap,
  Tag,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Link2
} from 'lucide-react';
import { MentorFile, FileStatus, LoadingMode, PathScope } from '../data/mentorFilesSchema';

interface MetadataTableProps {
  files: MentorFile[];
  selectedFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onDeleteFile?: (fileId: string) => void;
}

export const MetadataTable: React.FC<MetadataTableProps> = ({
  files,
  selectedFileId,
  onSelectFile
}) => {
  // Format ISO date to Arabic friendly date string
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  // Helper renderers for status pills
  const renderStatusBadge = (status: FileStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            معتمد
          </span>
        );
      case 'in-review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-sky-950 text-sky-300 border border-sky-700/60 rounded-xs">
            <Eye className="w-3 h-3 text-sky-400" />
            قيد المراجعة
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-amber-950 text-amber-300 border border-amber-700/60 rounded-xs">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            مسودة
          </span>
        );
    }
  };

  const renderLoadingModeBadge = (mode: LoadingMode, condition?: string) => {
    switch (mode) {
      case 'always':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-700/60 rounded-xs" title="يُحمَّل دائماً للنموذج">
            <Zap className="w-3 h-3 text-purple-400" />
            دائم التحميل
          </span>
        );
      case 'path-conditional':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 rounded-xs" title="يُحمَّل بحسب مسار السالك">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            شرطي المسار
          </span>
        );
      case 'on-demand':
        return (
          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-700/60 rounded-xs cursor-help"
            title={condition ? `الشرط: ${condition}` : 'يُحمَّل عند الطلب بوجود شرط'}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            عند الطلب
          </span>
        );
    }
  };

  const renderPathScopeBadge = (scope: PathScope) => {
    switch (scope) {
      case 'islamic-only':
        return <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-900/60 font-mono">إسلامي فقط</span>;
      case 'general-only':
        return <span className="text-[10px] text-sky-400 bg-sky-950/40 px-1.5 py-0.2 rounded border border-sky-900/60 font-mono">عام فقط</span>;
      case 'shared':
      default:
        return <span className="text-[10px] text-stone-400 bg-stone-900 px-1.5 py-0.2 rounded border border-stone-800 font-mono">مشترك</span>;
    }
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-md overflow-hidden flex flex-col h-full">
      {/* Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-right border-collapse text-xs">
          {/* Table Header */}
          <thead className="bg-stone-950 border-b border-stone-800 text-stone-300 font-mono sticky top-0 z-10 select-none">
            <tr>
              <th className="py-2.5 px-3 font-semibold border-l border-stone-800/80">
                الاسم المعروض (File Name)
              </th>
              <th className="py-2.5 px-3 font-semibold border-l border-stone-800/80">
                التصنيف (Tag)
              </th>
              <th className="py-2.5 px-3 font-semibold border-l border-stone-800/80">
                حالة التحميل (Loading)
              </th>
              <th className="py-2.5 px-3 font-semibold border-l border-stone-800/80">
                الحالة (Status)
              </th>
              <th className="py-2.5 px-3 font-semibold border-l border-stone-800/80 text-center w-24">
                الإصدار (Ver)
              </th>
              <th className="py-2.5 px-3 font-semibold w-32">
                آخر تعديل
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-stone-800/60 text-stone-200">
            {files.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileCode className="w-8 h-8 text-stone-600" />
                    <p className="font-semibold text-stone-300">لا توجد ملفات معرفية في هذا المجلد أو مع الفلتر الحالي</p>
                    <p className="text-xs text-stone-500">اختر مجلداً آخر أو قم بتعديل عبارة البحث</p>
                  </div>
                </td>
              </tr>
            ) : (
              files.map((file) => {
                const isSelected = selectedFileId === file.id;

                return (
                  <tr
                    key={file.id}
                    onClick={() => onSelectFile(file.id)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500/50 text-stone-100 font-medium'
                        : 'hover:bg-stone-800/60'
                    }`}
                  >
                    {/* Display Name & Slug */}
                    <td className="py-2.5 px-3 border-l border-stone-800/50">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className={`w-4 h-4 flex-shrink-0 ${
                            isSelected ? 'text-emerald-400' : 'text-stone-400 group-hover:text-amber-400'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-100 group-hover:text-emerald-300 transition-colors">
                                {file.displayNameAr}
                              </span>
                              {renderPathScopeBadge(file.pathScope)}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-stone-400 bg-stone-950/80 px-1.5 py-0.2 rounded border border-stone-800">
                                {file.slug}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                📁 {file.folderPath}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Linked files badge */}
                        {file.linkedFileIds && file.linkedFileIds.length > 0 && (
                          <span 
                            className="text-[10px] text-amber-400 bg-amber-950/50 border border-amber-800/60 px-1.5 py-0.2 rounded flex items-center gap-1 font-mono"
                            title={`مرتبط بـ ${file.linkedFileIds.length} ملفات أخرى`}
                          >
                            <Link2 className="w-2.5 h-2.5" />
                            {file.linkedFileIds.length}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tag / Category */}
                    <td className="py-2.5 px-3 border-l border-stone-800/50">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-300 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                        <Tag className="w-3 h-3 text-stone-400" />
                        {file.tag}
                      </span>
                    </td>

                    {/* Loading Mode */}
                    <td className="py-2.5 px-3 border-l border-stone-800/50 whitespace-nowrap">
                      {renderLoadingModeBadge(file.loadingMode, file.loadingCondition)}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 border-l border-stone-800/50 whitespace-nowrap">
                      {renderStatusBadge(file.status)}
                    </td>

                    {/* Version */}
                    <td className="py-2.5 px-3 border-l border-stone-800/50 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-400 bg-stone-950 px-2 py-0.5 rounded border border-amber-900/40">
                        <GitCommit className="w-3 h-3" />
                        v{file.version}
                      </span>
                    </td>

                    {/* Last Modified */}
                    <td className="py-2.5 px-3 text-stone-400 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(file.lastModified)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Stats Bar */}
      <div className="bg-stone-950 px-3 py-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400 font-mono select-none">
        <div>
          إجمالي العناصر المعروضة: <span className="text-emerald-400 font-bold">{files.length}</span> ملف معرفي
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            معتمد: {files.filter(f => f.status === 'approved').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
            قيد المراجعة: {files.filter(f => f.status === 'in-review').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            مسودة: {files.filter(f => f.status === 'draft').length}
          </span>
        </div>
      </div>
    </div>
  );
};
