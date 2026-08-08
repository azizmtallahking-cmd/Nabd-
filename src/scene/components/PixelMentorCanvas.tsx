/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { MentorState } from '../types/mentorSystem';
import { TimeOfDayInfo } from '../hooks/useTimeOfDayLighting';

interface PixelMentorCanvasProps {
  mentorState: MentorState;
  timeInfo?: TimeOfDayInfo;
  className?: string;
  width?: number;
  height?: number;
}

export const PixelMentorCanvas: React.FC<PixelMentorCanvasProps> = ({
  mentorState,
  timeInfo,
  className = '',
  width = 256,
  height = 384,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { animState, appearance, isBlinking, breathTick } = mentorState;
  const { palette, outfit, heldObject } = appearance;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable crisp pixel rendering without smoothing blur
    ctx.imageSmoothingEnabled = false;

    // HIGH FIDELITY LOGICAL GRID: 256 x 384 (Massive detail, true 8K-equivalent for pixel art)
    const GRID_W = 256;
    const GRID_H = 384;

    ctx.clearRect(0, 0, width, height);

    // Scaling factor from logical high-density grid to rendering canvas
    const scale = width / GRID_W;

    // Helper: Draw a precise pixel rectangle on the logical grid
    const px = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.floor(x * scale),
        Math.floor(y * scale),
        Math.max(1, Math.ceil(w * scale)),
        Math.max(1, Math.ceil(h * scale))
      );
    };

    // Helper: Draw a pixel-perfect dithered pattern for rich fabric/texture shading
    const pxDither = (x: number, y: number, w: number, h: number, col1: string, col2: string, type: 'checker' | 'h' | 'v') => {
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          let useCol1 = true;
          if (type === 'checker') useCol1 = (i + j) % 2 === 0;
          else if (type === 'h') useCol1 = j % 2 === 0;
          else if (type === 'v') useCol1 = i % 2 === 0;
          
          px(x + i, y + j, 1, 1, useCol1 ? col1 : col2);
        }
      }
    };

    // Helper: Draw an elliptical pixel cluster for soft floor shadows
    const ellipsePx = (centerX: number, centerY: number, rx: number, ry: number, color: string) => {
      ctx.fillStyle = color;
      for (let y = -ry; y <= ry; y++) {
        for (let x = -rx; x <= rx; x++) {
          if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) {
            px(centerX + x, centerY + y, 1, 1, color);
          }
        }
      }
    };

    // Helper: Blend colors to simulate lighting
    const hexToRgb = (hex: string) => {
      let r = 0, g = 0, b = 0;
      if (hex.startsWith('#')) {
        if (hex.length === 4) {
          r = parseInt(hex[1] + hex[1], 16);
          g = parseInt(hex[2] + hex[2], 16);
          b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
          r = parseInt(hex.substring(1, 3), 16);
          g = parseInt(hex.substring(3, 5), 16);
          b = parseInt(hex.substring(5, 7), 16);
        }
      } else if (hex.startsWith('rgb')) {
        const match = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          r = parseInt(match[1]); g = parseInt(match[2]); b = parseInt(match[3]);
        }
      }
      return { r, g, b };
    };

    const tintColor = (baseColor: string, tintColor: string | undefined, intensity: number = 0.3) => {
      if (!tintColor) return baseColor;
      const base = hexToRgb(baseColor);
      const tint = hexToRgb(tintColor);
      
      const r = Math.floor(base.r * (1 - intensity) + tint.r * intensity);
      const g = Math.floor(base.g * (1 - intensity) + tint.g * intensity);
      const b = Math.floor(base.b * (1 - intensity) + tint.b * intensity);
      
      return `rgb(${r},${g},${b})`;
    };

    // Determine ambient lighting from timeInfo
    const ambientTint = timeInfo?.ambientOverlay || 'rgba(0,0,0,0)';
    let lightIntensity = 0;
    if (ambientTint.includes('rgba')) {
      const parts = ambientTint.match(/rgba\([^,]+,[^,]+,[^,]+,([\d.]+)\)/);
      if (parts) {
        lightIntensity = parseFloat(parts[1]);
      }
    }
    
    // Convert ambient overlay to a color string we can use for blending
    let lightingColor = '#ffffff';
    if (timeInfo) {
      if (timeInfo.hour >= 18 || timeInfo.hour <= 5) lightingColor = '#1e1b4b'; // Night blue
      else if (timeInfo.hour === 17 || timeInfo.hour === 6) lightingColor = '#f59e0b'; // Golden hour
    }

    const tColor = (color: string) => tintColor(color, lightingColor, lightIntensity * 0.7);

    // --- ANIMATION & STATE ENGINE ---
    // Breathing: 0 to -2 pixel rise on the high-density grid
    let breathY = 0;
    if (animState !== 'SILENT') {
      breathY = Math.sin((breathTick * Math.PI) / 8) > 0 ? -1 : 0;
      if (animState === 'REFLECTIVE') breathY = Math.sin((breathTick * Math.PI) / 16) > 0 ? -1 : 0;
    }

    // Head tilt/offset for LISTENING, THINKING, SPEAKING
    let headX = 0;
    let headY = 0;
    if (animState === 'LISTENING') {
      headX = 2; // Lean forward/towards user
      headY = 1;
    } else if (animState === 'THINKING') {
      headX = -2;
      headY = -2; // Lean back/up
    } else if (animState === 'SPEAKING') {
      headY = Math.sin((breathTick * Math.PI) / 4) > 0 ? -1 : 0; // Subtle head bob
    } else if (animState === 'GREETING') {
      headY = 3; // Bow head
    } else if (animState === 'READING' || animState === 'WRITING') {
      headY = 4; // Look down
      headX = -2;
    }

    // Colors derived from palette, modified by environmental lighting
    const robeBase = tColor(palette.primaryRobe);
    const robeShadow = tColor(palette.robeShadow);
    const robeHighlight = tColor(palette.robeHighlight);
    const skinTone = tColor(palette.skinTone);
    const hairColor = tColor(palette.hairColor);
    const beardColor = tColor(palette.beardColor);
    const sashColor = tColor(palette.sashColor);
    const footwearColor = tColor(palette.footwearColor);

    // ========================================================================
    // LAYER 1: AMBIENT ENVIRONMENT (Floor Shadow)
    // ========================================================================
    ellipsePx(128, 360, 64, 12, 'rgba(0,0,0,0.4)');
    ellipsePx(128, 360, 40, 6, 'rgba(0,0,0,0.6)');

    // ========================================================================
    // LAYER 2: FOOTWEAR & LOWER LEGS (y = 344 to 362)
    // ========================================================================
    // Left shoe (Visually Right side of screen)
    px(140, 344, 24, 12, footwearColor);
    px(136, 348, 32, 8, footwearColor);
    px(136, 354, 32, 4, '#18181b'); // Dark sole
    px(144, 346, 12, 4, '#52525b'); // Leather specular highlight
    
    // Right shoe (Visually Left side of screen)
    px(92, 344, 24, 12, footwearColor);
    px(88, 348, 32, 8, footwearColor);
    px(88, 354, 32, 4, '#18181b'); // Dark sole
    px(96, 346, 12, 4, '#52525b'); // Leather specular highlight

    // ========================================================================
    // LAYER 3: ROBE & BODY (y = 104 to 348)
    // ========================================================================
    const robeTopY = 104 + breathY;
    const robeBottomY = 348;
    const robeH = robeBottomY - robeTopY;
    
    // Core Torso & Skirt Shape (Tapered silhouette)
    px(88, robeTopY, 80, robeH, robeBase); // Upper torso
    px(80, robeTopY + 60, 96, robeH - 60, robeBase); // Mid body
    px(72, robeTopY + 120, 112, robeH - 120, robeBase); // Lower skirt
    px(68, robeTopY + 180, 120, robeH - 180, robeBase); // Hem flare
    
    // Complex Fabric Folds & Draping (High-density pixel clusters)
    // Center fold overlap
    px(124, robeTopY + 20, 8, robeH - 20, robeShadow);
    px(126, robeTopY + 20, 4, robeH - 20, 'rgba(0,0,0,0.4)'); // Deep shadow crease
    
    // Left side fabric folds (visually left)
    px(92, robeTopY + 60, 12, robeH - 60, robeShadow);
    px(104, robeTopY + 80, 8, robeH - 80, robeHighlight);
    px(80, robeTopY + 140, 12, robeH - 140, robeShadow);
    pxDither(84, robeTopY + 140, 8, robeH - 140, robeBase, robeShadow, 'checker'); // Textured fabric shadow
    
    // Right side fabric folds (visually right)
    px(152, robeTopY + 60, 12, robeH - 60, robeShadow);
    px(144, robeTopY + 80, 8, robeH - 80, robeHighlight);
    px(164, robeTopY + 140, 12, robeH - 140, robeShadow);
    pxDither(164, robeTopY + 140, 8, robeH - 140, robeBase, robeShadow, 'checker');
    
    // Bottom Hem Shadowing
    px(68, robeBottomY - 8, 120, 8, robeShadow);
    px(68, robeBottomY - 4, 120, 4, 'rgba(0,0,0,0.5)');

    // ========================================================================
    // LAYER 4: WAIST SASH / BELT (y = 172 to 188)
    // ========================================================================
    const sashY = 172 + breathY;
    px(84, sashY, 88, 16, sashColor);
    px(80, sashY + 4, 96, 8, sashColor);
    px(80, sashY + 8, 96, 4, 'rgba(0,0,0,0.4)'); // Sash under-shadow
    
    // Sash tail hanging down
    px(132, sashY + 12, 16, 64, sashColor);
    px(132, sashY + 12, 4, 64, 'rgba(0,0,0,0.4)'); // Tail fold shadow
    px(132, sashY + 72, 16, 12, sashColor); // Fringe
    pxDither(132, sashY + 72, 16, 12, sashColor, 'rgba(0,0,0,0.6)', 'checker'); // Textured fringe
    
    // Outfit Specific Buckle / Accent
    if (outfit === 'formal' || outfit === 'special_event') {
        const trim = tColor(palette.trimColor || '#fbbf24');
        px(120, sashY + 2, 16, 12, trim);
        px(124, sashY + 4, 8, 8, '#fef08a'); // Metallic glint
    }

    // ========================================================================
    // LAYER 5: OUTFIT SPECIFIC MODIFIERS (Cloaks, Trims, etc.)
    // ========================================================================
    if (outfit === 'winter') {
        // Heavy Hooded Shoulder Cloak
        px(72, robeTopY - 8, 112, 48, tColor(palette.robeShadow));
        px(76, robeTopY - 4, 104, 40, robeBase);
        px(84, robeTopY + 4, 88, 32, sashColor); // Inner fur/lining
    } else if (outfit === 'formal' || outfit === 'special_event') {
        // Golden Filigree Embroidery Trim
        const trim = tColor(palette.trimColor || '#fbbf24');
        px(124, robeTopY, 8, sashY - robeTopY, trim);
        px(124, sashY + 16, 8, robeBottomY - sashY - 16, trim);
    } else if (outfit === 'religious_context') {
        // Pure White Thobe with subtle green collar trim
        px(120, robeTopY, 16, 60, sashColor);
        px(124, robeTopY + 4, 8, 56, robeBase);
    }

    // ========================================================================
    // LAYER 6: INNER SHIRT & NECK (Underneath Head)
    // ========================================================================
    const hX = 128 + headX;
    const hY = 44 + headY + breathY;
    
    px(116, hY + 52, 24, 12, tColor('#f8fafc')); // White inner collar
    px(112, hY + 56, 32, 8, sashColor); // Collar border trim
    px(120, hY + 44, 16, 12, skinTone); // Anatomical Neck
    px(120, hY + 50, 16, 6, 'rgba(0,0,0,0.3)'); // Neck shadow cast by chin/beard

    // ========================================================================
    // LAYER 7: ARMS & SLEEVES
    // ========================================================================
    // Left Arm (Right side of screen, x=164..192)
    const leftArmY = robeTopY + 12;
    px(164, leftArmY, 28, 112, robeBase);
    px(176, leftArmY, 16, 112, robeShadow); // Outer sleeve shadow
    px(168, leftArmY + 16, 8, 88, robeHighlight); // Sleeve fabric highlight
    px(160, leftArmY + 100, 36, 20, robeShadow); // Cuff inner void
    
    // Right Arm (Left side of screen, x=64..92)
    let rightArmY = robeTopY + 12;
    if (animState === 'THINKING' || heldObject !== 'none' || animState === 'READING' || animState === 'WRITING') {
        rightArmY -= 16; // Arm slightly raised
    }
    px(64, rightArmY, 28, 112, robeBase);
    px(64, rightArmY, 12, 112, robeShadow); // Outer sleeve shadow
    px(80, rightArmY + 16, 8, 88, robeHighlight); // Sleeve fabric highlight
    px(60, rightArmY + 100, 36, 20, robeShadow); // Cuff inner void

    // ========================================================================
    // LAYER 8: HANDS (Detailed Articulated Pixel Clusters)
    // ========================================================================
    // Left Hand (Right side)
    const lHx = 172;
    const lHy = leftArmY + 112;
    px(lHx, lHy, 16, 20, skinTone);
    px(lHx + 2, lHy + 2, 12, 12, 'rgba(255,255,255,0.2)'); // Skin highlight
    px(lHx, lHy + 12, 16, 8, 'rgba(0,0,0,0.25)'); // Knuckle/palm shadow
    px(lHx + 4, lHy + 14, 2, 6, 'rgba(0,0,0,0.35)'); // Finger separator
    px(lHx + 10, lHy + 14, 2, 6, 'rgba(0,0,0,0.35)'); // Finger separator

    // Right Hand (Left side, holds object)
    const rHx = 68;
    const rHy = rightArmY + 112;
    px(rHx, rHy, 16, 20, skinTone);
    px(rHx + 2, rHy + 2, 12, 12, 'rgba(255,255,255,0.2)');
    px(rHx, rHy + 12, 16, 8, 'rgba(0,0,0,0.25)');
    px(rHx + 4, rHy + 14, 2, 6, 'rgba(0,0,0,0.35)');
    px(rHx + 10, rHy + 14, 2, 6, 'rgba(0,0,0,0.35)');

    // ========================================================================
    // LAYER 9: HELD OBJECT SYSTEM
    // ========================================================================
    if (heldObject === 'prayer_beads') {
        const beadY = rHy + 16;
        const bShift = (breathTick % 4) * 2; // Subtle swinging animation
        px(rHx + 8, beadY, 4, 64, tColor('#d97706')); // Tension string
        for(let i=0; i<7; i++) {
            px(rHx + 4, beadY + i*8 + bShift, 12, 6, tColor('#fef08a')); // Beads
            px(rHx + 6, beadY + i*8 + bShift, 4, 2, '#ffffff'); // Bead glint
        }
        px(rHx + 2, beadY + 60 + bShift, 16, 16, tColor('#b45309')); // Silken tassel
    } else if (heldObject === 'book') {
        px(rHx - 8, rHy + 4, 32, 48, tColor('#78350f')); // Leather cover
        px(rHx - 4, rHy + 6, 24, 44, tColor('#fef3c7')); // Parchment pages
        px(rHx - 10, rHy + 4, 6, 48, tColor('#d97706'));  // Book spine
        px(rHx - 10, rHy + 28, 40, 4, tColor('#fbbf24')); // Ribbon bookmark
    } else if (heldObject === 'walking_stick') {
        px(rHx + 4, 40, 8, 320, tColor('#451a03')); // Long wooden staff
        px(rHx + 6, 40, 2, 320, tColor('#78350f')); // Wood grain highlight
        px(rHx, 32, 16, 16, tColor('#b45309')); // Carved pommel knob
        px(rHx + 2, 34, 6, 6, tColor('#fef08a')); // Pommel glint
    } else if (heldObject === 'notebook') {
        px(rHx - 8, rHy + 8, 32, 44, tColor('#fef3c7')); // Scroll parchment
        px(rHx - 10, rHy + 4, 36, 8, tColor('#d97706'));  // Wooden scroll end
        px(rHx + 12, rHy - 20, 8, 32, tColor('#f8fafc')); // White Feather Quill
        px(rHx + 14, rHy - 20, 2, 32, tColor('#cbd5e1')); // Quill shading
    } else if (heldObject === 'cup') {
        px(rHx - 2, rHy + 8, 20, 24, tColor('#78350f')); // Clay cup
        px(rHx, rHy + 10, 16, 20, tColor('#b45309'));      // Cup inner shadow
        px(rHx + 2, rHy + 10, 12, 4, tColor('#451a03'));   // Tea liquid
        const steamY = rHy - 8 - (breathTick % 6)*4;
        px(rHx + 4, steamY, 2, 8, 'rgba(255,255,255,0.6)'); // Steam particle 1
        px(rHx + 10, steamY - 8, 2, 8, 'rgba(255,255,255,0.4)'); // Steam particle 2
    }

    // ========================================================================
    // LAYER 10: HIGH-FIDELITY HEAD, FACE & EXPRESSION
    // ========================================================================
    // 10A. Base Skull & Face Shape
    px(hX - 24, hY, 48, 52, skinTone);
    px(hX - 28, hY + 16, 56, 28, skinTone); // Cheeks / Jaw width
    px(hX - 20, hY - 8, 40, 8, skinTone); // High forehead

    // 10B. Ears
    px(hX - 32, hY + 20, 8, 16, skinTone);
    px(hX + 24, hY + 20, 8, 16, skinTone);
    px(hX - 30, hY + 24, 4, 8, 'rgba(0,0,0,0.25)'); // Ear inner shadow
    px(hX + 26, hY + 24, 4, 8, 'rgba(0,0,0,0.25)');

    // 10C. Skin Highlighting & Shadow Contours (Adds depth/age)
    px(hX - 16, hY, 32, 12, 'rgba(255,255,255,0.25)'); // Forehead glow
    px(hX - 24, hY + 16, 8, 24, 'rgba(0,0,0,0.15)'); // Left cheek shadow
    px(hX + 16, hY + 16, 8, 24, 'rgba(0,0,0,0.15)'); // Right cheek shadow

    // 10D. Hair (Short, Neat, Grey-White)
    px(hX - 24, hY - 16, 48, 12, hairColor); // Top dome
    px(hX - 32, hY - 8, 64, 12, hairColor); // Upper sides
    px(hX - 32, hY + 4, 8, 20, hairColor); // Left sideburn
    px(hX + 24, hY + 4, 8, 20, hairColor); // Right sideburn
    // Hair Highlights & Locks
    px(hX - 16, hY - 12, 32, 6, tColor('#f8fafc')); // Crown sheen
    px(hX - 32, hY + 12, 4, 12, 'rgba(0,0,0,0.2)'); // Sideburn depth shadow
    px(hX + 28, hY + 12, 4, 12, 'rgba(0,0,0,0.2)');

    // 10E. Elaborate Layered Beard (Dignified & Wise)
    px(hX - 28, hY + 32, 56, 48, beardColor); // Main beard volume
    px(hX - 20, hY + 80, 40, 20, beardColor); // Middle taper
    px(hX - 12, hY + 100, 24, 12, beardColor);   // Lower taper
    px(hX - 4, hY + 112, 8, 8, beardColor);    // Tip
    
    // Beard Shading & Volumetric Details (4 levels of shading)
    px(hX - 16, hY + 48, 32, 40, tColor('#e2e8f0')); // Lighter front volume
    px(hX - 8, hY + 56, 16, 32, tColor('#f8fafc')); // Brightest center sheen
    px(hX - 28, hY + 44, 12, 28, 'rgba(0,0,0,0.15)'); // Left edge drop shadow
    px(hX + 16, hY + 44, 12, 28, 'rgba(0,0,0,0.15)'); // Right edge drop shadow

    // 10F. Mustache
    px(hX - 20, hY + 36, 40, 10, beardColor);
    px(hX - 16, hY + 38, 32, 4, tColor('#f8fafc')); // Mustache highlight

    // 10G. Sculpted Nose
    px(hX - 6, hY + 16, 12, 20, skinTone);
    px(hX - 4, hY + 16, 4, 16, 'rgba(255,255,255,0.3)'); // Nose bridge highlight
    px(hX + 2, hY + 20, 4, 16, 'rgba(0,0,0,0.15)'); // Nose bridge shadow
    px(hX - 8, hY + 32, 16, 6, 'rgba(0,0,0,0.15)'); // Under-nose / nostril shadow

    // 10H. Expressive Eyes & Brows
    const eyeY = hY + 12;
    
    // Eyebrows
    px(hX - 20, eyeY - 8, 16, 4, beardColor);
    px(hX + 4, eyeY - 8, 16, 4, beardColor);
    px(hX - 16, eyeY - 8, 8, 2, tColor('#f8fafc')); // Brow glint
    px(hX + 8, eyeY - 8, 8, 2, tColor('#f8fafc'));

    // Dynamic Eye Logic
    if (isBlinking || animState === 'SILENT') {
        // Closed Eyelids (Serene 2px dark line with upper lid shadow)
        px(hX - 18, eyeY + 4, 14, 2, '#27272a'); // Left closed
        px(hX + 4, eyeY + 4, 14, 2, '#27272a'); // Right closed
        px(hX - 18, eyeY + 2, 14, 2, 'rgba(0,0,0,0.25)'); // Eyelid shadow
        px(hX + 4, eyeY + 2, 14, 2, 'rgba(0,0,0,0.25)');
    } else {
        // Open Expressive Eyes
        // Left Eye
        px(hX - 18, eyeY, 14, 8, tColor('#f8fafc')); // Sclera (White)
        px(hX - 14, eyeY, 8, 8, '#18181b'); // Iris/Pupil
        px(hX - 12, eyeY + 2, 2, 2, '#ffffff'); // Specular glint
        px(hX - 18, eyeY, 14, 2, 'rgba(0,0,0,0.3)'); // Top eyelid cast shadow
        
        // Right Eye
        px(hX + 4, eyeY, 14, 8, tColor('#f8fafc')); 
        px(hX + 8, eyeY, 8, 8, '#18181b'); 
        px(hX + 10, eyeY + 2, 2, 2, '#ffffff'); 
        px(hX + 4, eyeY, 14, 2, 'rgba(0,0,0,0.3)');

        // Contextual Eye Movement
        if (animState === 'THINKING' || animState === 'LISTENING') {
            // Shift eyes / glint slightly up and left/right
            px(hX - 12, eyeY + 2, 2, 2, '#18181b'); // Clear old glint
            px(hX + 10, eyeY + 2, 2, 2, '#18181b');
            const shiftX = animState === 'THINKING' ? -2 : 2;
            px(hX - 14 + shiftX, eyeY + 2, 2, 2, '#ffffff'); // New glint position
            px(hX + 8 + shiftX, eyeY + 2, 2, 2, '#ffffff');
        }
    }

    // 10I. Mouth & Lips
    const mouthY = hY + 44;
    if (animState === 'SPEAKING' && breathTick % 2 === 0) {
        // Gentle mouth opening shift when speaking
        px(hX - 8, mouthY, 16, 6, tColor('#7f1d1d')); // Open mouth cavity
        px(hX - 4, mouthY + 2, 8, 2, tColor('#fef08a')); // Subtle teeth hint
    } else {
        // Calm dignified closed mouth line
        px(hX - 8, mouthY, 16, 2, tColor('#451a03')); 
        px(hX - 6, mouthY - 2, 12, 2, 'rgba(255,255,255,0.15)'); // Upper lip highlight
    }

  }, [mentorState, width, height, timeInfo]);

  // Presence opacity mapping smoothly fades the canvas
  const presenceOpacityMap: Record<string, number> = {
    full: 1.0,
    reduced: 0.75,
    minimal: 0.45,
    withdrawn: 0.15,
  };

  const opacity = presenceOpacityMap[mentorState.presenceLevel] ?? 1.0;

  return (
    <div
      className={`relative inline-block select-none transition-opacity duration-700 ${className}`}
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-auto h-auto max-h-[420px] object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
