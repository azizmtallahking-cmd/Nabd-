/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MentorAnimState =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'SILENT'
  | 'WRITING'
  | 'READING'
  | 'RESTING'
  | 'TRANSITION'
  | 'REFLECTIVE'
  | 'GREETING';

export type OutfitCategory =
  | 'default'
  | 'formal'
  | 'winter'
  | 'summer'
  | 'rest'
  | 'special_event'
  | 'religious_context';

export type HeldObject =
  | 'none'
  | 'book'
  | 'walking_stick'
  | 'prayer_beads'
  | 'notebook'
  | 'cup';

export type MentorPresenceLevel = 'full' | 'reduced' | 'minimal' | 'withdrawn';

export interface MentorPalette {
  skinTone: string;
  hairColor: string;
  beardColor: string;
  primaryRobe: string;
  robeHighlight: string;
  robeShadow: string;
  sashColor: string;
  trimColor?: string;
  footwearColor: string;
}

export interface MentorAppearance {
  outfit: OutfitCategory;
  heldObject: HeldObject;
  palette: MentorPalette;
}

export interface MentorState {
  animState: MentorAnimState;
  presenceLevel: MentorPresenceLevel;
  appearance: MentorAppearance;
  isBlinking: boolean;
  breathTick: number;
}

/** Outfit metadata definition */
export interface OutfitConfig {
  id: OutfitCategory;
  nameAr: string;
  nameArShort: string;
  descriptionAr: string;
  palette: MentorPalette;
}

/** Pre-configured Outfits for Contextual Appearance */
export const OUTFIT_CONFIGS: Record<OutfitCategory, OutfitConfig> = {
  default: {
    id: 'default',
    nameAr: 'الكساء الزيتوني المعتاد',
    nameArShort: 'معتاد',
    descriptionAr: 'ثوب زيتوني هادئ بوشاح بني دافئ للقيام بالورد اليومي',
    palette: {
      skinTone: '#d4a373',
      hairColor: '#e2e8f0',
      beardColor: '#cbd5e1',
      primaryRobe: '#15803d',
      robeHighlight: '#22c55e',
      robeShadow: '#14532d',
      sashColor: '#78350f',
      footwearColor: '#451a03',
    },
  },
  formal: {
    id: 'formal',
    nameAr: 'العباءة الزمرّدية المطرزة',
    nameArShort: 'رسمي',
    descriptionAr: 'ثوب زمردي داكن بخيوط ذهبية للمناسبات واللقاءات الهامة',
    palette: {
      skinTone: '#d4a373',
      hairColor: '#f1f5f9',
      beardColor: '#e2e8f0',
      primaryRobe: '#064e3b',
      robeHighlight: '#047857',
      robeShadow: '#022c22',
      sashColor: '#b45309',
      trimColor: '#fbbf24',
      footwearColor: '#27272a',
    },
  },
  winter: {
    id: 'winter',
    nameAr: 'رداء الصوف الشتوي الداكن',
    nameArShort: 'شتوي',
    descriptionAr: 'عباءة صوفية دافئة بلون ترابي داكن لبرودة الليل والأوقات الباردة',
    palette: {
      skinTone: '#cca175',
      hairColor: '#e2e8f0',
      beardColor: '#cbd5e1',
      primaryRobe: '#451a03',
      robeHighlight: '#78350f',
      robeShadow: '#270e02',
      sashColor: '#1c1917',
      footwearColor: '#1c1917',
    },
  },
  summer: {
    id: 'summer',
    nameAr: 'القميص الكتان الخفيف',
    nameArShort: 'صيفي',
    descriptionAr: 'كساء كتاني فاتح ومريح لأوقات الصباح والحر الشديد',
    palette: {
      skinTone: '#d4a373',
      hairColor: '#e2e8f0',
      beardColor: '#cbd5e1',
      primaryRobe: '#a1a1aa',
      robeHighlight: '#e4e4e7',
      robeShadow: '#52525b',
      sashColor: '#15803d',
      footwearColor: '#78350f',
    },
  },
  rest: {
    id: 'rest',
    nameAr: 'رداء الاستراحة البني',
    nameArShort: 'سكينة',
    descriptionAr: 'كساء بني داكن بسيط للجلوس والسكون والتأمل الهادئ',
    palette: {
      skinTone: '#d4a373',
      hairColor: '#cbd5e1',
      beardColor: '#94a3b8',
      primaryRobe: '#52525b',
      robeHighlight: '#71717a',
      robeShadow: '#27272a',
      sashColor: '#3f3f46',
      footwearColor: '#18181b',
    },
  },
  special_event: {
    id: 'special_event',
    nameAr: 'كساء الإنجاز والاحتفاء',
    nameArShort: 'احتفاء',
    descriptionAr: 'كساء كحلي ملكي للاحتفاء بإنهاء الورد أو تحقيق محطة سلوكية',
    palette: {
      skinTone: '#d4a373',
      hairColor: '#f8fafc',
      beardColor: '#e2e8f0',
      primaryRobe: '#1e3a8a',
      robeHighlight: '#2563eb',
      robeShadow: '#172554',
      sashColor: '#d97706',
      trimColor: '#fef08a',
      footwearColor: '#0f172a',
    },
  },
  religious_context: {
    id: 'religious_context',
    nameAr: 'الثوب الأبيض النقي',
    nameArShort: 'روحاني',
    descriptionAr: 'ثوب أبيض صافٍ يناسب أوقات الفجر والورد الروحاني الخالص',
    palette: {
      skinTone: '#d4a373',
      hairColor: '#f1f5f9',
      beardColor: '#e2e8f0',
      primaryRobe: '#f8fafc',
      robeHighlight: '#ffffff',
      robeShadow: '#cbd5e1',
      sashColor: '#15803d',
      trimColor: '#86efac',
      footwearColor: '#451a03',
    },
  },
};
