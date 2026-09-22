import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PassportPdfTemplate } from './PassportPdfTemplate';
import type { SavedJourney } from '../App';
import { regions } from '../data/regions';

interface PassportProps {
  journey: SavedJourney;
  onClose: () => void;
  onResume?: () => void;
  onRestart?: () => void;
}

export const regionCoords: Record<string, { top: string, left: string }> = {
  // ── LEFT PAGE ─────────────────────────────────────────────
  'riyadh': { top: '35.32%', left: '17.72%' },
  'makkah': { top: '35.32%', left: '38.34%' },
  'jeddah': { top: '56.02%', left: '17.70%' },
  'madinah': { top: '56.02%', left: '38.35%' },
  'eastern': { top: '76.42%', left: '17.67%' },
  'qassim': { top: '76.56%', left: '38.35%' },

  // ── RIGHT PAGE ────────────────────────────────────────────
  'asir': { top: '14.84%', left: '62.82%' },
  'tabuk': { top: '14.80%', left: '83.35%' },
  'hail': { top: '35.46%', left: '62.82%' },
  'jazan': { top: '35.37%', left: '83.35%' },
  'najran': { top: '56.07%', left: '62.85%' },
  'bahah': { top: '55.94%', left: '83.35%' },
  'northern-borders': { top: '76.68%', left: '62.85%' },
  'jouf': { top: '76.51%', left: '83.35%' },
};

