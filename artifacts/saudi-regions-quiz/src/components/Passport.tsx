import React, { useState, useEffect } from 'react';
import type { SavedJourney } from '../App';
import { regions } from '../data/regions';

interface PassportProps {
  journey: SavedJourney;
  onClose: () => void;
  onResume?: () => void;
}

// Region grid based on Riyadh's exact Figma coordinates:
// Box X: 57.05, Y: 231.76, W: 218.56, H: 155.56
// Center X = 11.55%, Center Y = 30.22%
const regionCoords: Record<string, { top: string, left: string }> = {
  // ── LEFT PAGE ─────────────────────────────────────────────
  // Col1 ≈ 11.55%, Col2 ≈ 35%  |  Rows ≈ 30%, 55%, 80% (card centers)
  // Badge placed in bottom-right of each card (+7% left, +7% top from center)
  'riyadh':   { top: '37%', left: '19%' },
  'makkah':   { top: '37%', left: '43%' },
  'madinah':  { top: '62%', left: '19%' },
  'qassim':   { top: '62%', left: '43%' },
  'eastern':  { top: '87%', left: '19%' },
  'asir':     { top: '87%', left: '43%' },

  // ── RIGHT PAGE ────────────────────────────────────────────
  // 4 rows, starting higher than left page
  'tabuk':    { top: '12%', left: '71%' },
  'hail':     { top: '12%', left: '91%' },
  'jazan':    { top: '37%', left: '71%' },
  'najran':   { top: '37%', left: '91%' },
  'bahah':    { top: '62%', left: '71%' },
  'northern-borders': { top: '62%', left: '91%' },
  'jouf':     { top: '87%', left: '71%' },
};

export function Passport({ journey, onClose, onResume }: PassportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coverSvg, setCoverSvg] = useState<string>('');
  const [pageSvg, setPageSvg] = useState<string>('');

  useEffect(() => {
    fetch('/passport-cover.svg')
      .then(res => res.text())
      .then(text => setCoverSvg(text));
      
    fetch('/passport-page.svg')
      .then(res => res.text())
      .then(text => setPageSvg(text));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform z-50"
      >
        &times;
      </button>

      {/* Ambient light glow behind passport */}
      <div
        className={`absolute transition-all duration-700 pointer-events-none rounded-full blur-3xl opacity-30 ${
          isOpen
            ? 'w-[80vw] max-w-5xl h-48 bg-amber-600/40 bottom-1/3'
            : 'w-64 h-96 bg-emerald-800/50'
        }`}
      />

      {/* Passport Book Container */}
      <div 
        className={`relative transition-all duration-700 ease-in-out ${
          isOpen
            ? 'w-full max-w-5xl aspect-[1440/1024]'
            : 'w-[58%] max-w-[220px] aspect-[255/354] cursor-pointer sm:w-[40%] sm:max-w-xs'
        }`}
        style={{
          /* Realistic 3-D book drop shadow */
          filter: isOpen
            ? 'drop-shadow(0 40px 60px rgba(0,0,0,0.7)) drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
            : 'drop-shadow(-8px 8px 20px rgba(0,0,0,0.8)) drop-shadow(-2px 4px 8px rgba(0,0,0,0.6))',
        }}
        onClick={() => !isOpen && setIsOpen(true)}
      >

        {!isOpen ? (
          // Cover State (Shows right half of passport-cover.svg)
          <div className="relative w-full h-full overflow-hidden rounded-r-2xl bg-transparent"
            style={{ cursor: 'pointer' }}
          >
            {/* SVG cover — 200% wide, anchored right so only right half is visible */}
            <div
              style={{
                position: 'absolute',
                top: 0, right: 0,
                width: '200%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {/* The inline SVG must fill this 200%-wide div */}
              <div
                style={{ width: '100%', height: '100%' }}
                dangerouslySetInnerHTML={{ __html: coverSvg }}
              />
            </div>

            {/* Spine shadow — left edge */}
            <div className="absolute inset-y-0 left-0 w-[8%] pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)',
              }}
            />

            {/* Top corner highlight */}
            <div className="absolute top-0 left-0 w-full h-[30%] pointer-events-none"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
              }}
            />

            {/* Sheen */}
            <div className="absolute inset-0 pointer-events-none rounded-r-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,0,0,0.12) 100%)',
              }}
            />

          </div>

        ) : (
          /* ── OPEN SPREAD ──────────────────────────────── */
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#F6F4EB]">
            {/* Page SVG background */}
            <div
              className="absolute inset-0 pointer-events-none [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: pageSvg }}
            />

            {/* Centre spine shadow (book binding) */}
            <div className="absolute inset-y-0 left-[49.5%] w-[1%] pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.07) 40%, transparent 100%)',
              }}
            />
            <div className="absolute inset-y-0 left-[50%] w-[1%] pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to left, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.07) 40%, transparent 100%)',
              }}
            />

            {/* Page curl shadow on outer edges */}
            <div className="absolute inset-y-0 left-0 w-[3%] pointer-events-none z-10"
              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 100%)' }}
            />
            <div className="absolute inset-y-0 right-0 w-[3%] pointer-events-none z-10"
              style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.25) 0%, transparent 100%)' }}
            />

            {/* Top light sheen on open pages */}
            <div className="absolute top-0 inset-x-0 h-[12%] pointer-events-none z-10"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%)' }}
            />

            {/* Badges / Stamps Overlay */}
            {regions.map((region) => {
              const coords = regionCoords[region.id];
              if (!coords) return null;
              
              const isCompleted = journey.completed.includes(region.id);

              return (
                <div 
                  key={region.id}
                  className="absolute flex flex-col items-center justify-center z-20"
                  style={{ 
                    top: coords.top, 
                    left: coords.left,
                    transform: 'translate(-50%, -50%)',
                    width: '10%',
                  }}
                >
                  <div className={`relative w-full aspect-square rounded-full border-[3px] border-dashed flex items-center justify-center transition-all duration-500
                    ${isCompleted ? 'border-[#DDB572] bg-[#DDB572]/20' : 'border-gray-300 bg-gray-50/50'}
                  `}>
                    {isCompleted ? (
                      <img src="/stamp-new.png" alt={`${region.name} Stamp`} className="w-[85%] h-[85%] object-contain" />
                    ) : (
                      <span className="font-display text-gray-400 text-[1.5vw] opacity-50">?</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {!isOpen && (
        <p className="relative z-50 mt-5 text-center text-xs font-semibold uppercase tracking-[.22em] text-white/80">
          tap to open
        </p>
      )}

      {isOpen && journey.completed.length < regions.length && (
        <button
          onClick={() => onResume ? onResume() : onClose()}
          className="relative z-50 mt-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#004C42] px-8 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#006255] sm:text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Return to Questions
        </button>
      )}
    </div>
  );
}
