/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import frame01 from '../../assets/images/mentor_pixel_frame1_1786146073358.jpg';
import frame02 from '../../assets/images/mentor_pixel_frame2_1786146087810.jpg';
import frame03 from '../../assets/images/mentor_pixel_frame3_1786146101929.jpg';
import frameBlink from '../../assets/images/mentor_pixel_blink_1786146112452.jpg';

export interface MentorAnimationClip {
  name: string;
  frames: string[];        // مسارات صور الإطارات المتتالية بالترتيب
  frameDurationMs: number;  // مدة عرض كل إطار بالميلي ثانية
  loop: boolean;
}

export const MENTOR_SPRITE_SRC = frame01;

export const MENTOR_ANIMATIONS: Record<string, MentorAnimationClip> = {
  idle: {
    name: 'idle',
    frames: [
      frame01,
      frame02,
      frame03,
      frame02,
    ],
    frameDurationMs: 600,   // تنفّس سكون هادئ وبطيء جداً
    loop: true,
  },
  blink: {
    name: 'blink',
    frames: [
      frame01,
      frameBlink,
      frame01,
    ],
    frameDurationMs: 120,   // الرمش سريع نسبياً وقصير، يتكرر نادراً لا باستمرار
    loop: false,
  },
};
