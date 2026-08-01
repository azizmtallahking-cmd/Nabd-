/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MentorFile, FolderNode, FileStatus, LoadingMode } from '../data/mentorFilesSchema';
import { MENTOR_FILES_SEED, FOLDER_TREE_SEED } from '../data/mentorFilesSeed';

const STORAGE_KEY = 'nabd_admin_mentor_files_v1';

export function useMentorFiles() {
  // Initialize files state with local persistence
  const [files, setFiles] = useState<MentorFile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load mentor files from localStorage', e);
    }
    return MENTOR_FILES_SEED;
  });

  const [folders] = useState<FolderNode[]>(FOLDER_TREE_SEED);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | FileStatus>('all');
  const [loadingModeFilter, setLoadingModeFilter] = useState<'all' | LoadingMode>('all');

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (e) {
      console.error('Failed to save mentor files to localStorage', e);
    }
  }, [files]);

  // Compute selected file
  const selectedFile = useMemo(() => {
    if (!selectedFileId) return null;
    return files.find(f => f.id === selectedFileId) || null;
  }, [files, selectedFileId]);

  // Filtered files list
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      // Folder match
      if (selectedFolder) {
        // Matches exact folder or subfolder prefix
        if (!file.folderPath.startsWith(selectedFolder)) {
          return false;
        }
      }

      // Status match
      if (statusFilter !== 'all' && file.status !== statusFilter) {
        return false;
      }

      // Loading mode match
      if (loadingModeFilter !== 'all' && file.loadingMode !== loadingModeFilter) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = file.displayNameAr.toLowerCase().includes(q);
        const inSlug = file.slug.toLowerCase().includes(q);
        const inTag = file.tag.toLowerCase().includes(q);
        const inContent = file.content.toLowerCase().includes(q);
        if (!inName && !inSlug && !inTag && !inContent) {
          return false;
        }
      }

      return true;
    });
  }, [files, selectedFolder, statusFilter, loadingModeFilter, searchQuery]);

  // Actions
  const updateFileMeta = useCallback((id: string, updates: Partial<MentorFile>) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          ...updates,
          lastModified: new Date().toISOString()
        };
      }
      return f;
    }));
  }, []);

  const createNewVersion = useCallback((
    id: string,
    noteText: string,
    newContent?: string,
    metaUpdates?: Partial<MentorFile>
  ) => {
    if (!noteText.trim()) {
      throw new Error('ملاحظة التغيير إجبارية لحفظ إصدار جديد.');
    }

    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const nextVersion = f.version + 1;
        const todayStr = new Date().toISOString().split('T')[0];
        const newNote = {
          version: nextVersion,
          date: todayStr,
          note: noteText.trim()
        };

        return {
          ...f,
          ...metaUpdates,
          version: nextVersion,
          content: newContent !== undefined ? newContent : f.content,
          changeNotes: [newNote, ...f.changeNotes],
          lastModified: new Date().toISOString()
        };
      }
      return f;
    }));
  }, []);

  const createFile = useCallback((
    newFileData: Omit<MentorFile, 'id' | 'version' | 'changeNotes' | 'lastModified'> & { changeNote: string }
  ) => {
    const { changeNote, ...rest } = newFileData;
    const id = `file-custom-${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];
    
    const fileToAdd: MentorFile = {
      ...rest,
      id,
      version: 1,
      changeNotes: [
        {
          version: 1,
          date: todayStr,
          note: changeNote || 'إنشاء ملف جديد في النظام المعرفي'
        }
      ],
      lastModified: new Date().toISOString()
    };

    setFiles(prev => [fileToAdd, ...prev]);
    setSelectedFileId(id);
    return id;
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
  }, [selectedFileId]);

  const resetToSeed = useCallback(() => {
    setFiles(MENTOR_FILES_SEED);
    setSelectedFileId(null);
    setSelectedFolder(null);
  }, []);

  // Compute folder counts helper
  const folderFileCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    files.forEach(file => {
      // Accumulate for specific path and parent paths
      const parts = file.folderPath.split('/');
      let currentPath = '';
      parts.forEach(part => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        counts[currentPath] = (counts[currentPath] || 0) + 1;
      });
    });
    return counts;
  }, [files]);

  return {
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
    // Setters
    setSelectedFolder,
    setSelectedFileId,
    setSearchQuery,
    setStatusFilter,
    setLoadingModeFilter,
    // Actions
    updateFileMeta,
    createNewVersion,
    createFile,
    deleteFile,
    resetToSeed
  };
}
