/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AdminSidebar } from './admin/shared/AdminSidebar';
import { MentorFilesRoom } from './admin/mentorFiles/MentorFilesRoom';
import { LivingScene } from './scene/components/LivingScene';

export default function App() {
  const [currentRoom, setCurrentRoom] = useState('living-scene');

  return (
    <div className="flex h-screen w-screen bg-stone-950 text-stone-100 overflow-hidden" dir="rtl">
      {/* Global Sidebar */}
      <AdminSidebar
        currentRoom={currentRoom}
        onSelectRoom={setCurrentRoom}
      />

      {/* Main Room View */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {currentRoom === 'living-scene' ? (
          <LivingScene />
        ) : currentRoom === 'mentor-files' ? (
          <MentorFilesRoom />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-950 text-stone-400 font-mono">
            <div className="w-16 h-16 border-2 border-stone-800 rounded bg-stone-900 flex items-center justify-center text-stone-500 mb-4">
              🔒
            </div>
            <h2 className="text-sm font-bold text-stone-300">هذه الغرفة قيد التطوير المستقبلية (Under Development)</h2>
            <p className="text-xs text-stone-500 mt-1 max-w-sm text-center">
              حالياً "المشهد الحي" و"غرفة ملفات المرشد" هما المتاحتان والنشطتان في هذه المرحلة من البناء.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

