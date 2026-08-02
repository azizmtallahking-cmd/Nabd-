/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { MentorFile, FolderNode, FileStatus, LoadingMode, PathScope } from '../data/mentorFilesSchema';
import { MENTOR_FILES_SEED, FOLDER_TREE_SEED } from '../data/mentorFilesSeed';

const STORAGE_KEY_FILES = 'nabdh_mentor_room_files_v2';
const STORAGE_KEY_FOLDERS = 'nabdh_mentor_room_folders_v2';

export function useMentorFiles() {
  const [files, setFiles] = useState<MentorFile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse mentor files from localStorage:', e);
    }
    return MENTOR_FILES_SEED;
  });

  const [folders] = useState<FolderNode[]>(FOLDER_TREE_SEED);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFolderPath, setSelectedFolderPath] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<FileStatus | 'empty' | 'all'>('all');
  const [loadingFilter, setLoadingFilter] = useState<LoadingMode | 'all'>('all');

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
    } catch (e) {
      console.error('Failed to save mentor files to localStorage:', e);
    }
  }, [files]);

  // Active selected file object
  const activeFile = useMemo(() => {
    return files.find((f) => f.id === selectedFileId) || null;
  }, [files, selectedFileId]);

  // Filtered files list based on search, selected folder, and filter dropdowns
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      // Folder filter
      if (selectedFolderPath) {
        if (!file.folderPath.startsWith(selectedFolderPath)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === 'empty') {
        if (file.content && file.content.trim() !== '') return false;
      } else if (statusFilter !== 'all') {
        if (file.status !== statusFilter) return false;
      }

      // Loading mode filter
      if (loadingFilter !== 'all' && file.loadingMode !== loadingFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = file.displayNameAr.toLowerCase().includes(q);
        const matchSlug = file.slug.toLowerCase().includes(q);
        const matchTag = file.tag.toLowerCase().includes(q);
        const matchContent = file.content.toLowerCase().includes(q);
        return matchName || matchSlug || matchTag || matchContent;
      }

      return true;
    });
  }, [files, selectedFolderPath, statusFilter, loadingFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: files.length,
      approved: files.filter((f) => f.status === 'approved').length,
      inReview: files.filter((f) => f.status === 'in-review').length,
      empty: files.filter((f) => !f.content || f.content.trim() === '').length,
      alwaysLoaded: files.filter((f) => f.loadingMode === 'always').length,
      pathConditional: files.filter((f) => f.loadingMode === 'path-conditional').length,
      onDemand: files.filter((f) => f.loadingMode === 'on-demand').length,
    };
  }, [files]);

  // Add a new file
  const addFile = (newFile: Omit<MentorFile, 'id' | 'lastModified'>) => {
    const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const hasContent = Boolean(newFile.content && newFile.content.trim() !== '');
    const fullFile: MentorFile = {
      ...newFile,
      id,
      status: hasContent ? (newFile.status || 'in-review') : newFile.status,
      lastModified: new Date().toISOString(),
    };

    setFiles((prev) => [fullFile, ...prev]);
    setSelectedFileId(id);
    return id;
  };

  // Update file metadata (tag, status, loadingMode, loadingCondition, pathScope, displayNameAr, etc.)
  const updateFileMetadata = (id: string, updates: Partial<MentorFile>) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id !== id) return file;
        return {
          ...file,
          ...updates,
          lastModified: new Date().toISOString(),
        };
      })
    );
  };

  // Replace content directly from pasted text
  const updateFileContent = (id: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id !== id) return file;
        return {
          ...file,
          content: newContent,
          lastModified: new Date().toISOString(),
        };
      })
    );
  };

  // Read uploaded File object and set file content
  const uploadFileContent = async (id: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          updateFileContent(id, text);
          resolve();
        } else {
          reject(new Error('فشل في قراءة محتوى الملف المرفوع'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, 'UTF-8');
    });
  };

  // Download content as file
  const downloadFileContent = (id: string) => {
    const targetFile = files.find((f) => f.id === id);
    if (!targetFile) return;

    const blob = new Blob([targetFile.content || ''], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${targetFile.slug || 'mentor-file'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Delete file
  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
  };

  // Reset to seed
  const resetToSeed = () => {
    setFiles(MENTOR_FILES_SEED);
    setSelectedFileId(null);
    localStorage.removeItem(STORAGE_KEY_FILES);
  };

  return {
    files,
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
  };
}
