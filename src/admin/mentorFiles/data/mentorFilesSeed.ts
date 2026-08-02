/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FolderNode, MentorFile } from './mentorFilesSchema';

export const FOLDER_TREE_SEED: FolderNode[] = [
  {
    id: 'core',
    nameAr: 'Core (دائم التحميل)',
    path: 'Core',
    iconName: 'shield',
    children: []
  },
  {
    id: 'memory-gov',
    nameAr: 'حوكمة الذاكرة (Memory Governance)',
    path: 'Memory Governance',
    iconName: 'database',
    children: []
  },
  {
    id: 'paths',
    nameAr: 'المسارات (Paths)',
    path: 'Paths',
    iconName: 'compass',
    children: [
      {
        id: 'paths-islamic',
        nameAr: 'المسار الإسلامي (Islamic Path)',
        path: 'Paths/Islamic',
        iconName: 'book-open'
      },
      {
        id: 'paths-general',
        nameAr: 'المسار العام (General Path)',
        path: 'Paths/General',
        iconName: 'layers'
      }
    ]
  },
  {
    id: 'learning',
    nameAr: 'التعلّم (Learning)',
    path: 'Learning',
    iconName: 'brain',
    children: []
  },
  {
    id: 'operational',
    nameAr: 'التشغيلي (Operational)',
    path: 'Operational',
    iconName: 'activity',
    children: []
  },
  {
    id: 'emotional-states',
    nameAr: 'مواقف المرشد الشخصية (Mentor Emotional States)',
    path: 'Mentor Emotional States',
    iconName: 'heart',
    children: []
  }
];

