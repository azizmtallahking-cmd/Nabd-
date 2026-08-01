/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderGit2, 
  BarChart3, 
  ShieldAlert, 
  TestTube2, 
  Compass, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Lock
} from 'lucide-react';

interface AdminSidebarProps {
  currentRoom: string;
  onSelectRoom?: (roomKey: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentRoom,
  onSelectRoom
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: 'mentor-files',
      labelAr: 'غرفة ملفات المرشد',
      subtitleAr: 'إدارة العقل والمعرفة المعرفية',
      icon: FolderGit2,
      active: true,
      badge: 'نشط الأن'
    },
    {
      key: 'statistics',
      labelAr: 'الإحصائيات والتحليلات',
      subtitleAr: 'مؤشرات السلوك والنمو',
      icon: BarChart3,
      active: false,
      badge: 'قريباً'
    },
    {
      key: 'safety',
      labelAr: 'مركز السلامة والحوكمة',
      subtitleAr: 'ضوابط الأمان والاستجابة الطارئة',
      icon: ShieldAlert,
      active: false,
      badge: 'قريباً'
    },
    {
      key: 'experiments',
      labelAr: 'مختبر التجارب والفرضيات',
      subtitleAr: 'اختبار أنماط التوجيه الذكي',
      icon: TestTube2,
      active: false,
      badge: 'قريباً'
    },
    {
      key: 'paths-management',
      labelAr: 'إدارة مسارات السالكين',
      subtitleAr: 'تخصيص الخرائط الإيمانية والعامة',
      icon: Compass,
      active: false,
      badge: 'قريباً'
    }
  ];

  return (
    <aside 
      className={`bg-stone-900 border-l border-stone-800 text-stone-200 flex flex-col transition-all duration-300 select-none relative z-20 ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Header / Brand */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            {/* Pixel Logo Container */}
            <div className="w-9 h-9 bg-emerald-700/30 border-2 border-emerald-500/60 flex items-center justify-center rounded-sm shadow-[2px_2px_0px_0px_rgba(16,185,129,0.3)]">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-100 tracking-wide font-mono text-base">نبض</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-stone-400">لوحة القيادة الداخلية للمدير</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-9 h-9 bg-emerald-700/30 border-2 border-emerald-500/60 flex items-center justify-center rounded-sm mx-auto">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-100 border border-stone-700/60 rounded transition-colors"
          title={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Admin Info Banner */}
      {!collapsed && (
        <div className="px-4 py-3 bg-stone-950/30 border-b border-stone-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-stone-300 font-mono">عزيز (المدير)</span>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">النظام: نشط</span>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <div className={`px-2 py-1.5 text-[11px] font-mono text-stone-400 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>
          الغرف والمناطق (System Rooms)
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isCurrent = currentRoom === item.key;
          const isClickable = item.active;

          return (
            <button
              key={item.key}
              onClick={() => {
                if (isClickable && onSelectRoom) {
                  onSelectRoom(item.key);
                }
              }}
              disabled={!isClickable}
              className={`w-full text-right flex items-center gap-3 px-3 py-2.5 rounded border transition-all relative group ${
                isCurrent
                  ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200 shadow-[2px_2px_0px_0px_rgba(5,150,105,0.2)]'
                  : isClickable
                  ? 'bg-stone-800/40 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-stone-700'
                  : 'bg-stone-900/30 border-stone-800/50 text-stone-500 cursor-not-allowed opacity-75'
              }`}
              title={collapsed ? `${item.labelAr} (${item.badge})` : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${
                isCurrent ? 'text-emerald-400' : isClickable ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-600'
              }`} />

              {!collapsed && (
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold truncate ${isCurrent ? 'text-emerald-100' : ''}`}>
                      {item.labelAr}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-stone-800 text-stone-500 border border-stone-700/40'
                    }`}>
                      {!isClickable && <Lock className="w-2.5 h-2.5 inline-block ml-0.5 mb-0.5" />}
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">
                    {item.subtitleAr}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-stone-800 text-[10px] text-stone-500 bg-stone-950/40 flex items-center justify-between font-mono">
          <span>هوية Pixel Art • v1.4.0</span>
          <span className="text-emerald-500/80">غرفة الملفات</span>
        </div>
      )}
    </aside>
  );
};
