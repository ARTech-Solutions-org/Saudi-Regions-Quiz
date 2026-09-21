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
  const [isOpen, setIsOpen] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [page, setPage] = useState(0); // 0 = Cover, 1 = Intro, 2 = Stamps
  const [flipping, setFlipping] = useState<'forward'|'backward'|null>(null);

  const [coverSvg, setCoverSvg] = useState<string>('');
  const [pageSvg, setPageSvg] = useState<string>('');
  const [introSvg, setIntroSvg] = useState<string>('');

  const turnPage = (direction: 'forward'|'backward') => {
    if (flipping) return;
    setFlipping(direction);
    setTimeout(() => {
      setPage(prev => direction === 'forward' ? prev + 1 : prev - 1);
      setFlipping(null);
    }, 700);
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

  const introSpread = (
    <>
      <div
        className="absolute inset-0 pointer-events-none [&>svg]:w-full [&>svg]:h-full"
        dangerouslySetInnerHTML={{ __html: introSvg }}
      />
      <div className="absolute text-[#004D40] font-display text-[1.5vw] font-bold z-10 flex items-center px-[2%] whitespace-nowrap overflow-hidden text-ellipsis" style={{ top: '28%', left: '3.5%', width: '40%', height: '6.64%' }}>
        {journey.player?.name}
      </div>
      <div className="absolute text-[#004D40] font-display text-[1.2vw] font-bold z-10 flex items-center px-[2%] whitespace-nowrap overflow-hidden text-ellipsis" style={{ top: '45.5%', left: '3.5%', width: '40%', height: '6.64%' }}>
        {journey.player?.email}
      </div>
      <div className="absolute text-[#004D40] font-display text-[1.5vw] font-bold z-10 flex items-center px-[2%] whitespace-nowrap overflow-hidden text-ellipsis" style={{ top: '63%', left: '3.5%', width: '40%', height: '6.64%' }}>
        {journey.player?.phone}
      </div>
    </>
  );

  const stampsSpread = (
    <div className="w-full h-full transform scale-[1.03] origin-center">
      <img src="/passport-page.svg" className="absolute inset-0 w-full h-full object-cover" alt="Passport Page" />

      {regions.map((region, index) => {
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
            <div
              className={`relative w-full aspect-square rounded-full border-[3px] border-dashed flex items-center justify-center transition-all duration-500 ${
                isCompleted ? 'border-[#DDB572] bg-[#DDB572]/20' : 'border-gray-300 bg-gray-50/50'
              } ${isCompleted ? 'stamp-pop' : ''}`}
              style={{ animationDelay: `${index * 55}ms` }}
            >
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
  );

  useEffect(() => {
    fetch('/passport-intro.svg')
      .then(res => res.text())
      .then(text => setIntroSvg(text));
  }, []);

  return (
    <div className="overlay-in fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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
            ? 'w-[90%] sm:w-[80%] md:w-[70%] max-w-3xl aspect-[1440/1024]'
            : 'w-[58%] max-w-[220px] aspect-[255/354] cursor-pointer sm:w-[40%] sm:max-w-xs'
        }`}
        style={{
          filter: isOpen
            ? 'drop-shadow(0 40px 60px rgba(0,0,0,0.7)) drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
            : 'drop-shadow(-8px 8px 20px rgba(0,0,0,0.8)) drop-shadow(-2px 4px 8px rgba(0,0,0,0.6))',
        }}
        onClick={() => { if (page === 0) { setIsOpen(true); setTimeout(() => setPage(1), 50); } }}
      >

        {page === 0 ? (
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
              <img src="/passport-cover.svg" className="w-full h-full object-fill" alt="Passport Cover" />
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
            {/* Page turning areas */}
            {page > 1 && !flipping && (
              <div 
                className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-50 hover:bg-black/5 transition-colors"
                onClick={() => turnPage('backward')}
              />
            )}
            {page === 1 && !flipping && (
              <div 
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-50 hover:bg-black/5 transition-colors"
                onClick={() => turnPage('forward')}
              />
            )}

            {/* Static pages when not flipping */}
            {!flipping && (
              <div className="absolute inset-0">
                {page === 1 ? introSpread : stampsSpread}
              </div>
            )}

            {/* Flipping Forward (Page 1 -> Page 2) */}
            {flipping === 'forward' && (
              <>
                <div className="absolute top-0 left-0 w-[50%] h-full overflow-hidden">
                  <div className="absolute top-0 w-[200%] h-full left-0">{introSpread}</div>
                </div>
                <div className="absolute top-0 right-0 w-[50%] h-full overflow-hidden">
                  <div className="absolute top-0 w-[200%] h-full right-0">{stampsSpread}</div>
                </div>

                <div className="absolute top-0 left-[50%] w-[50%] h-full z-40 page-turn-forward" style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}>
                  <div className="absolute inset-0 overflow-hidden backface-hidden">
                    <div className="absolute top-0 w-[200%] h-full right-0">{introSpread}</div>
                  </div>
                  <div className="absolute inset-0 overflow-hidden backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                    <div className="absolute top-0 w-[200%] h-full left-0">{stampsSpread}</div>
                  </div>
                </div>
              </>
            )}

            {/* Flipping Backward (Page 2 -> Page 1) */}
            {flipping === 'backward' && (
              <>
                <div className="absolute top-0 left-0 w-[50%] h-full overflow-hidden">
                  <div className="absolute top-0 w-[200%] h-full left-0">{introSpread}</div>
                </div>
                <div className="absolute top-0 right-0 w-[50%] h-full overflow-hidden">
                  <div className="absolute top-0 w-[200%] h-full right-0">{stampsSpread}</div>
                </div>

                <div className="absolute top-0 left-0 w-[50%] h-full z-40 page-turn-backward" style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}>
                  <div className="absolute inset-0 overflow-hidden backface-hidden">
                    <div className="absolute top-0 w-[200%] h-full left-0">{stampsSpread}</div>
                  </div>
                  <div className="absolute inset-0 overflow-hidden backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                    <div className="absolute top-0 w-[200%] h-full right-0">{introSpread}</div>
                  </div>
                </div>
              </>
            )}

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
          </div>
        )}

      </div>

      {!isOpen && (
        <p className="relative z-50 mt-5 text-center text-xs font-semibold uppercase tracking-[.22em] text-white/80">
          tap to open
        </p>
      )}

      {isOpen && (
        <div className="relative z-50 mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onResume ? onResume() : onClose()}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#004C42] px-8 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#006255] sm:text-lg"
          >
            {journey.completed.length < regions.length ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Return to Questions
              </>
            ) : (
              'Close Passport'
            )}
          </button>
          
          <button
            onClick={generatePDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#DDB572] px-8 py-3 text-sm font-bold text-[#004C42] shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#c9a05f] sm:text-lg disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isGeneratingPdf ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Generating PDF...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download PDF
              </>
            )}
          </button>
          
          {onRestart && (
            <div className="w-full mt-2 flex justify-center">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset your passport and start over? All progress will be lost.')) {
                    onRestart();
                  }
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-2 text-sm font-bold text-[#004C42] shadow-sm transition-all duration-300 hover:bg-[#004C42]/10 sm:text-base border border-[#004C42]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Start Over
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden PDF Template */}
      {isOpen && <PassportPdfTemplate ref={pdfRef} regions={regions} journey={journey} />}
    </div>
  );
}
