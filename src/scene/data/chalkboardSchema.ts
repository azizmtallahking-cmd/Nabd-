/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChalkboardState {
  mainGoalText: string;        // الهدف الرئيسي المعروض أعلى السبورة (نص ثابت لهذا اليوم)
  currentMessage: string;       // آخر نقطة حوار من المرشد، تُعرض بتأثير الكتابة
  isTyping: boolean;             // هل تأثير الكتابة قيد التشغيل حالياً
}
