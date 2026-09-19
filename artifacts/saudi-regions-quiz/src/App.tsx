import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, LockKeyhole, Map, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { regions, totalQuestions, type Region } from '@/data/regions';
import { Passport } from './components/Passport';
import WelcomeSVG from '@assets/Desktop_-_1.svg?url';
import quizImage from '@assets/Desktop_-_13_1789746964446.png';
import completionImage from '@assets/Desktop_-_3_1789746967440.png';
import finalImage from '@assets/Desktop_-_4_1789746969797.png';
import { saveJourney as apiSaveJourney, loadJourney as apiLoadJourney } from './api/db';

const queryClient = new QueryClient();
const STORAGE_KEY = 'saudi-passport-journey-v1';

export type SavedJourney = {
  player: { name: string; email: string } | null;
  completed: string[];
  answers: Record<string, number[]>;
  score: number;
  currentRegion: string | null;
  currentQuestion: number;
};

const blankJourney: SavedJourney = {
  player: null, completed: [], answers: {}, score: 0, currentRegion: null, currentQuestion: 0,
};

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || target === 0) {
      setValue(target);
      return;
    }
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setValue(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function loadJourney(): SavedJourney {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...blankJourney, ...JSON.parse(stored) } : blankJourney;
  } catch {
    return blankJourney;
  }
}

function saveJourney(journey: SavedJourney) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
}

function BrandBar({ onHome }: { onHome: () => void }) {
  return (
    <header className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12" style={{ borderBottom: '1px solid rgba(0,76,64,.12)', background: 'rgba(255,253,247,.72)', backdropFilter: 'blur(14px)' }}>
      <button onClick={onHome} data-testid="button-brand-home" className="group flex items-center gap-3 border-0 bg-transparent p-0 text-left">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold tracking-tighter transition-transform group-hover:-rotate-6" style={{ background: '#00594d', color: '#f8e4a8' }}>SA</span>
        <span>
          <span className="block font-display text-base font-bold tracking-[.14em]">THE PASSPORT</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[.22em]" style={{ color: '#668078' }}>Saudi regions / 2025</span>
        </span>
      </button>
      <div className="hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[.18em] sm:flex" style={{ color: '#668078' }}>
        <span className="h-2 w-2 rounded-full" style={{ background: '#d7a34d' }} />
        Saudi National Day edition
      </div>
    </header>
  );
}

