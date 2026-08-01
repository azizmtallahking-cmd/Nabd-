/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronLeft, 
  Folder, 
  FolderOpen, 
  Files,
  Shield,
  Database,
  Compass,
  BookOpen,
  Layers,
  Brain,
  Activity,
  Heart
} from 'lucide-react';
import { FolderNode } from '../data/mentorFilesSchema';

interface FileTreeProps {
  folders: FolderNode[];
  selectedFolderPath: string | null;
  folderFileCounts: Record<string, number>;
  totalFilesCount: number;
  onSelectFolder: (path: string | null) => void;
}

// Icon helper map matching iconName from schema
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  database: Database,
  compass: Compass,
  'book-open': BookOpen,
  layers: Layers,
  brain: Brain,
  activity: Activity,
  heart: Heart,
};

export const FileTree: React.FC<FileTreeProps> = ({
  folders,
  selectedFolderPath,
  folderFileCounts,
  totalFilesCount,
  onSelectFolder
}) => {
  // State for expanded folder paths
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({
    'Paths': true,
    'Core': true,
    'Learning': true,
    'Operational': true,
    'Mentor Emotional States': true,
    'Memory Governance': true
  });

  const toggleExpand = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPaths(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderFolderNode = (node: FolderNode, level: number = 0) => {
    const isExpanded = !!expandedPaths[node.path];
    const isSelected = selectedFolderPath === node.path;
    const count = folderFileCounts[node.path] || 0;
    const hasChildren = node.children && node.children.length > 0;

    const SpecificIcon = node.iconName ? ICON_MAP[node.iconName] : null;

    return (
      <div key={node.path} className="select-none">
        <div
          onClick={() => onSelectFolder(node.path)}
          style={{ paddingRight: `${level * 14 + 10}px` }}
          className={`flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors cursor-pointer group mb-0.5 border ${
            isSelected
              ? 'bg-emerald-900/40 border-emerald-600/70 text-emerald-100 font-semibold shadow-[1px_1px_0px_0px_rgba(5,150,105,0.3)]'
              : 'bg-stone-900/30 border-transparent text-stone-300 hover:bg-stone-800/60 hover:text-stone-100 hover:border-stone-700/50'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {/* Expand / Collapse toggle arrow */}
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.path, e)}
                className="p-0.5 text-stone-400 hover:text-stone-100 rounded focus:outline-none"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 text-stone-500" />
                )}
              </button>
            ) : (
              <span className="w-3.5 inline-block" />
            )}

            {/* Pixel Badge Icon */}
            <div className={`w-4 h-4 flex items-center justify-center rounded-sm ${
              isSelected ? 'text-emerald-300' : 'text-amber-400/90'
            }`}>
              {SpecificIcon ? (
                <SpecificIcon className="w-3.5 h-3.5" />
              ) : isExpanded ? (
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>

            <span className="truncate">{node.nameAr}</span>
          </div>

          {/* Item Count Badge */}
          <span className={`text-[10px] px-1.5 py-0.2 font-mono rounded-xs border ${
            isSelected
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-stone-950 text-stone-400 border-stone-800'
          }`}>
            {count}
          </span>
        </div>

        {/* Children Subfolders */}
        {hasChildren && isExpanded && (
          <div className="border-r border-stone-800/80 mr-3 pr-1 my-0.5 space-y-0.5">
            {node.children!.map(child => renderFolderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-stone-900/80 border border-stone-800 rounded-md p-3 flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-800">
        <div className="flex items-center gap-2 text-stone-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-xs shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <h3 className="text-xs font-bold font-mono tracking-wide text-stone-100">شجرة المعرفة (Folders)</h3>
        </div>
        <span className="text-[10px] text-stone-400 font-mono bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
          {folders.length} مجلدات
        </span>
      </div>

      {/* Tree View Content */}
      <div className="flex-1 overflow-y-auto pr-0.5 space-y-1">
        {/* All Files Node */}
        <div
          onClick={() => onSelectFolder(null)}
          className={`flex items-center justify-between py-1.5 px-2.5 rounded text-xs transition-colors cursor-pointer border mb-2 ${
            selectedFolderPath === null
              ? 'bg-emerald-950 border-emerald-500/80 text-emerald-100 font-bold shadow-[2px_2px_0px_0px_rgba(16,185,129,0.25)]'
              : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/80 hover:text-stone-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Files className={`w-4 h-4 ${selectedFolderPath === null ? 'text-emerald-400' : 'text-stone-400'}`} />
            <span>جميع الملفات المعرفية</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.2 font-mono rounded border ${
            selectedFolderPath === null 
              ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40' 
              : 'bg-stone-900 text-stone-400 border-stone-800'
          }`}>
            {totalFilesCount}
          </span>
        </div>

        {/* Dynamic Folder Tree */}
        {folders.map(node => renderFolderNode(node, 0))}
      </div>

      {/* Footer Info / Clear Selection */}
      {selectedFolderPath && (
        <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
          <span className="text-stone-400 truncate max-w-[140px] font-mono">
            المحدد: {selectedFolderPath}
          </span>
          <button
            onClick={() => onSelectFolder(null)}
            className="text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline font-mono"
          >
            عرض الكل
          </button>
        </div>
      )}
    </div>
  );
};
