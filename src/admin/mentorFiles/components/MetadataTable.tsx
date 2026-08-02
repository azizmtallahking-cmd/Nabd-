/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MentorFile, FileStatus, LoadingMode } from '../data/mentorFilesSchema';
import { FileText, Clock, Trash2, CheckCircle, Clock3, AlertCircle, FileEdit } from 'lucide-react';

interface MetadataTableProps {
  files: MentorFile[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onStatusChange: (id: string, status: FileStatus) => void;
}

export const MetadataTable: React.FC<MetadataTableProps> = ({
  files,
  selectedFileId,
  onSelectFile,
  onDeleteFile,
  onStatusChange,
}) => {
  if (files.length === 0) {
    return (
      <div className="p-8 text-center bg-stone-100 border-2 border-dashed border-stone-400 font-mono text-xs text-stone-500">
        لا توجد ملفات معرفية مطابقة للبحث أو التصفية الحالية.
      </div>
    );
  }

  const renderStatusBadge = (file: MentorFile) => {
    if (!file.content || file.content.trim() === '' || !file.status) {
      return (
        <span className="px-2 py-0.5 bg-stone-900 text-stone-400 border border-stone-700 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
          <FileText className="w-3 h-3 text-stone-500" />
          <span>فارغ — بانتظار الرفع</span>
        </span>
      );
    }

    switch (file.status) {
      case 'approved':
        return (
          <span className="px-2 py-0.5 bg-stone-900 text-emerald-400 border border-emerald-600 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>معتمد</span>
          </span>
        );
      case 'in-review':
        return (
          <span className="px-2 py-0.5 bg-stone-900 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
            <Clock3 className="w-3 h-3 text-emerald-300" />
            <span>قيد المراجعة</span>
          </span>
        );
    }
  };

  const renderLoadingModeBadge = (mode: LoadingMode) => {
    switch (mode) {
      case 'always':
        return (
          <span className="px-2 py-0.5 bg-stone-900 text-emerald-400 border border-emerald-600 text-[10px] font-mono font-bold">
            دائم التحميل
          </span>
        );
      case 'path-conditional':
        return (
          <span className="px-2 py-0.5 bg-stone-900 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold">
            مشروط بالمسار
          </span>
        );
      case 'on-demand':
        return (
          <span className="px-2 py-0.5 bg-stone-900 text-teal-400 border border-teal-800 text-[10px] font-mono font-bold">
            عند الطلب
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto border-2 border-stone-800 bg-stone-50 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] font-sans">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-stone-900 text-emerald-400 font-mono text-xs border-b-2 border-stone-800">
            <th className="p-3 border-l border-stone-800 font-bold">اسم الملف والمعرّف</th>
            <th className="p-3 border-l border-stone-800 font-bold">المجلد</th>
            <th className="p-3 border-l border-stone-800 font-bold">التصنيف</th>
            <th className="p-3 border-l border-stone-800 font-bold">نمط التحميل</th>
            <th className="p-3 border-l border-stone-800 font-bold">الحالة</th>
            <th className="p-3 border-l border-stone-800 font-bold">آخر رفع/تعديل</th>
            <th className="p-3 font-bold text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-stone-200 text-xs">
          {files.map((file) => {
            const isSelected = file.id === selectedFileId;
            return (
              <tr
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-emerald-950/20 font-medium border-l-4 border-l-emerald-500'
                    : 'hover:bg-stone-200/60 bg-stone-50'
                }`}
              >
                {/* File Name & Slug */}
                <td className="p-3 border-l border-stone-300">
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-stone-700'}`} />
                    <div>
                      <div className="font-bold text-stone-900">{file.displayNameAr}</div>
                      <div className="text-[11px] font-mono text-stone-500 dir-ltr text-right">
                        {file.slug}.md
                      </div>
                    </div>
                  </div>
                </td>

                {/* Folder Path */}
                <td className="p-3 border-l border-stone-300 font-mono text-stone-700">
                  {file.folderPath}
                </td>

                {/* Tag */}
                <td className="p-3 border-l border-stone-300 font-mono">
                  <span className="px-1.5 py-0.5 bg-stone-200 border border-stone-400 text-stone-800 text-[11px]">
                    {file.tag}
                  </span>
                </td>

                {/* Loading Mode */}
                <td className="p-3 border-l border-stone-300">
                  {renderLoadingModeBadge(file.loadingMode)}
                </td>

                {/* Status */}
                <td className="p-3 border-l border-stone-300">
                  {renderStatusBadge(file)}
                </td>

                {/* Last Modified */}
                <td className="p-3 border-l border-stone-300 font-mono text-[11px] text-stone-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span>{new Date(file.lastModified).toLocaleDateString('ar-SA')}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onSelectFile(file.id)}
                      className="p-1 bg-stone-200 hover:bg-emerald-500 hover:text-stone-950 text-stone-900 border border-stone-800 transition-colors"
                      title="عرض وتعديل المحتوى"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteFile(file.id)}
                      className="p-1 bg-rose-100 hover:bg-rose-700 hover:text-white text-rose-800 border border-rose-800 transition-colors"
                      title="حذف الملف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
