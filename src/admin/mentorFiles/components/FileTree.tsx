/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FolderNode, MentorFile } from '../data/mentorFilesSchema';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronLeft,
  ChevronDown,
  Shield,
  Database,
  Compass,
  BookOpen,
  Layers,
  Brain,
  Activity,
  Heart,
} from 'lucide-react';

interface FileTreeProps {
  folders: FolderNode[];
  files: MentorFile[];
  selectedFolderPath: string | null;
  selectedFileId: string | null;
  onSelectFolder: (path: string | null) => void;
  onSelectFile: (id: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  folders,
  files,
  selectedFolderPath,
  selectedFileId,
  onSelectFolder,
  onSelectFile,
}) => {
  const [openPaths, setOpenPaths] = useState<Record<string, boolean>>({
    'Core': true,
    'Memory Governance': true,
    'Paths': true,
    'Paths/Islamic': true,
    'Paths/General': true,
    'Learning': true,
    'Operational': true,
    'Mentor Emotional States': true,
  });

  const toggleFolder = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenPaths((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const getFolderIcon = (iconName?: string, isOpen?: boolean) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'database':
        return <Database className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'compass':
        return <Compass className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'book-open':
        return <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'brain':
        return <Brain className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return isOpen ? (
          <FolderOpen className="w-4 h-4 text-emerald-500 shrink-0" />
        ) : (
          <Folder className="w-4 h-4 text-emerald-600 shrink-0" />
        );
    }
  };

  // Render folder item recursively
  const renderFolderNode = (node: FolderNode, level: number = 0) => {
    const isOpen = !!openPaths[node.path];
    const isFolderSelected = selectedFolderPath === node.path;

    // Files directly in this folder
    const folderFiles = files.filter((f) => f.folderPath === node.path);

    return (
      <div key={node.path} className="select-none font-mono">
        {/* Folder Header */}
        <div
          onClick={() => onSelectFolder(isFolderSelected ? null : node.path)}
          style={{ paddingRight: `${level * 12 + 8}px` }}
          className={`py-1.5 px-2 flex items-center justify-between cursor-pointer border-b border-stone-200 text-xs transition-colors ${
            isFolderSelected
              ? 'bg-emerald-950 text-emerald-300 font-bold border-l-4 border-l-emerald-500'
              : 'hover:bg-stone-200/70 text-stone-900'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            <button
              type="button"
              onClick={(e) => toggleFolder(node.path, e)}
              className="p-0.5 hover:bg-stone-300 text-stone-700 shrink-0"
            >
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>

            {getFolderIcon(node.iconName, isOpen)}

            <span className="truncate font-bold text-stone-900">{node.nameAr}</span>
          </div>

          <span className="px-1.5 py-0.2 bg-stone-200 text-stone-700 text-[10px] font-mono border border-stone-400">
            {folderFiles.length}
          </span>
        </div>

        {/* Folder Content (Subfolders and Files) */}
        {isOpen && (
          <div>
            {/* Child Folders */}
            {node.children &&
              node.children.map((child) => renderFolderNode(child, level + 1))}

            {/* Files in this folder */}
            {folderFiles.map((file) => {
              const isFileSelected = file.id === selectedFileId;
              const isEmpty = !file.content || file.content.trim() === '' || !file.status;
              return (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file.id)}
                  style={{ paddingRight: `${(level + 1) * 12 + 16}px` }}
                  className={`py-1.5 px-2 flex items-center justify-between cursor-pointer text-xs border-b border-stone-100 transition-colors ${
                    isFileSelected
                      ? 'bg-stone-900 text-emerald-400 font-bold'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <FileText
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isFileSelected ? 'text-emerald-400' : 'text-stone-500'
                      }`}
                    />
                    <span className="truncate">{file.displayNameAr}</span>
                  </div>

                  <span
                    className={`text-[9px] px-1.5 py-0.2 border font-mono font-bold ${
                      isEmpty
                        ? 'bg-stone-900 text-stone-400 border-stone-700'
                        : file.status === 'approved'
                        ? 'bg-stone-900 text-emerald-400 border-emerald-700'
                        : 'bg-stone-900 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {isEmpty
                      ? 'فارغ'
                      : file.status === 'approved'
                      ? 'معتمد'
                      : 'مراجعة'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-2 border-stone-800 bg-stone-50 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] font-sans overflow-hidden">
      <div className="p-2.5 bg-stone-900 text-stone-100 border-b-2 border-stone-800 flex items-center justify-between">
        <span className="text-xs font-bold font-mono tracking-wider text-emerald-400">
          شجرة المجلدات والملفات
        </span>
        {selectedFolderPath && (
          <button
            onClick={() => onSelectFolder(null)}
            className="text-[10px] font-mono px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-stone-700"
          >
            إلغاء تصفية المجلد
          </button>
        )}
      </div>

      <div className="max-h-[600px] overflow-y-auto divide-y divide-stone-200">
        {folders.map((node) => renderFolderNode(node, 0))}
      </div>
    </div>
  );
};
