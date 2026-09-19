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
      <main className="relative z-10 flex-1 w-full grid bg-[#ebeae4]">
        {/* Background photo starting right after navbar */}
        <img
          src="/welcome_bg.jpg"
          alt="Saudi Regions Quiz"
          className="col-start-1 row-start-1 w-full h-auto object-cover pointer-events-none z-0"
          style={{
            objectPosition: 'center top',
            minHeight: 'calc(100dvh - 80px)',
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

            {/* The White Journey Card */}
            <div
              className="relative z-[2] w-full bg-white rounded-[24px] sm:rounded-[34px] p-5 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.28)] border border-white/70 box-border"
            >
              {/* Headline */}
              <h1
                className="text-[21px] sm:text-[28px] lg:text-[32px] font-black text-[#004C42] tracking-tight leading-tight uppercase font-display mb-1.5 sm:mb-2"
                data-testid="text-welcome-title"
              >
                YOUR JOURNEY
                <br />
                STARTS HERE
              </h1>

              {/* Subheading */}
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#767676] font-normal leading-relaxed mb-4 sm:mb-7">
                One passport. A journey across Saudi Arabia.
              </p>

              {/* Interactive Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
                {/* Full Name Input */}
                <div>
                  <input
                    id="welcome-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    data-testid="input-player-name"
                    aria-label="Enter your full name"
                    className="w-full h-11 sm:h-14 px-4 sm:px-6 rounded-full text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 box-border"
                    style={{
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

                {/* Email Address Input */}
                <div>
                  <input
                    id="welcome-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    data-testid="input-player-email"
                    aria-label="Enter your email address"
                    className="w-full h-11 sm:h-14 px-4 sm:px-6 rounded-full text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 box-border"
                    style={{
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

                {/* Submit Button */}
                <div className="pt-1.5 sm:pt-2">
                  <button
                    type="submit"
                    data-testid="button-start-journey"
                    className="w-full h-11 sm:h-14 rounded-full text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    style={{
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
              <p className="text-[10px] sm:text-xs text-[#767676] font-normal leading-normal text-center mt-3.5 sm:mt-6">
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

// RegionSelect has been removed per user request, regions now flow sequentially.

// RegionSelect has been removed per user request, regions now flow sequentially.

function Quiz({ region, journey, onComplete, onAnswer, onFinish, onViewPassport }: { region: Region; journey: SavedJourney; onComplete: (regionId: string) => void; onAnswer: (regionId: string, questionIndex: number, answer: number) => void; onFinish: () => void; onViewPassport: () => void }) {
  const existing = journey.answers[region.id] ?? [];
  const allAnswered = region.questions.every((_, idx) => existing[idx] !== undefined);
  const [wrongAttempts, setWrongAttempts] = useState<Record<number, number[]>>({});

  // Reset wrong attempts when region changes
  useEffect(() => {
    setWrongAttempts({});
  }, [region.id]);

  return (
    <div className="flex flex-col w-full bg-white selection:bg-[#004C42] selection:text-white" style={{ fontFamily: 'Saudi, sans-serif' }}>

      
      {/* The main scalable container that matches the SVG's 1440x1024 viewBox */}
      <div className="relative w-full aspect-[1440/1024] bg-white overflow-hidden">
        
        {/* The SVG Background (No Text). Using it precisely as the layout! */}
        <img 
          src="/frame2_no_text.svg" 
          alt="Quiz Background" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        />
        
        {/* Overlay 1: Top Banner (Text Only) */}
        <div 
          className="absolute flex items-center justify-start pl-[5%]"
          style={{ top: '0%', left: '0%', width: '45%', height: '18%' }}
        >
          <h1 className="text-white text-[4.5vw] xl:text-[75px] font-bold uppercase tracking-widest leading-none mt-[-2%]">
            {region.name} REGION
          </h1>
        </div>

        {/* Overlay 2: Progress Bar Text Overlay */}
        <div 
          className="absolute flex items-center"
          style={{ top: '21.87%', left: '42.01%', width: '40.97%', height: '4.10%' }}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#004C42] rounded-full flex items-center pl-4 text-white text-[1.5vw] xl:text-[24px] font-bold transition-all duration-700"
            style={{ width: `${((journey.completed.length + 1) / regions.length) * 100}%` }}
          >
            Q{journey.completed.length + 1}
          </div>
        </div>

        {/* Overlay 3: The 3 Questions */}
        {region.questions.map((question, qIndex) => {
          // Exact top percentages from the SVG rects
          const topPer = [29.29, 46.14, 62.93][qIndex];
          const selected = existing[qIndex];
          const answered = selected !== undefined && selected !== null; // Only correct answers are saved now
          const wrongs = wrongAttempts[qIndex] || [];

          return (
            <div key={qIndex}>
              {/* Question Box (Transparent bg, SVG draws the white box) */}
              <div 
                className="absolute flex items-center px-[3%]"
                style={{ top: `${topPer}%`, left: '42.01%', width: '29.09%', height: '13.76%' }}
              >
                <p className="text-[#004C42] font-bold text-[1.8vw] xl:text-[28px] leading-snug">{question.prompt}</p>
              </div>

              {/* Options Box Overlay */}
              <div 
                className="absolute flex flex-col justify-between"
                style={{ top: `${topPer - 0.06}%`, left: '72.45%', width: '13.35%', height: '13.9%' }}
              >
                {question.options.map((option, oIndex) => {
                  const isAnswer = answered && oIndex === question.answer;
                  const isWrong = wrongs.includes(oIndex);

                  let btnClass = "bg-transparent border-none text-[#004C42] hover:bg-[#004C42]/5";
                  if (isAnswer) btnClass = "bg-[#004C42] text-white shadow-sm";
                  else if (isWrong) btnClass = "bg-[#ffe5e5] text-[#d9383a]"; // Opaque light red

                  return (
                    <button
                      key={oIndex}
                      onClick={() => {
                        if (answered || isWrong) return;
                        if (oIndex === question.answer) {
                          onAnswer(region.id, qIndex, oIndex);
                        } else {
                          setWrongAttempts(prev => ({
                            ...prev,
                            [qIndex]: [...(prev[qIndex] || []), oIndex]
                          }));
                        }
                      }}
                      disabled={answered || isWrong}
                      className={`w-full h-[46.5%] text-[1.2vw] xl:text-[20px] font-semibold transition-all ${btnClass} flex items-center justify-between px-[6%] focus:outline-none`}
                      style={{ borderRadius: '0.6vw' }}
                    >
                      <span className="truncate pr-1">{option}</span>
                      {isAnswer && <Check size={20} strokeWidth={4} className="text-white flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Overlay 4: Bottom Action Buttons */}
        {/* Submit Button Overlay */}
        <button 
          onClick={() => allAnswered && onComplete(region.id)}
          disabled={!allAnswered}
          className={`absolute bg-transparent flex items-center justify-center font-bold text-[2.2vw] xl:text-[36px] transition-all focus:outline-none ${
            allAnswered ? 'text-white hover:opacity-80' : 'text-white/50 cursor-not-allowed'
          }`}
          style={{ top: '82.81%', left: '42.01%', width: '29.44%', height: '7.03%' }}
        >
          {journey.completed.length + 1 >= regions.length ? 'Finish Quiz' : 'Submit answers'}
        </button>

        {/* Finish Journey Button Overlay */}
        <button
          onClick={onFinish}
          className="absolute bg-transparent border-none shadow-none flex items-center justify-center font-bold text-[#004C42] text-[1.6vw] xl:text-[26px] hover:opacity-70 transition-all focus:outline-none"
          style={{ top: '82.81%', left: '72.91%', width: '13.05%', height: '7.03%' }}
        >
          Finish my journey
        </button>

      </div>
    </div>
  );
}

function Summary({ journey, onRestart, onViewPassport }: { journey: SavedJourney; onRestart: () => void; onViewPassport: () => void }) {
  const completedRegions = regions.filter((region) => journey.completed.includes(region.id));
  
  return (
    <div className="flex flex-col w-full bg-white selection:bg-[#004C42] selection:text-white" style={{ fontFamily: 'Saudi, sans-serif' }}>
      <div className="relative w-full aspect-[1440/1024] bg-[#F2F2F2] overflow-hidden">
        <img 
          src="/frame4.svg" 
          alt="Final Score Summary" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        />
        
        {/* CONGRATULATIONS! Title (X: 77, Y: 62) */}
        <div 
          className="absolute flex items-center justify-start font-display font-bold text-white uppercase tracking-wider"
          style={{ 
            top: '6.05%', 
            left: '5.35%', 
            width: '30%', 
            height: '5.37%', 
            fontSize: '4vw',
            lineHeight: 0.55
          }}
        >
          CONGRATULATIONS!
        </div>

        {/* GAME SCORE Title (Estimated above Score) */}
        <div 
          className="absolute flex items-end justify-center font-display text-white tracking-[0.2em]"
          style={{ top: '24%', left: '55%', width: '40%', height: '6%', fontSize: '3vw' }}
        >
          GAME SCORE
        </div>

        {/* Dynamic Game Score (X: 1025, Y: 332) */}
        <div 
          className="absolute flex items-center justify-center font-display font-bold text-white"
          style={{ 
            top: '32.42%', 
            left: '71.18%', 
            width: '16.74%', 
            height: '13.09%', 
            fontSize: '13.89vw', 
            lineHeight: 0.67 
          }}
        >
          {journey.score}
        </div>

        {/* REGIONS COMPLETED Title (Estimated above Regions) */}
        <div 
          className="absolute flex items-center justify-center font-display text-white tracking-[0.2em]"
          style={{ top: '56%', left: '55%', width: '40%', height: '6%', fontSize: '2.5vw' }}
        >
          REGIONS COMPLETED
        </div>

        {/* Dynamic Regions Completed (X: 1080, Y: 656) */}
        <div 
          className="absolute flex items-center justify-center font-display font-bold text-white"
          style={{ 
            top: '64.06%', 
            left: '75%', 
            width: '12.92%', 
            height: '13.09%', 
            fontSize: '13.89vw', 
            lineHeight: 0.67 
          }}
        >
          <div className="flex items-baseline">
            <span>{completedRegions.length}</span>
            <span className="text-[7vw] opacity-80">/13</span>
          </div>
        </div>


        {/* View Passport Button */}
        <div className="absolute top-[85%] left-1/2 -translate-x-1/2 z-10">
          <PrimaryButton onClick={onViewPassport} testId="button-view-passport">
            View My Passport
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function StampScreen({ onContinue, onFinish }: { onContinue: () => void; onFinish: () => void }) {
  return (
    <div className="flex flex-col w-full bg-white selection:bg-[#004C42] selection:text-white" style={{ fontFamily: 'Saudi, sans-serif' }}>
      <div className="relative w-full aspect-[1440/1024] bg-[#F2F2F2] overflow-hidden">
        <img 
          src="/frame3.svg" 
          alt="Region Completed Stamp" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        />
        {/* Button 1: Continue (White Pill) - Exact Figma Coordinates */}
        <button 
          onClick={onContinue}
          className="absolute bg-transparent cursor-pointer"
          style={{ top: '50%', left: '38.82%', width: '39.65%', height: '14.45%' }}
          aria-label="Continue to the next destination"
        />
        
        {/* Button 2: Finish - Exact Figma Coordinates */}
        <button 
          onClick={onFinish}
          className="absolute bg-transparent cursor-pointer"
          style={{ top: '68.55%', left: '42.01%', width: '23.75%', height: '4.88%' }}
          aria-label="Finish my journey"
        />
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
       const allDone = newCompleted.length >= regions.length;
       // Go directly to summary if all regions done, else continue quiz
       setScreen(allDone ? 'summary' : 'quiz');
       return { ...prev, completed: newCompleted };
    });
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
      {screen === 'stamp' && <StampScreen onContinue={() => setScreen('quiz')} onFinish={() => setScreen('summary')} />}
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