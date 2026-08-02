/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export type TimeOfDayPeriod = 
  | 'fajr'       // 04:00 - 06:00
  | 'morning'    // 06:00 - 11:00
  | 'midday'     // 11:00 - 15:00
  | 'afternoon'  // 15:00 - 18:00
  | 'sunset'     // 18:00 - 20:00
  | 'dusk'       // 20:00 - 22:00
  | 'night';     // 22:00 - 04:00

export interface TimeOfDayInfo {
  hour: number;
  period: TimeOfDayPeriod;
  labelAr: string;
  skyColors: [string, string, string]; // Top, Middle, Horizon
  ambientOverlay: string; // RGBA color for indoor lighting overlay
  windowGlowColor: string;
  lampLit: boolean;
  starsVisible: boolean;
  sunMoon: {
    type: 'sun' | 'moon';
    xRatio: number; // 0 to 1 across window
    yRatio: number; // 0 (top) to 1 (horizon)
  };
}

export function getTimeOfDayInfo(targetHour?: number): TimeOfDayInfo {
  const h = targetHour !== undefined ? targetHour : new Date().getHours();

  if (h >= 4 && h < 6) {
    // Fajr / Dawn
    return {
      hour: h,
      period: 'fajr',
      labelAr: 'الفجر (الشروق الأول)',
      skyColors: ['#1e1b4b', '#4c1d95', '#9a3412'], // Dark violet to deep rose
      ambientOverlay: 'rgba(30, 27, 75, 0.25)',
      windowGlowColor: '#c084fc',
      lampLit: true,
      starsVisible: true,
      sunMoon: { type: 'sun', xRatio: 0.15, yRatio: 0.8 },
    };
  } else if (h >= 6 && h < 11) {
    // Morning
    return {
      hour: h,
      period: 'morning',
      labelAr: 'إشراقة الصباح',
      skyColors: ['#0284c7', '#38bdf8', '#bae6fd'], // Sky blue
      ambientOverlay: 'rgba(254, 243, 199, 0.08)',
      windowGlowColor: '#fef08a',
      lampLit: false,
      starsVisible: false,
      sunMoon: { type: 'sun', xRatio: 0.35, yRatio: 0.4 },
    };
  } else if (h >= 11 && h < 15) {
    // Midday
    return {
      hour: h,
      period: 'midday',
      labelAr: 'رابعة الظهيرة',
      skyColors: ['#0369a1', '#0284c7', '#e0f2fe'], // Bright clear azure sky
      ambientOverlay: 'rgba(255, 255, 255, 0.02)',
      windowGlowColor: '#ffffff',
      lampLit: false,
      starsVisible: false,
      sunMoon: { type: 'sun', xRatio: 0.5, yRatio: 0.2 },
    };
  } else if (h >= 15 && h < 18) {
    // Afternoon (Asr)
    return {
      hour: h,
      period: 'afternoon',
      labelAr: 'هدوء الأصيل والعصر',
      skyColors: ['#075985', '#0284c7', '#fed7aa'], // Golden warm horizon
      ambientOverlay: 'rgba(251, 146, 60, 0.08)',
      windowGlowColor: '#fde047',
      lampLit: false,
      starsVisible: false,
      sunMoon: { type: 'sun', xRatio: 0.75, yRatio: 0.5 },
    };
  } else if (h >= 18 && h < 20) {
    // Sunset (Maghrib)
    return {
      hour: h,
      period: 'sunset',
      labelAr: 'حمرة الغروب والشهق',
      skyColors: ['#312e81', '#9f1239', '#f97316'], // Deep indigo, crimson to orange
      ambientOverlay: 'rgba(120, 53, 15, 0.3)',
      windowGlowColor: '#f97316',
      lampLit: true,
      starsVisible: false,
      sunMoon: { type: 'sun', xRatio: 0.9, yRatio: 0.85 },
    };
  } else if (h >= 20 && h < 22) {
    // Dusk (Isha)
    return {
      hour: h,
      period: 'dusk',
      labelAr: 'العشاء وسكون الغسق',
      skyColors: ['#0f172a', '#1e1b4b', '#312e81'], // Twilight dark indigo
      ambientOverlay: 'rgba(15, 23, 42, 0.45)',
      windowGlowColor: '#818cf8',
      lampLit: true,
      starsVisible: true,
      sunMoon: { type: 'moon', xRatio: 0.25, yRatio: 0.5 },
    };
  } else {
    // Night / Midnight (22:00 - 04:00)
    return {
      hour: h,
      period: 'night',
      labelAr: 'سكون الليل وهزيع السحر',
      skyColors: ['#020617', '#0f172a', '#1e293b'], // Midnight deep space
      ambientOverlay: 'rgba(2, 6, 23, 0.55)',
      windowGlowColor: '#38bdf8',
      lampLit: true,
      starsVisible: true,
      sunMoon: { type: 'moon', xRatio: 0.5, yRatio: 0.3 },
    };
  }
}

export function useTimeOfDayLighting(overrideHour?: number) {
  const [timeInfo, setTimeInfo] = useState<TimeOfDayInfo>(() =>
    getTimeOfDayInfo(overrideHour)
  );

  useEffect(() => {
    setTimeInfo(getTimeOfDayInfo(overrideHour));

    if (overrideHour !== undefined) return;

    // Update lighting every 60 seconds
    const interval = setInterval(() => {
      setTimeInfo(getTimeOfDayInfo());
    }, 60000);

    return () => clearInterval(interval);
  }, [overrideHour]);

  return timeInfo;
}