function PrimaryButton({ children, onClick, disabled = false, testId, secondary = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; testId: string; secondary?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-bold tracking-[.03em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
      style={secondary ? { border: '1px solid rgba(0,83,72,.4)', background: 'transparent', color: '#00594d' } : { background: '#00594d', color: '#fffaf0', boxShadow: '0 8px 20px rgba(0,89,77,.16)' }}
    >
      {children}
    </button>
  );
}

function Welcome({ journey, onStart }: { journey: SavedJourney; onStart: (name: string, email: string) => void }) {
  const [name, setName] = useState(journey.player?.name ?? '');
  const [email, setEmail] = useState(journey.player?.email ?? '');
  const [touched, setTouched] = useState(false);
  const hasResume = Boolean(journey.player);
  const valid = name.trim().length > 1 && email.includes('@');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (valid) {
      onStart(name.trim(), email.trim());
    } else {
      if (name.trim().length <= 1) {
        document.getElementById('welcome-name')?.focus();
      } else if (!email.includes('@')) {
        document.getElementById('welcome-email')?.focus();
      }
    }
  };

  return (
    <div
      className="screen-in w-full min-h-screen select-none flex flex-col relative overflow-x-hidden overflow-y-auto"
      style={{ minHeight: '100dvh' }}
    >
      {/* Top Header Bar with solid white background */}
      <header
        className="w-full bg-white relative z-20 shrink-0 border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 lg:px-14 py-2.5 sm:py-4"
        style={{ minHeight: 'clamp(54px, 7vh, 88px)' }}
      >
        <div className="w-full max-w-[1560px] mx-auto flex items-center justify-between gap-3">
          {/* Lilly Logo */}
          <div className="shrink-0 flex items-center">
            <img
              src="/lilly_logo.svg"
              alt="Lilly - A Medicine Company"
              className="h-6 sm:h-9 md:h-12 w-auto object-contain"
              style={{ maxHeight: '48px', maxWidth: '110px' }}
            />
          </div>

          {/* Saudi National Day & Ezzna Betabaana Logo */}
          <div className="shrink-0 flex items-center">
            <img
              src="/national_day_logo.svg"
              alt="اليوم الوطني السعودي - عزنا بطبعنا"
              className="h-6 sm:h-9 md:h-12 w-auto object-contain"
              style={{ maxHeight: '48px', maxWidth: '210px' }}
            />
          </div>
        </div>
      </header>

      {/* Main Hero / Landscape Section - background starts immediately after navbar */}
      {/* Main Hero / Landscape Section - background dictates height using CSS Grid */}
      <main className="relative z-10 flex-1 w-full grid overflow-hidden bg-[#ebeae4]">
        {/* Background photo starting right after navbar */}
        <img
          src="/welcome_bg.jpg"
          alt="Saudi Regions Quiz"
          className="col-start-1 row-start-1 w-full h-auto object-cover pointer-events-none z-0"
          style={{
            objectPosition: 'center 16%',
            minHeight: 'calc(100dvh - 80px)',
            transform: 'scale(1.07) translateY(-2%)',
            transformOrigin: 'center center',
          }}
        />
        {/* Subtle responsive vignette for contrast */}
        <div
          className="col-start-1 row-start-1 w-full h-full pointer-events-none z-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.02) 25%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Card & Heritage Pattern Wrapper */}
        <div className="col-start-1 row-start-1 relative z-10 w-full flex items-center justify-center lg:justify-end px-3.5 sm:px-8 lg:px-16 xl:px-24 py-12 sm:py-16 md:py-24 box-border">
          <div className="relative w-full max-w-[348px] sm:max-w-[440px] lg:max-w-[505px] mx-auto lg:mx-0 xl:mr-10 my-auto box-border">

            {/* Decorative Heritage Pattern Grid behind and around the Card */}
            <img
              src="/full_pattern.svg"
              alt=""
              aria-hidden="true"
              className="absolute pointer-events-none z-[1] select-none"
              style={{
                width: '131.7%',
                maxWidth: 'none',
                left: '-14.65%',
                top: '-14.6%',
                height: 'auto',
              }}
            />

            {/* The White Journey Card — sizes matched to Figma card proportions */}
            <div
              className="relative z-[2] w-full box-border rounded-[32px] border border-white/70 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.28)] sm:rounded-[40px] sm:p-10 lg:p-11"
            >
              {/* Headline — Figma: Saudi Bold 700, 68.88px, line-height 67%, tracking 0, #004C42 */}
              <h1
                className="font-saudi mb-2 text-[36px] font-bold uppercase tracking-normal text-[#004C42] sm:text-[48px] lg:text-[68.88px]"
                data-testid="text-welcome-title"
                style={{ lineHeight: '67%' }}
              >
                YOUR JOURNEY
                <br />
                STARTS HERE
              </h1>

              {/* Subheading — Figma: Saudi-MoD Medium 500, 17.23px, LH 140%, #767676 */}
              <p
                className="font-mod mb-7 tracking-normal text-[15px] sm:text-[17.23px]"
                style={{
                  fontWeight: 500,
                  lineHeight: '140%',
                  color: '#767676',
                }}
              >
                One passport. A journey across Saudi Arabia.
              </p>

              {/* Interactive Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4" noValidate>
                {/* Full Name Input — Figma: Saudi-MoD 300, 22px, LH 140%, #000000 */}
                <div>
                  <input
                    id="welcome-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    data-testid="input-player-name"
                    aria-label="Enter your full name"
                    className="font-mod box-border h-14 w-full rounded-full px-5 text-[18px] outline-none transition-all duration-200 placeholder:text-black/40 sm:h-[60px] sm:px-6 sm:text-[22px]"
                    style={{
                      fontWeight: 300,
                      lineHeight: '140%',
                      color: '#000000',
                      letterSpacing: 0,
                      border: touched && name.trim().length <= 1 ? '1.5px solid #d9383a' : '1.08px solid #A1A1A1',
                      backgroundColor: '#ffffff',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#004C42';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 76, 66, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = touched && name.trim().length <= 1 ? '#d9383a' : '#A1A1A1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Email Input — same Figma type as name field */}
                <div>
                  <input
                    id="welcome-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    data-testid="input-player-email"
                    aria-label="Enter your email address"
                    className="font-mod box-border h-14 w-full rounded-full px-5 text-[18px] outline-none transition-all duration-200 placeholder:text-black/40 sm:h-[60px] sm:px-6 sm:text-[22px]"
                    style={{
                      fontWeight: 300,
                      lineHeight: '140%',
                      color: '#000000',
                      letterSpacing: 0,
                      border: touched && !email.includes('@') ? '1.5px solid #d9383a' : '1.08px solid #A1A1A1',
                      backgroundColor: '#ffffff',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#004C42';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 76, 66, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = touched && !email.includes('@') ? '#d9383a' : '#A1A1A1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Submit — Figma: Saudi Regular 400, 32.3px, LH 140%, #FFFFFF, center */}
                <div className="pt-1">
                  <button
                    type="submit"
                    data-testid="button-start-journey"
                    className="font-saudi flex h-14 w-full cursor-pointer items-center justify-center rounded-full text-center text-[22px] tracking-normal text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:h-[60px] sm:text-[28px] lg:text-[32.3px]"
                    style={{
                      fontWeight: 400,
                      lineHeight: '140%',
                      backgroundColor: '#004C42',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#006255';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#004C42';
                    }}
                  >
                    <span>{hasResume ? 'Continue my journey' : 'Start my journey'}</span>
                  </button>
                </div>
              </form>

              {/* Footnote */}
              <p className="font-saudi mt-5 text-center text-[11px] font-normal leading-normal text-[#767676] sm:mt-6 sm:text-[13px]">
                Your name and email link your score, progress and stamps.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PassportHeader({ journey, onFinish }: { journey: SavedJourney; onFinish: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.22em]" style={{ color: '#668078' }}>Traveler</p>
        <p className="font-display text-lg font-bold" data-testid="text-player-name">{journey.player?.name}</p>
      </div>
      <button onClick={onFinish} data-testid="button-finish-journey" className="inline-flex items-center gap-2 rounded-full border bg-transparent px-4 py-2 text-xs font-bold transition hover:-translate-y-0.5" style={{ borderColor: 'rgba(0,89,77,.28)', color: '#00594d' }}><Trophy size={14} /> View summary</button>
    </div>
  );
}

function Stamp({ region, complete, index, big = false }: { region: Region; complete: boolean; index: number; big?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center text-center ${big ? 'w-36' : 'w-[76px] sm:w-24'}`} data-testid={`stamp-${region.id}`}>
      <div className={`relative grid place-items-center rounded-full border-2 transition-all duration-500 ${big ? 'h-32 w-32' : 'h-[62px] w-[62px] sm:h-20 sm:w-20'} ${complete ? 'stamp-pop' : ''}`} style={{ borderColor: complete ? region.color : 'rgba(0,89,77,.16)', background: complete ? `${region.color}18` : 'rgba(255,255,255,.34)', color: complete ? region.color : '#9aaca4', boxShadow: complete ? `0 8px 18px ${region.color}35` : 'none', animationDelay: `${index * 40}ms` }}>
        {complete ? <Check size={big ? 32 : 20} strokeWidth={3} /> : <LockKeyhole size={big ? 24 : 16} />}
        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold" style={{ background: complete ? '#00594d' : '#e6dfd2', color: complete ? '#f8e4a8' : '#7b8d85' }}>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <span className={`mt-2 text-[10px] font-bold uppercase leading-3 tracking-[.08em] ${big ? 'text-xs' : ''}`} style={{ color: complete ? '#285f53' : '#8a9a93' }}>{region.name}</span>
    </div>
  );
}

function ScreenHeader() {
  return (
    <header className="w-full bg-white relative z-20 shrink-0 border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 py-2.5 sm:py-4">
      <img
        src="/lilly_logo.svg"
        alt="Lilly - A Medicine Company"
        className="h-6 sm:h-9 w-auto object-contain"
        style={{ maxHeight: '36px', maxWidth: '110px' }}
      />
      <img
        src="/national_day_logo.svg"
        alt="اليوم الوطني السعودي - عزنا بطبعنا"
        className="h-6 sm:h-9 w-auto object-contain"
        style={{ maxHeight: '36px', maxWidth: '210px' }}
      />
    </header>
  );
}

function Quiz({ region, journey, onComplete, onAnswer, onFinish, onViewPassport }: { region: Region; journey: SavedJourney; onComplete: (regionId: string) => void; onAnswer: (regionId: string, questionIndex: number, answer: number) => void; onFinish: () => void; onViewPassport: () => void }) {
  const [shownRegion, setShownRegion] = useState(region);
  const [leaving, setLeaving] = useState(false);
  const existing = journey.answers[shownRegion.id] ?? [];
  const allAnswered = shownRegion.questions.every((_, idx) => existing[idx] !== undefined);
  const [wrongAttempts, setWrongAttempts] = useState<Record<number, number[]>>({});
  const [submitPulse, setSubmitPulse] = useState(false);
  const regionNumber = Math.min(journey.completed.length + 1, regions.length);
  const totalQuestions = shownRegion.questions.length;
  const answeredCount = shownRegion.questions.reduce(
    (n, _, i) => n + (existing[i] !== undefined && existing[i] !== null ? 1 : 0),
    0,
  );
  // Current question within this region (Q1 → Q3); fill grows as each is answered
  const currentQuestion = Math.min(Math.max(answeredCount + 1, 1), totalQuestions);
  const questionProgress = (currentQuestion / totalQuestions) * 100;
  const regionAnim = leaving ? 'region-out' : 'region-in';

  useEffect(() => {
    if (region.id === shownRegion.id) return;
    setLeaving(true);
    const t = window.setTimeout(() => {
      setShownRegion(region);
      setLeaving(false);
      setWrongAttempts({});
      setSubmitPulse(false);
    }, 280);
    return () => window.clearTimeout(t);
  }, [region, shownRegion.id]);

  useEffect(() => {
    if (allAnswered) setSubmitPulse(true);
  }, [allAnswered]);

  const pickOption = (qIndex: number, oIndex: number, answered: boolean, isWrong: boolean) => {
    if (leaving || answered || isWrong) return;
    if (oIndex === shownRegion.questions[qIndex].answer) {
      onAnswer(shownRegion.id, qIndex, oIndex);
    } else {
      setWrongAttempts((prev) => ({
        ...prev,
        [qIndex]: [...(prev[qIndex] || []), oIndex],
      }));
    }
  };

  return (
    <div className="screen-in flex flex-col w-full bg-white selection:bg-[#004C42] selection:text-white" style={{ fontFamily: 'Saudi, sans-serif' }}>

      {/* Desktop Figma frame — readable from ~1024px up */}
      <div className="relative hidden w-full aspect-[1440/1024] overflow-hidden bg-white lg:block">
        <div className="ken-burns absolute inset-0">
        
        {/* The SVG Background (No Text). Using it precisely as the layout! */}
        <img 
          src="/frame2_no_text.svg" 
          alt="Quiz Background" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        />
        
        {/* Overlay 1: Region title — Figma: Saudi Bold 700, 100px, LH 55px, #FFFFFF, uppercase */}
        <div 
          className="absolute"
          style={{ top: `${((114.5 - 100) / 1024) * 100}%`, left: `${(77 / 1440) * 100}%` }}
        >
          <h1
            key={shownRegion.id}
            className={`${regionAnim} font-saudi uppercase tracking-normal text-white`}
            style={{ fontSize: '6.94vw', fontWeight: 700, lineHeight: '3.82vw', letterSpacing: 0 }}
          >
            {shownRegion.name} REGION
          </h1>
        </div>

        {/* Overlay 2: Per-question progress within the current region */}
        <div 
          className="absolute overflow-hidden"
          style={{
            top: '21.87%',
            left: '42.01%',
            width: '40.97%',
            height: '4.10%',
            borderRadius: '0.825vw',
            background: 'rgba(0, 76, 66, 0.3)',
          }}
        >
          <div 
            className="absolute inset-y-0 left-0 flex items-center justify-center bg-[#004C42] text-[1.65vw] font-bold text-white transition-all duration-500 ease-out"
            style={{
              width: `${questionProgress}%`,
              borderRadius: '0.825vw',
              minWidth: '3.5vw',
            }}
          >
            Q{currentQuestion}
          </div>
        </div>

        {/* Overlay 3: The 3 Questions */}
        {shownRegion.questions.map((question, qIndex) => {
          // Exact top percentages from the SVG rects
          const topPer = [29.29, 46.14, 62.93][qIndex];
          const selected = existing[qIndex];
          const answered = selected !== undefined && selected !== null; // Only correct answers are saved now
          const wrongs = wrongAttempts[qIndex] || [];

          return (
            <div key={qIndex}>
              {/* Question — Figma: Saudi Bold 700, 35px, LH 30px, #004C42 */}
              <div 
                className="absolute flex items-center overflow-hidden pl-[7.3%] pr-[4%]"
                style={{ top: `${topPer}%`, left: '42.01%', width: '29.09%', height: '13.76%' }}
              >
                <div
                  className={`${leaving ? 'q-card-out' : 'q-card-in'} flex h-full w-full items-center`}
                  style={{ animationDelay: leaving ? '0ms' : `${qIndex * 90}ms` }}
                >
                  <p
                    className="font-saudi tracking-normal text-[#004C42]"
                    style={{ fontSize: '2.43vw', fontWeight: 700, lineHeight: '2.08vw', letterSpacing: 0 }}
                  >
                    {question.prompt}
                  </p>
                </div>
              </div>

              {/* Answers — Figma: Saudi-MoD SemiBold 600, 20px, LH 23.73px, center, #2D2D2D @ 50% */}
              <div 
                className="absolute overflow-hidden"
                style={{ top: `${topPer - 0.06}%`, left: '72.45%', width: '13.35%', height: '13.9%' }}
              >
                <div
                  className={`${leaving ? 'q-card-out' : 'q-card-in'} flex h-full w-full flex-col justify-between`}
                  style={{ animationDelay: leaving ? '0ms' : `${qIndex * 90 + 40}ms` }}
                >
                  {question.options.map((option, oIndex) => {
                  const isAnswer = answered && oIndex === question.answer;
                  const isWrong = wrongs.includes(oIndex);

                  let btnClass = "bg-transparent border-none text-[#2D2D2D]/50";
                  if (isAnswer) btnClass = "bg-[#004C42] text-white shadow-sm answer-correct";
                  else if (isWrong) btnClass = "bg-[#ffe5e5] text-[#d9383a] answer-wrong";

                  return (
                    <button
                      key={oIndex}
                      onClick={() => pickOption(qIndex, oIndex, answered, isWrong)}
                      disabled={leaving || answered || isWrong}
                      className={`font-mod relative flex h-[46.5%] w-full items-center justify-center px-[8%] text-center tracking-normal transition-all duration-200 ${btnClass} focus:outline-none`}
                      style={{
                        borderRadius: '0.6vw',
                        fontSize: '1.39vw',
                        fontWeight: 600,
                        lineHeight: '1.65vw',
                        letterSpacing: 0,
                      }}
                    >
                      <span className="max-w-full whitespace-pre-line">{option}</span>
                      {isAnswer && <Check size={16} strokeWidth={4} className="check-pop pointer-events-none absolute right-[6%] text-white" />}
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Overlay 4: Bottom Action Buttons */}
        {/* Submit Button Overlay */}
        <button 
          onClick={() => allAnswered && !leaving && onComplete(shownRegion.id)}
          disabled={!allAnswered || leaving}
          className={`font-saudi absolute flex items-center justify-center text-[2.64vw] font-normal tracking-normal transition-all focus:outline-none ${
            allAnswered ? `text-white hover:opacity-80 ${submitPulse ? 'submit-ready-text' : ''}` : 'cursor-not-allowed text-white/50'
          }`}
          style={{ top: '82.81%', left: '42.01%', width: '29.44%', height: '7.03%' }}
        >
          {journey.completed.length + 1 >= regions.length ? 'Finish Quiz' : 'Submit answers'}
        </button>

        {/* Finish Journey Button Overlay */}
        <button
          onClick={onFinish}
          className="font-saudi absolute flex items-center justify-center bg-transparent text-[2.08vw] font-normal tracking-normal text-[#004C42] shadow-none transition-all hover:opacity-70 focus:outline-none"
          style={{ top: '82.81%', left: '72.91%', width: '13.05%', height: '7.03%' }}
        >
          Finish my journey
        </button>
        </div>

      </div>

      {/* Mobile / tablet stacked layout */}
      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#ebeae4] lg:hidden">
        <img
          src="/frame2_no_text.svg"
          alt=""
          className="mobile-quiz-art pointer-events-none absolute inset-0 h-full w-full object-cover object-left-top"
        />
        <div className="pointer-events-none absolute inset-0 bg-white/30" />

        <div className="relative z-10 flex min-h-dvh flex-col">
        <ScreenHeader />

        <div className="bg-[#004C42] px-4 py-4 text-white">
          <p className="font-mod text-[11px] font-medium uppercase tracking-[.18em] text-white/70">
            Region {regionNumber} of {regions.length}
          </p>
          <h1
            key={shownRegion.id}
            className={`${regionAnim} font-saudi mt-1 text-[28px] font-bold uppercase tracking-normal sm:text-[32px]`}
            style={{ lineHeight: 1.05 }}
          >
            {shownRegion.name} Region
          </h1>
        </div>

        <div className="px-4 pt-4">
          <div className="relative h-8 w-full overflow-hidden rounded-full bg-[rgba(0,76,66,0.3)]">
            <div
              className="font-saudi absolute inset-y-0 left-0 flex min-w-[3.25rem] items-center justify-center rounded-full bg-[#004C42] px-3 text-[12px] font-bold text-white transition-all duration-500 ease-out"
              style={{ width: `${questionProgress}%` }}
            >
              Q{currentQuestion}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-4 py-5 pb-8">
          {shownRegion.questions.map((question, qIndex) => {
            const selected = existing[qIndex];
            const answered = selected !== undefined && selected !== null;
            const wrongs = wrongAttempts[qIndex] || [];

            return (
              <section
                key={`${shownRegion.id}-${qIndex}`}
                className={`${leaving ? 'q-card-out' : 'q-card-in'} rounded-[22px] border border-white/70 bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.08)]`}
                style={{ animationDelay: leaving ? '0ms' : `${qIndex * 90}ms` }}
              >
                <p className="font-mod mb-2 text-[11px] font-medium uppercase tracking-[.14em] text-[#668078]">
                  Question {qIndex + 1}
                </p>
                <p
                  className="font-saudi mb-4 tracking-normal text-[#004C42]"
                  style={{ fontSize: '18px', fontWeight: 700, lineHeight: '22px', letterSpacing: 0 }}
                >
                  {question.prompt}
                </p>
                <div className="flex flex-col gap-2.5">
                  {question.options.map((option, oIndex) => {
                    const isAnswer = answered && oIndex === question.answer;
                    const isWrong = wrongs.includes(oIndex);

                    return (
                      <button
                        key={oIndex}
                        onClick={() => pickOption(qIndex, oIndex, answered, isWrong)}
                        disabled={leaving || answered || isWrong}
                        className={`font-mod flex min-h-12 w-full items-center justify-center rounded-[12px] border px-4 py-3 text-center transition-all active:scale-[0.98] disabled:cursor-not-allowed ${isAnswer ? 'answer-correct' : ''} ${isWrong ? 'answer-wrong' : ''}`}
                        style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          lineHeight: '19px',
                          letterSpacing: 0,
                          background: isAnswer ? '#004C42' : isWrong ? '#ffe5e5' : '#ffffff',
                          color: isAnswer ? '#ffffff' : isWrong ? '#d9383a' : 'rgba(45, 45, 45, 0.5)',
                          borderColor: isAnswer ? '#004C42' : isWrong ? '#f3b4b4' : '#c8d0cc',
                        }}
                      >
                        <span className="pr-2">{option}</span>
                        {isAnswer && <Check size={18} strokeWidth={3} className="check-pop shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <button
            onClick={() => allAnswered && !leaving && onComplete(shownRegion.id)}
            disabled={!allAnswered || leaving}
            className={`font-saudi mt-2 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#004C42] text-[18px] font-normal text-white shadow-[0_8px_20px_rgba(0,89,77,.16)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 ${allAnswered && submitPulse ? 'submit-ready' : ''}`}
          >
            {journey.completed.length + 1 >= regions.length ? 'Finish Quiz' : 'Submit answers'}
          </button>
          <button
            onClick={onFinish}
            className="font-saudi inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#004C42]/40 bg-white/85 text-[16px] font-normal text-[#004C42]"
          >
            Finish my journey
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

function Summary({ journey, onRestart, onViewPassport }: { journey: SavedJourney; onRestart: () => void; onViewPassport: () => void }) {
  const completedRegions = regions.filter((region) => journey.completed.includes(region.id));
  const animatedScore = useCountUp(journey.score);
  const animatedRegions = useCountUp(completedRegions.length);
  
  return (
    <div className="screen-in flex flex-col w-full bg-white selection:bg-[#004C42] selection:text-white" style={{ fontFamily: 'Saudi, sans-serif' }}>
      <div className="relative hidden w-full aspect-[1440/1024] overflow-hidden bg-[#F2F2F2] lg:block">
        <img 
          src="/frame4.svg" 
          alt="Final Score Summary" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        />

        {/* CONGRATULATIONS! — Figma: Saudi Bold 100px, x 77 y 114.5 */}
        <div
          className="font-saudi pointer-events-none absolute whitespace-nowrap font-bold uppercase text-white"
          style={{
            top: `${(114.5 / 1024) * 100}%`,
            left: `${(77 / 1440) * 100}%`,
            fontSize: '6.94vw',
            lineHeight: '67%',
            letterSpacing: 0,
          }}
        >
          CONGRATULATIONS!
        </div>

        {/* Shared right edge ≈ 1212 (Figma number box 1025.77 + 186) */}
        {/* GAME SCORE — y 336.5 · Saudi Regular 400 · 100px · LH 67% · right */}
        <div
          className="font-saudi pointer-events-none absolute whitespace-nowrap uppercase text-white"
          style={{
            top: `${(336.5 / 1024) * 100}%`,
            right: `${((1440 - 1212) / 1440) * 100}%`,
            fontSize: '6.94vw',
            lineHeight: '67%',
            letterSpacing: 0,
            fontWeight: 400,
            textAlign: 'right',
          }}
        >
          Game score
        </div>

        {/* Score value — y 449 · Saudi Bold 700 · 200px · LH 67% · right */}
        <div
          className="font-saudi pointer-events-none absolute whitespace-nowrap uppercase text-white"
          style={{
            top: `${(449 / 1024) * 100}%`,
            right: `${((1440 - 1212) / 1440) * 100}%`,
            fontSize: '13.89vw',
            lineHeight: '67%',
            letterSpacing: 0,
            fontWeight: 700,
            textAlign: 'right',
          }}
        >
          {animatedScore}
        </div>

        {/* REGIONS COMPLETED — y 660.5 · Saudi Regular 400 · 100px · LH 67% · right */}
        <div
          className="font-saudi pointer-events-none absolute whitespace-nowrap uppercase text-white"
          style={{
            top: `${(660.5 / 1024) * 100}%`,
            right: `${((1440 - 1212) / 1440) * 100}%`,
            fontSize: '6.94vw',
            lineHeight: '67%',
            letterSpacing: 0,
            fontWeight: 400,
            textAlign: 'right',
          }}
        >
          Regions completed
        </div>

        {/* Regions value — y 773 · Bold 200px + Regular 100px /13 · right */}
        <div
          className="font-saudi pointer-events-none absolute flex items-baseline justify-end whitespace-nowrap uppercase text-white"
          style={{
            top: `${(773 / 1024) * 100}%`,
            right: `${((1440 - 1212) / 1440) * 100}%`,
            fontSize: '13.89vw',
            lineHeight: '67%',
            letterSpacing: 0,
            fontWeight: 700,
            textAlign: 'right',
          }}
        >
          <span>{animatedRegions}</span>
          <span style={{ fontSize: '6.94vw', fontWeight: 400, lineHeight: '67%' }}>/{regions.length}</span>
        </div>


        {/* View Passport Button */}
        <div className="absolute top-[85%] left-1/2 -translate-x-1/2 z-10">
          <PrimaryButton onClick={onViewPassport} testId="button-view-passport">
            View My Passport
          </PrimaryButton>
        </div>
      </div>

      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#004C42] lg:hidden">
        <ScreenHeader />
        <img
          src="/welcome_bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#004C42]/70 via-[#004C42]/80 to-[#00352e]" />

        <div className="relative z-10 flex flex-1 flex-col px-5 py-8 text-white">
          <p className="font-mod text-[11px] font-medium uppercase tracking-[.18em] text-white/70">Saudi National Day edition</p>
          <h1
            className="font-saudi mt-2 uppercase tracking-normal"
            style={{ fontSize: '36px', fontWeight: 700, lineHeight: '67%' }}
          >
            Congratulations!
          </h1>
          <p className="font-mod mt-3 text-[15px] font-medium text-white/80" style={{ lineHeight: '140%' }}>
            Your passport journey across Saudi Arabia.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[24px] bg-white/12 px-5 py-6 text-right backdrop-blur-sm">
              <p
                className="font-saudi uppercase text-white"
                style={{ fontSize: '22px', fontWeight: 400, lineHeight: '67%' }}
              >
                Game score
              </p>
              <p
                className="font-saudi mt-2 uppercase text-white"
                style={{ fontSize: '56px', fontWeight: 700, lineHeight: '67%' }}
              >
                {animatedScore}
              </p>
            </div>
            <div className="rounded-[24px] bg-white/12 px-5 py-6 text-right backdrop-blur-sm">
              <p
                className="font-saudi uppercase text-white"
                style={{ fontSize: '22px', fontWeight: 400, lineHeight: '67%' }}
              >
                Regions completed
              </p>
              <p
                className="font-saudi mt-2 flex items-baseline justify-end uppercase text-white"
                style={{ fontSize: '56px', fontWeight: 700, lineHeight: '67%' }}
              >
                <span>{animatedRegions}</span>
                <span style={{ fontSize: '28px', fontWeight: 400, lineHeight: '67%' }}>/{regions.length}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onViewPassport}
            data-testid="button-view-passport-mobile"
            className="font-saudi mt-auto inline-flex min-h-14 w-full items-center justify-center rounded-full bg-white text-[18px] font-normal text-[#004C42] shadow-[0_8px_20px_rgba(0,0,0,.2)]"
          >
            View My Passport
          </button>
        </div>
      </div>
    </div>
  );
}

function StampScreen({ onContinue, onFinish, allDone }: { onContinue: () => void; onFinish: () => void; allDone: boolean }) {
  return (
    <div className="screen-in flex w-full flex-col bg-white selection:bg-[#004C42] selection:text-white" style={{ fontFamily: 'Saudi, sans-serif' }}>
      <div className="relative hidden w-full aspect-[1440/1024] overflow-hidden bg-[#F2F2F2] lg:block">
        <div className="ken-burns absolute inset-0">
          <img
            src="/frame3_no_stamp.svg"
            alt="Region Completed"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />
          <img
            src="/completed-stamp.svg"
            alt="Completed"
            className="stamp-pop-seal pointer-events-none absolute"
            style={{
              top: '29.95%',
              left: '6.33%',
              width: '30.46%',
              height: '43.77%',
              animationDelay: '180ms',
            }}
          />
          <img
            src="/stamp-congrats.svg"
            alt=""
            className="q-card-in pointer-events-none absolute inset-0 h-full w-full object-contain"
            style={{ animationDelay: '280ms' }}
          />
          <img
            src="/stamp-body.svg"
            alt=""
            className="q-card-in pointer-events-none absolute inset-0 h-full w-full object-contain"
            style={{ animationDelay: '360ms' }}
          />
          {allDone ? (
            <button
              onClick={onContinue}
              className="q-card-in absolute flex items-center justify-center gap-[0.8vw] bg-white font-bold text-[#004C42] transition-opacity hover:opacity-90"
              style={{
                top: '50%',
                left: '38.82%',
                width: '39.65%',
                height: '14.45%',
                borderRadius: '2.79vw',
                fontSize: '1.7vw',
                animationDelay: '520ms',
              }}
            >
              <span>View my summary</span>
              <ArrowRight className="h-[1.6vw] w-[1.6vw] shrink-0" strokeWidth={3} />
            </button>
          ) : (
            <>
              <img
                src="/stamp-continue.svg"
                alt=""
                className="q-card-in pointer-events-none absolute inset-0 h-full w-full object-contain"
                style={{ animationDelay: '520ms' }}
              />
              <button
                onClick={onContinue}
                className="absolute cursor-pointer bg-transparent"
                style={{ top: '50%', left: '38.82%', width: '39.65%', height: '14.45%' }}
                aria-label="Continue to the next destination"
              />
            </>
          )}
          <img
            src="/stamp-finish.svg"
            alt=""
            className="q-card-in pointer-events-none absolute inset-0 h-full w-full object-contain"
            style={{ animationDelay: '620ms' }}
          />
          <button
            onClick={onFinish}
            className="absolute cursor-pointer bg-transparent"
            style={{ top: '68.55%', left: '42.01%', width: '23.75%', height: '4.88%' }}
            aria-label="Finish my journey"
          />
        </div>
      </div>

      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#004C42] lg:hidden">
        <img
          src="/welcome_bg.jpg"
          alt=""
          className="mobile-stamp-art pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 overlay-in bg-[#004C42]/70" />

        <div className="relative z-10 flex min-h-dvh flex-col">
          <ScreenHeader />

          <div className="flex flex-1 flex-col items-center px-5 py-8 text-center text-white">
            <p className="q-card-in font-mod text-[11px] font-medium uppercase tracking-[.18em] text-white/70">Your passport</p>

            <img
              src="/completed-stamp.svg"
              alt="Completed"
              className="stamp-pop-seal mt-7 h-[13.5rem] w-[13.5rem] object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,.28)]"
              style={{ animationDelay: '120ms' }}
            />

            <h1
              className="q-card-in font-saudi mt-8 uppercase tracking-normal"
              style={{ animationDelay: '280ms', fontSize: '36px', fontWeight: 700, lineHeight: '67%' }}
            >
              Congratulations!
            </h1>
            <p
              className="q-card-in font-mod mt-3 text-[15px] font-medium text-white/85"
              style={{ animationDelay: '360ms', lineHeight: '140%' }}
            >
              You have completed this region.
            </p>
            <p
              className="q-card-in font-mod mt-1 text-[13px] font-medium text-white/70"
              style={{ animationDelay: '420ms', lineHeight: '140%' }}
            >
              You get a new stamp in your digital passport.
            </p>

            <div className="q-card-in mt-8 w-full" style={{ animationDelay: '520ms' }}>
              <button
                onClick={onContinue}
                className="font-saudi submit-ready inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-white text-[18px] font-normal text-[#004C42] shadow-[0_8px_20px_rgba(0,0,0,.2)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ animationDelay: '900ms' }}
              >
                <span>{allDone ? 'View my summary' : 'Continue to the next destination'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <button
              onClick={onFinish}
              className="q-card-in font-saudi mt-4 inline-flex items-center gap-2 text-[16px] font-normal text-white underline underline-offset-4"
              style={{ animationDelay: '600ms' }}
            >
              Finish my journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [journey, setJourney] = useState<SavedJourney>(() => loadJourney());
  const [showPassport, setShowPassport] = useState(false);
  
  // Determine if all regions are completed
  const isComplete = journey.completed.length >= regions.length;
  // Automatically determine the active region
  const activeRegion = useMemo(() => regions.find(r => !journey.completed.includes(r.id)) || null, [journey.completed]);
  
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'stamp' | 'summary'>(() => {
    if (!journey.player) return 'welcome';
    if (isComplete) return 'summary';
    return 'quiz';
  });

  useEffect(() => { 
    saveJourney(journey); 
    if (journey.player) {
      apiSaveJourney(journey.player.email, journey.player.name, journey);
    }
  }, [journey]);

  const [isLoadingDB, setIsLoadingDB] = useState(false);

  const start = async (name: string, email: string) => {
    setIsLoadingDB(true);
    let next = { ...journey, player: { name, email } };
    
    // Attempt to load from database
    const backendJourney = await apiLoadJourney(email);
    if (backendJourney) {
      next = { ...backendJourney, player: { name, email } };
    }
    
    setJourney(next);
    setIsLoadingDB(false);
    
    if (next.completed.length >= regions.length) {
      setScreen('summary');
    } else {
      setScreen('quiz');
    }
  };

  const answer = (regionId: string, questionIndex: number, value: number) => {
    setJourney((prev) => {
      const prior = [...(prev.answers[regionId] ?? [])];
      prior[questionIndex] = value;
      const answers = { ...prev.answers, [regionId]: prior };
      // Always award 10 points since they can only proceed with the correct answer
      return { ...prev, answers, score: prev.score + 10 };
    });
  };

  const completeRegion = (id: string) => {
    setJourney((prev) => {
      const newCompleted = prev.completed.includes(id) ? prev.completed : [...prev.completed, id];
      return { ...prev, completed: newCompleted };
    });
    setScreen('stamp');
  };

  const restart = () => { 
    if (window.confirm('Start a new passport journey? Your progress will be cleared.')) { 
      localStorage.removeItem(STORAGE_KEY); 
      setJourney(blankJourney); 
      setScreen('welcome'); 
    } 
  };

  return (
    <div className="passport-app grain relative">
      {isLoadingDB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-[#004C42] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#004C42] font-bold">Syncing your passport...</p>
          </div>
        </div>
      )}
      {screen === 'welcome' && <Welcome journey={journey} onStart={start} />}
      {screen === 'quiz' && activeRegion && <Quiz region={activeRegion} journey={journey} onComplete={completeRegion} onAnswer={answer} onFinish={() => setScreen('summary')} onViewPassport={() => setShowPassport(true)} />}
      {screen === 'stamp' && (
        <StampScreen
          allDone={journey.completed.length >= regions.length}
          onContinue={() => setScreen(journey.completed.length >= regions.length ? 'summary' : 'quiz')}
          onFinish={() => setScreen('summary')}
        />
      )}
      {screen === 'summary' && <Summary journey={journey} onRestart={restart} onViewPassport={() => setShowPassport(true)} />}
      
      {showPassport && (
        <Passport 
          journey={journey} 
          onClose={() => setShowPassport(false)} 
          onResume={() => { setShowPassport(false); setScreen('quiz'); }}
        />
      )}
    </div>
  );
}

export default function RootApp() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><App /><Toaster /></TooltipProvider></QueryClientProvider>;
}