// Clean empty seed structure with no assigned status and no invented text content
export const MENTOR_FILES_SEED: MentorFile[] = [
  // --- CORE FOLDER ---
  {
    id: 'file-core-identity',
    slug: 'identity',
    displayNameAr: 'الهوية والشخصية',
    folderPath: 'Core',
    tag: 'Core',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-core-methodology',
    slug: 'methodology',
    displayNameAr: 'المنهجية العامة',
    folderPath: 'Core',
    tag: 'Core',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-core-ethics',
    slug: 'ethics',
    displayNameAr: 'الأخلاقيات والضوابط',
    folderPath: 'Core',
    tag: 'Core',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-core-glossary',
    slug: 'language-glossary',
    displayNameAr: 'معجم الإشارة واللغة',
    folderPath: 'Core',
    tag: 'Core',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-core-escalation',
    slug: 'escalation-rules',
    displayNameAr: 'قواعد المواقف الحرجة',
    folderPath: 'Core',
    tag: 'Core',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },

  // --- MEMORY GOVERNANCE FOLDER ---
  {
    id: 'file-memory-gov-main',
    slug: 'memory-governance',
    displayNameAr: 'حوكمة وتدبير الذاكرة',
    folderPath: 'Memory Governance',
    tag: 'Memory Governance',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },

  // --- PATHS: ISLAMIC PATH ---
  {
    id: 'file-path-islamic-goals',
    slug: 'islamic-goals',
    displayNameAr: 'أهداف المسار الإسلامي',
    folderPath: 'Paths/Islamic',
    tag: 'Paths',
    loadingMode: 'path-conditional',
    pathScope: 'islamic-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-islamic-habits',
    slug: 'islamic-habits',
    displayNameAr: 'عادات المسار الإسلامي',
    folderPath: 'Paths/Islamic',
    tag: 'Paths',
    loadingMode: 'path-conditional',
    pathScope: 'islamic-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-islamic-stations',
    slug: 'islamic-stations',
    displayNameAr: 'محطات المسار الإسلامي',
    folderPath: 'Paths/Islamic',
    tag: 'Paths',
    loadingMode: 'path-conditional',
    pathScope: 'islamic-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-islamic-glossary',
    slug: 'islamic-linguistic-diffs',
    displayNameAr: 'الفروق اللغوية الدقيقة',
    folderPath: 'Paths/Islamic',
    tag: 'Paths',
    loadingMode: 'path-conditional',
    pathScope: 'islamic-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-islamic-references',
    slug: 'islamic-references',
    displayNameAr: 'المراجع والمصادر الإيمانية',
    folderPath: 'Paths/Islamic',
    tag: 'Paths',
    loadingMode: 'on-demand',
    loadingCondition: 'عند استفسار السالك عن مرجع أو كتاب',
    pathScope: 'islamic-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },

  // --- PATHS: GENERAL PATH ---
  {
    id: 'file-path-general-goals',
    slug: 'general-goals',
    displayNameAr: 'أهداف المسار العام',
    folderPath: 'Paths/General',
    tag: 'Paths',
    loadingMode: 'path-conditional',
    pathScope: 'general-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-general-habits',
    slug: 'general-habits',
    displayNameAr: 'عادات المسار العام',
    folderPath: 'Paths/General',
    tag: 'Paths',
    loadingMode: 'path-conditional',
    pathScope: 'general-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-general-stations',
    slug: 'general-stations',
    displayNameAr: 'محطات المسار العام',
    folderPath: 'Paths/General',
    tag: 'Paths',
    loadingMode: 'path-conditional',
    pathScope: 'general-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-general-glossary',
    slug: 'general-linguistic-diffs',
    displayNameAr: 'الفروق اللغوية المفاهيمية',
    folderPath: 'Paths/General',
    tag: 'Paths',
    loadingMode: 'path-conditional',
    pathScope: 'general-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-general-references',
    slug: 'general-references',
    displayNameAr: 'المراجع والمصادر العامة',
    folderPath: 'Paths/General',
    tag: 'Paths',
    loadingMode: 'on-demand',
    loadingCondition: 'عند الحاجة لمراجع عامة في الوعي والعادات',
    pathScope: 'general-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-path-general-bridge-to-islamic',
    slug: 'bridge-to-islamic-path',
    displayNameAr: 'ملف السير نحو المسار الإسلامي',
    folderPath: 'Paths/General',
    tag: 'Paths',
    loadingMode: 'on-demand',
    loadingCondition: 'عندما يبدي السالك رغبة في استكشاف المسار الإيماني',
    pathScope: 'general-only',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },

  // --- LEARNING FOLDER ---
  {
    id: 'file-learning-inbox',
    slug: 'learning-inbox',
    displayNameAr: 'صندوق الوارد (Inbox)',
    folderPath: 'Learning',
    tag: 'Learning',
    loadingMode: 'on-demand',
    loadingCondition: 'عند مراجعة التغذية الراجعة والملاحظات المستجدة',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-learning-reviewed',
    slug: 'learning-reviewed',
    displayNameAr: 'تعلّم تمت مراجعته (Reviewed)',
    folderPath: 'Learning',
    tag: 'Learning',
    loadingMode: 'on-demand',
    loadingCondition: 'أثناء تحسين المنهجيات والردود النموذجية',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-learning-approved',
    slug: 'learning-approved',
    displayNameAr: 'تعلّم معتمد (Approved)',
    folderPath: 'Learning',
    tag: 'Learning',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },

  // --- OPERATIONAL FOLDER ---
  {
    id: 'file-operational-daily-behavior',
    slug: 'daily-behavior-system',
    displayNameAr: 'نظام السلوك اليومي',
    folderPath: 'Operational',
    tag: 'Operational',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },

  // --- MENTOR EMOTIONAL STATES FOLDER ---
  {
    id: 'file-emotion-anger',
    slug: 'mentor-anger-state',
    displayNameAr: 'موقف المرشد: غضبه وانزعاجه',
    folderPath: 'Mentor Emotional States',
    tag: 'Mentor Emotional States',
    loadingMode: 'on-demand',
    loadingCondition: 'عند انتهاك قواعد التفاعل أو الاستهانة والتكرار',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-emotion-disappointment',
    slug: 'mentor-disappointment-state',
    displayNameAr: 'موقف المرشد: أسفه وعتابه',
    folderPath: 'Mentor Emotional States',
    tag: 'Mentor Emotional States',
    loadingMode: 'on-demand',
    loadingCondition: 'عند تراجع السالك ونكوصه المستمر',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-emotion-joy',
    slug: 'mentor-joy-state',
    displayNameAr: 'موقف المرشد: فرحه وبشره',
    folderPath: 'Mentor Emotional States',
    tag: 'Mentor Emotional States',
    loadingMode: 'on-demand',
    loadingCondition: 'عند اجتياز السالك محطة صعبة وثباته',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  },
  {
    id: 'file-emotion-tranquility',
    slug: 'mentor-tranquility-state',
    displayNameAr: 'موقف المرشد: طمأنينته وسكينته',
    folderPath: 'Mentor Emotional States',
    tag: 'Mentor Emotional States',
    loadingMode: 'always',
    pathScope: 'shared',
    lastModified: '2026-08-01T00:00:00Z',
    linkedFileIds: [],
    content: ''
  }
];
