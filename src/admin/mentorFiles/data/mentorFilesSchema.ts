/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LoadingMode = 'always' | 'path-conditional' | 'on-demand';
export type FileStatus = 'draft' | 'in-review' | 'approved';
export type PathScope = 'shared' | 'islamic-only' | 'general-only';

export interface ChangeNote {
  version: number;
  date: string; // ISO date string (YYYY-MM-DD or full timestamp)
  note: string; // Required log message when updating version
}

export interface MentorFile {
  id: string;                      // Unique ID
  slug: string;                    // Machine name (e.g., "mentor-identity")
  displayNameAr: string;           // Display name in Arabic (e.g., "الهوية")
  folderPath: string;              // Folder path inside the tree (e.g., "Core" or "Paths/Islamic")
  tag: string;                     // Category: Core / Memory Governance / Paths / Learning / Operational / Mentor Emotional States
  loadingMode: LoadingMode;        // When the file is loaded for the model
  loadingCondition?: string;       // Custom condition text when loadingMode === 'on-demand'
  pathScope: PathScope;            // Shared, Islamic only, or General only
  status: FileStatus;              // Draft / In Review / Approved
  version: number;                 // Current version number
  changeNotes: ChangeNote[];       // Version history notes
  linkedFileIds: string[];         // IDs of logically linked files
  content: string;                 // Actual file instructions content (Markdown)
  lastModified: string;            // Last modification date (ISO string)
}

export interface FolderNode {
  id: string;
  nameAr: string;
  path: string;                   // Full folder path key (e.g., "Paths/Islamic")
  iconName?: string;              // Pixel art folder icon badge string
  children?: FolderNode[];
}

export interface MentorFilesConfig {
  folders: FolderNode[];
  initialFiles: MentorFile[];
}
