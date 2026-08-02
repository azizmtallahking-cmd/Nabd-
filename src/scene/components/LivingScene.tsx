/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTimeOfDayLighting, TimeOfDayInfo } from '../hooks/useTimeOfDayLighting';
import { MENTOR_SPRITE_SRC } from '../assets/mentorSprite';
import { MentorFigure, MentorPresenceLevel } from './MentorFigure';
import { Chalkboard } from './Chalkboard';
import { ChalkboardState } from '../data/chalkboardSchema';
import { DailyNotebookIcon } from './DailyNotebookIcon';
import { DailyNotebookModal } from './DailyNotebookModal';
import { DailyNotebookState, NotebookMessage } from '../data/notebookSchema';
import { Clock, Sun, Moon, Sparkles, SlidersHorizontal, Info } from 'lucide-react';

interface LivingSceneProps {
  initialGoal?: string;
  className?: string;
}

export const LivingScene: React.FC<LivingSceneProps> = ({
  initialGoal = 'تزكية النفس وبناء السكينة من خلال الورد اليومي',
  className = '',
}) => {
  // Simulated hour override for dev/admin testing (null means use real time)
  const [simulatedHour, setSimulatedHour] = useState<number | undefined>(undefined);
  const timeInfo = useTimeOfDayLighting(simulatedHour);

  // Mentor Presence Level (default 'full' per system requirements)
  const [presenceLevel] = useState<MentorPresenceLevel>('full');

  // Chalkboard Dialogue State
  const [chalkboardState, setChalkboardState] = useState<ChalkboardState>({
    mainGoalText: initialGoal,
    currentMessage: 'أهلاً بك يا سالك. اجعل خطواتك اليوم هادئة، وركّز على نية ثابتة في كل عمل تؤديه.',
    isTyping: false,
  });

  // Notebook Dialogue History State
  const [notebookState, setNotebookState] = useState<DailyNotebookState>({
    date: new Date().toISOString().split('T')[0],
    messages: [
      {
        id: '1',
        sender: 'mentor',
        text: 'أهلاً بك يا سالك. اجعل خطواتك اليوم هادئة، وركّز على نية ثابتة في كل عمل تؤديه.',
        timestamp: '08:00 ص',
      },
      {
        id: '2',
        sender: 'user',
        text: 'صباح الخير يا مرشدي. يسعدني البدء بنية صادقة اليوم.',
        timestamp: '08:02 ص',
      },
    ],
    isOpen: false,
  });

  // Canvas ref for procedural environment background rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw procedural Canvas pixel environment
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const renderCanvas = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. SKY GRADIENT THROUGH ARCHED WINDOW
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      skyGradient.addColorStop(0, timeInfo.skyColors[0]);
      skyGradient.addColorStop(0.5, timeInfo.skyColors[1]);
      skyGradient.addColorStop(1, timeInfo.skyColors[2]);
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. STARS AT NIGHT / DUSK
      if (timeInfo.starsVisible) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 40; i++) {
          const sx = (i * 37) % width;
          const sy = (i * 19) % (height * 0.4);
          const twinkle = Math.sin(tick * 0.05 + i) * 0.4 + 0.6;
          ctx.globalAlpha = twinkle;
          ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1.0;
      }

      // 3. SUN / MOON
      const sunMoonX = width * timeInfo.sunMoon.xRatio;
      const sunMoonY = height * 0.3 * timeInfo.sunMoon.yRatio;

      if (timeInfo.sunMoon.type === 'sun') {
        const sunGlow = ctx.createRadialGradient(sunMoonX, sunMoonY, 5, sunMoonX, sunMoonY, 40);
        sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        sunGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunMoonX, sunMoonY, 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sunMoonX, sunMoonY, 12, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.arc(sunMoonX, sunMoonY, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. GARDEN HILLS & PIXEL TREES IN WINDOW
      // Distant Hills
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.ellipse(width * 0.3, height * 0.52, width * 0.4, 60, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.ellipse(width * 0.75, height * 0.54, width * 0.4, 70, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pixel Trees
      for (let t = 0; t < 6; t++) {
        const tx = width * 0.15 + t * (width * 0.14);
        const ty = height * 0.46;
        ctx.fillStyle = '#0f3822';
        ctx.fillRect(tx, ty, 6, 24); // Trunk
        ctx.fillStyle = t % 2 === 0 ? '#166534' : '#15803d'; // Foliage
        ctx.beginPath();
        ctx.arc(tx + 3, ty - 10, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. INDOOR ARCHED WINDOW FRAME
      ctx.fillStyle = '#1c1917'; // Dark stone wall
      // Top wall section
      ctx.fillRect(0, 0, width, height * 0.15);
      // Left wall
      ctx.fillRect(0, 0, width * 0.08, height);
      // Right wall
      ctx.fillRect(width * 0.92, 0, width * 0.08, height);

      // Window Arch Surround
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 12;
      ctx.strokeRect(width * 0.08, height * 0.15, width * 0.84, height * 0.45);

      // 6. ROOM FLOOR & WOODEN DESK STRUCTURE
      const floorY = height * 0.6;
      ctx.fillStyle = '#292524'; // Wooden floor base
      ctx.fillRect(0, floorY, width, height - floorY);

      // Floor Planks Lines
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 2;
      for (let p = 0; p < 8; p++) {
        ctx.beginPath();
        ctx.moveTo(0, floorY + p * 25);
        ctx.lineTo(width, floorY + p * 25);
        ctx.stroke();
      }

      // Wooden Desk in Foreground
      const deskY = height * 0.72;
      ctx.fillStyle = '#451a03'; // Desk top
      ctx.fillRect(width * 0.05, deskY, width * 0.9, 18);
      ctx.fillStyle = '#27272a'; // Desk base
      ctx.fillRect(width * 0.08, deskY + 18, width * 0.84, height - (deskY + 18));

      // 7. AMBIENT LIGHTING OVERLAY ACCORDING TO TIME OF DAY
      ctx.fillStyle = timeInfo.ambientOverlay;
      ctx.fillRect(0, 0, width, height);

      // 8. LAMP GLOW IF LAMP LIT
      if (timeInfo.lampLit) {
        const lampX = width * 0.85;
        const lampY = deskY - 10;

        const lampGradient = ctx.createRadialGradient(lampX, lampY, 5, lampX, lampY, 160);
        lampGradient.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        lampGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = lampGradient;
        ctx.beginPath();
        ctx.arc(lampX, lampY, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [timeInfo]);

  // Handle Chalkboard Interaction (Placeholder callback)
  const handleChalkboardInteract = () => {
    const placeholderQuotes = [
      'الاستقامة في الورد البسيط خَيْرٌ من عملٍ كثيرٍ يقطعه الفتور.',
      'احرص على صفاء القلب قبل حركة الجوارح، فالمحرك الأساسي هو النية.',
      'طريق السلوك خُطوات متئدة؛ لا تستعجل ثمار الغرس في أول يوم.',
      'تذكر أن السكينة تفيض من الداخل حين تصدق مع نفسك ومع ربك.',
    ];
    const nextQuote = placeholderQuotes[Math.floor(Math.random() * placeholderQuotes.length)];
    
    setChalkboardState((prev) => ({
      ...prev,
      currentMessage: nextQuote,
    }));

    // Add to notebook history
    setNotebookState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: Date.now().toString(),
          sender: 'mentor',
          text: nextQuote,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }));
  };

  // Handle Sending a user reply in notebook
  const handleUserSendMessage = (text: string) => {
    const userMsg: NotebookMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    const mentorReplyText = 'سمعت منك يا سالك. بارك الله في صدقك، وواصل خُطواتك بتأنٍ وثبات.';
    const mentorMsg: NotebookMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'mentor',
      text: mentorReplyText,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setNotebookState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg, mentorMsg],
    }));

    setChalkboardState((prev) => ({
      ...prev,
      currentMessage: mentorReplyText,
    }));
  };

  return (
    <div className={`relative w-full h-full min-h-[600px] bg-stone-950 overflow-hidden flex flex-col justify-between font-sans select-none ${className}`} dir="rtl">
      
      {/* BACKGROUND CANVAS LAYER */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={650}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* TOP ZERO-UI ATMOSPHERIC HEADER */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-stone-950/40 backdrop-blur-sm border-b border-stone-800/40 text-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-600/60 flex items-center justify-center text-emerald-400 font-bold shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold font-mono tracking-wide text-stone-100 flex items-center gap-2">
              <span>المشهد الحي (الحديقة والسبورة)</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                Zero-UI Mode
              </span>
            </h1>
            <p className="text-[11px] text-stone-400">بيئة التوجيه الرئيسية للسالك</p>
          </div>
        </div>

        {/* TIME OF DAY SWITCHER (Subtle dev control) */}
        <div className="flex items-center gap-2 bg-stone-900/80 p-1.5 rounded-lg border border-stone-800 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300 font-bold">{timeInfo.labelAr}</span>
          <span className="text-stone-500">({timeInfo.hour}:00)</span>

          {/* Quick hour selector buttons for previewing all lighting conditions */}
          <div className="flex items-center gap-1 ms-2 border-s border-stone-700 ps-2">
            {[
              { h: 5, label: 'فجر' },
              { h: 9, label: 'صباح' },
              { h: 13, label: 'ظهر' },
              { h: 17, label: 'عصر' },
              { h: 19, label: 'غروب' },
              { h: 21, label: 'عشاء' },
              { h: 1, label: 'ليل' },
            ].map((btn) => (
              <button
                key={btn.h}
                onClick={() => setSimulatedHour(btn.h === simulatedHour ? undefined : btn.h)}
                className={`px-1.5 py-0.5 text-[10px] rounded transition-all ${
                  simulatedHour === btn.h
                    ? 'bg-emerald-500 text-stone-950 font-bold'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
                title={`معاينة إضاءة ${btn.label}`}
              >
                {btn.label}
              </button>
            ))}
            {simulatedHour !== undefined && (
              <button
                onClick={() => setSimulatedHour(undefined)}
                className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded"
                title="العودة للوقت الحقيقي"
              >
                حقيقي
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN INTERACTIVE SCENE COMPONENT LAYOUT */}
      <div className="relative z-10 flex-1 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto w-full">
        
        {/* RIGHT SIDE: CHALKBOARD ON WALL */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Chalkboard
            state={chalkboardState}
            onInteract={handleChalkboardInteract}
            className="w-full max-w-lg"
          />
        </div>

        {/* LEFT SIDE: MENTOR FIGURE & DESK NOTEBOOK */}
        <div className="w-full md:w-1/2 flex flex-col md:flex-row items-center justify-around gap-6 relative">
          
          {/* MENTOR FIGURE */}
          <MentorFigure
            spriteSrc={MENTOR_SPRITE_SRC}
            presenceLevel={presenceLevel}
            onClick={handleChalkboardInteract}
            className="z-10"
          />

          {/* DAILY NOTEBOOK ON DESK */}
          <div className="flex flex-col items-center">
            <DailyNotebookIcon
              unreadCount={0}
              onClick={() => setNotebookState((prev) => ({ ...prev, isOpen: true }))}
            />
            <span className="text-[10px] text-emerald-300/80 font-mono mt-2 bg-stone-900/80 px-2 py-0.5 rounded border border-emerald-900/50">
              دفتر الحوار
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM SUBTLE FOOTER TIP */}
      <div className="relative z-10 p-3 bg-stone-950/70 border-t border-stone-800/40 text-[11px] text-stone-400 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>تفاعل مباشر: انقر على السبورة للاستماع للتوجيه، أو انقر على دفتر اليوم لفتح سجل الحوار كاملاً.</span>
        </div>
        <div className="text-stone-500 text-[10px]">
          [ نبض — المشهد الحي V1.0 ]
        </div>
      </div>

      {/* DAILY NOTEBOOK OVERLAY MODAL */}
      <DailyNotebookModal
        state={notebookState}
        onClose={() => setNotebookState((prev) => ({ ...prev, isOpen: false }))}
        onSendMessage={handleUserSendMessage}
      />
    </div>
  );
};