export function Passport({ journey, onClose, onResume, onRestart }: PassportProps) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [page, setPage] = useState(0); // 0 = front closed, 1 = open stamps, 2 = back closed
  const [flipping, setFlipping] = useState<'forward' | 'backward' | null>(null);
  const [isClosing, setIsClosing] = useState(false); // extra strong closing animation

  const opened = page === 1 || flipping !== null;

  const turnPage = (direction: 'forward' | 'backward') => {
    if (flipping || isClosing) return;

    if (direction === 'forward' && page === 1) {
      // أقوى تقفيلة
      setFlipping('forward');
      setTimeout(() => {
        setIsClosing(true); // يبدأ الـ shrink + rotate
        setTimeout(() => {
          setPage(2);
          setFlipping(null);
          setIsClosing(false);
        }, 600);
      }, 750); // بعد ما اللفة تخلص تقريباً
    } else if (direction === 'backward' && page === 2) {
      setFlipping('backward');
      setTimeout(() => {
        setPage(1);
        setFlipping(null);
      }, 800);
    }
  };

  const generatePDF = async () => {
    if (!pdfRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [720, 1024]
      });

      const pages = Array.from(pdfRef.current.children) as HTMLElement[];

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 720,
          height: 1024,
          windowWidth: 1440,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage([720, 1024], 'portrait');
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, 720, 1024);
      }

      pdf.save('Saudi_Regions_Passport.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const BlankPage = (
    <div className="w-full h-full relative overflow-hidden bg-transparent" />
  );

  const StampsPage1 = (
    <div className="w-full h-full relative overflow-hidden bg-[#F6F4EB]">
      <div className="absolute top-0 left-0 w-[200%] h-full">
        <div className="w-full h-full transform scale-[1.03] origin-center">
          <img src="/passport-page.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
          {regions.map((region, index) => {
            const coords = regionCoords[region.id];
            if (!coords) return null;
            const isCompleted = journey.completed.includes(region.id);
            return (
              <div key={region.id} className="absolute flex flex-col items-center justify-center z-20" style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)', width: '10%' }}>
                <div className={`relative w-full aspect-square rounded-full border-[3px] border-dashed flex items-center justify-center transition-all duration-500 ${isCompleted ? 'border-[#DDB572] bg-[#DDB572]/20' : 'border-gray-300 bg-gray-50/50'} ${isCompleted ? 'stamp-pop' : ''}`} style={{ animationDelay: `${index * 55}ms` }}>
                  {isCompleted ? <img src="/stamp-new.png" alt={`${region.name} Stamp`} className="w-[85%] h-[85%] object-contain" /> : <span className="font-display text-gray-400 text-[1.5vw] opacity-50">?</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const StampsPage2 = (
    <div className="w-full h-full relative overflow-hidden bg-[#F6F4EB]">
      <div className="absolute top-0 right-0 w-[200%] h-full">
        <div className="w-full h-full transform scale-[1.03] origin-center">
          <img src="/passport-page.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
          {regions.map((region, index) => {
            const coords = regionCoords[region.id];
            if (!coords) return null;
            const isCompleted = journey.completed.includes(region.id);
            return (
              <div key={region.id} className="absolute flex flex-col items-center justify-center z-20" style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)', width: '10%' }}>
                <div className={`relative w-full aspect-square rounded-full border-[3px] border-dashed flex items-center justify-center transition-all duration-500 ${isCompleted ? 'border-[#DDB572] bg-[#DDB572]/20' : 'border-gray-300 bg-gray-50/50'} ${isCompleted ? 'stamp-pop' : ''}`} style={{ animationDelay: `${index * 55}ms` }}>
                  {isCompleted ? <img src="/stamp-new.png" alt={`${region.name} Stamp`} className="w-[85%] h-[85%] object-contain" /> : <span className="font-display text-gray-400 text-[1.5vw] opacity-50">?</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const BackCoverPage = (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <div style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '100%', pointerEvents: 'none' }}>
        <img src="/passport-cover-hq.png" className="w-full h-full object-fill" alt="Back Cover" />
      </div>
      <div className="absolute inset-y-0 right-0 w-[8%] pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)' }} />
      <div className="absolute inset-0 pointer-events-none rounded-l-2xl" style={{ background: 'linear-gradient(-135deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,0,0,0.12) 100%)' }} />
    </div>
  );

  return (
    <div className="overlay-in fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <button onClick={onClose} className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform z-50">
        &times;
      </button>

      <div className={`absolute transition-all duration-700 pointer-events-none rounded-full blur-3xl opacity-30 ${opened ? 'w-[80vw] max-w-5xl h-48 bg-amber-600/40 bottom-1/3' : 'w-64 h-96 bg-emerald-800/50'}`} />

      <div
        className={`relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${opened
            ? 'w-[90%] sm:w-[80%] md:w-[70%] max-w-3xl aspect-[1440/1024]'
            : 'w-[58%] max-w-[220px] aspect-[255/354] cursor-pointer sm:w-[40%] sm:max-w-xs'
          } ${isClosing ? 'scale-[0.92] rotate-[-2deg]' : ''}`}
        style={{
          filter: opened
            ? 'drop-shadow(0 40px 60px rgba(0,0,0,0.7)) drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
            : 'drop-shadow(-8px 8px 20px rgba(0,0,0,0.8)) drop-shadow(-2px 4px 8px rgba(0,0,0,0.6))',
          transformOrigin: 'center center',
        }}
        onClick={() => {
          if (page === 0 && !flipping && !isClosing) {
            setTimeout(() => setPage(1), 50);
          }
        }}
      >
        {/* ── الغلاف الأمامي (مقفول) ── */}
        {page === 0 && !flipping ? (
          <div
            className="relative w-full h-full overflow-hidden rounded-r-2xl bg-transparent"
            style={{
              cursor: 'pointer',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '200%', height: '100%', pointerEvents: 'none' }}>
              <img src="/passport-cover-hq.png" className="w-full h-full object-fill" alt="Passport Cover" />
            </div>
            <div className="absolute inset-y-0 left-0 w-[8%] pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)' }} />
            <div className="absolute top-0 left-0 w-full h-[30%] pointer-events-none" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />
            <div className="absolute inset-0 pointer-events-none rounded-r-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,0,0,0.12) 100%)' }} />
          </div>
        ) : page === 2 && !flipping ? (
          /* ── الغلاف الخلفي (مقفول) - أقوى نسخة ── */
          <div
            className="relative w-full h-full overflow-hidden rounded-l-2xl bg-transparent cursor-pointer"
            style={{
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            }}
            onClick={() => turnPage('backward')}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '100%', pointerEvents: 'none' }}>
              <img src="/passport-cover-hq.png" className="w-full h-full object-fill" alt="Back Cover" />
            </div>
            {/* spine shadow أقوى */}
            <div className="absolute inset-y-0 right-0 w-[10%] pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 45%, transparent 100%)' }} />
            <div className="absolute inset-0 pointer-events-none rounded-l-2xl" style={{ background: 'linear-gradient(-135deg, rgba(255,255,255,0.08) 0%, transparent 35%, rgba(0,0,0,0.15) 100%)' }} />
            {/* لمسة ضوء خفيفة */}
            <div className="absolute top-0 right-0 w-full h-[25%] pointer-events-none" style={{ background: 'linear-gradient(200deg, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
          </div>
        ) : (
          /* ── السبريد المفتوح + أنيميشن القلب ── */
          <div
            className="relative w-full h-full rounded-xl overflow-hidden"
            style={{ perspective: 2200, WebkitPerspective: 2200 }}
          >
            {page === 1 && !flipping && (
              <div
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-50 hover:bg-black/5 transition-colors"
                onClick={() => turnPage('forward')}
              />
            )}

            {page === 1 && !flipping && (
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full">{StampsPage1}</div>
                <div className="w-1/2 h-full">{StampsPage2}</div>
              </div>
            )}

            {/* تقليب للأمام (آخر صفحة) */}
            {flipping === 'forward' && (
              <>
                <div className="absolute top-0 left-0 w-[50%] h-full overflow-hidden">{StampsPage1}</div>
                <div className="absolute top-0 right-0 w-[50%] h-full overflow-hidden">{BackCoverPage}</div>
                <div
                  className="absolute top-0 left-[50%] w-[50%] h-full z-40 page-turn-forward"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
                >
                  <div className="absolute inset-0 overflow-hidden backface-hidden">{StampsPage2}</div>
                  <div className="absolute inset-0 overflow-hidden backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                    {BlankPage}
                  </div>
                </div>
              </>
            )}

            {/* تقليب للخلف */}
            {flipping === 'backward' && (
              <>
                <div className="absolute top-0 left-0 w-[50%] h-full overflow-hidden">{StampsPage1}</div>
                <div className="absolute top-0 right-0 w-[50%] h-full overflow-hidden">{BackCoverPage}</div>
                <div
                  className="absolute top-0 left-0 w-[50%] h-full z-40 page-turn-backward"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
                >
                  <div className="absolute inset-0 overflow-hidden backface-hidden">{BlankPage}</div>
                  <div className="absolute inset-0 overflow-hidden backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                    {StampsPage2}
                  </div>
                </div>
              </>
            )}

            {/* الظلال الداخلية */}
            <div className="absolute inset-y-0 left-[49.5%] w-[1%] pointer-events-none z-10" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.07) 40%, transparent 100%)' }} />
            <div className="absolute inset-y-0 left-[50%] w-[1%] pointer-events-none z-10" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.07) 40%, transparent 100%)' }} />
            <div className="absolute inset-y-0 left-0 w-[3%] pointer-events-none z-10" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 100%)' }} />
            <div className="absolute inset-y-0 right-0 w-[3%] pointer-events-none z-10" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.25) 0%, transparent 100%)' }} />
            <div className="absolute top-0 left-0 w-full h-[12%] pointer-events-none z-10" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%)' }} />
          </div>
        )}
      </div>

      {page !== 0 && !isGeneratingPdf && (
        <div className="mt-8 flex gap-4">
          <button onClick={generatePDF} className="bg-transparent border-2 border-[hsl(var(--accent))] text-[hsl(var(--accent))] px-6 py-2.5 rounded-xl font-bold font-display hover:bg-[hsl(var(--accent))]/10 transition-all shadow-lg active:scale-95 flex items-center gap-2">
            <span>PDF</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
          {onResume && journey.completed.length < 14 && (
            <button onClick={onResume} className="bg-[hsl(var(--primary))] border-2 border-[hsl(var(--primary))] text-[hsl(var(--card))] px-8 py-2.5 rounded-full font-bold font-display hover:bg-[hsl(var(--primary))]/80 transition-all shadow-lg active:scale-95">
              Resume Journey
            </button>
          )}
          {onRestart && journey.completed.length === 14 && (
            <button onClick={onRestart} className="bg-[hsl(var(--accent))] border-2 border-[hsl(var(--accent))] text-[hsl(var(--primary))] px-8 py-2.5 rounded-2xl font-bold font-display hover:scale-105 transition-all shadow-[0_0_20px_rgba(223,175,83,0.4)] active:scale-95">
              Play Again
            </button>
          )}
        </div>
      )}

      {isGeneratingPdf && (
        <div className="mt-8 text-white font-display font-bold animate-pulse">
          Preparing your passport...
        </div>
      )}

      <PassportPdfTemplate ref={pdfRef} regions={regions} journey={journey} />
    </div>
  );
}