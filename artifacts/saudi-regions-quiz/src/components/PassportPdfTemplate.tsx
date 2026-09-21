import React, { forwardRef } from 'react';
import { Region } from '../data/regions';
import { SavedJourney } from '../App';
import { regionCoords } from './Passport';

interface PassportPdfTemplateProps {
  regions: Region[];
  journey: SavedJourney;
}

const PAGE_W = 720;
const PAGE_H = 1024; // الـ spread = 1440 × 1024 زي الموقع بالظبط

// صفحة واحدة = نص الـ spread (يمين أو شمال)
const Page = ({ side, children }: { side: 'left' | 'right'; children: React.ReactNode }) => (
  <div
    data-pdf-page="true"
    style={{ width: PAGE_W, height: PAGE_H, position: 'relative', overflow: 'hidden', backgroundColor: '#F6F4EB' }}
  >
    <div
      style={{
        position: 'absolute', top: 0,
        left: side === 'right' ? -PAGE_W : 0,
        width: PAGE_W * 2, height: PAGE_H,
      }}
    >
      {children}
    </div>
  </div>
);

// الغلاف: fill زي الموقع (object-fill)
const CoverSpread = () => (
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage: 'url(/passport-cover-hq.png)',
    backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
  }} />
);

// الـ intro: نفس الـ SVG بعرض/ارتفاع 100% زي الموقع
const IntroSpread = ({ journey, withFields }: { journey: SavedJourney; withFields: boolean }) => {
  const field = (top: string, value: string | undefined, size: number): React.ReactNode => (
    <div
      className="font-display"
      style={{
        position: 'absolute', top, left: '3.5%', width: '40%', height: '6.64%',
        lineHeight: `${Math.round(PAGE_H * 0.0664)}px`, // بدل flex عشان html2canvas
        paddingLeft: '2%', paddingRight: '2%',
        color: '#004D40', fontSize: size, fontWeight: 'bold',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}
    >
      {value}
    </div>
  );

  return (
    <>
      <img src="/passport-intro.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
      {withFields && (
        <>
          {field('28%', journey.player?.name, 22)}
          {field('45.5%', journey.player?.email, 18)}
          {field('63%', journey.player?.phone, 22)}
        </>
      )}
    </>
  );
};

// صفحة الأختام: cover + scale(1.03) زي الموقع
const StampsSpread = ({ regions, journey }: PassportPdfTemplateProps) => (
  <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.03)', transformOrigin: 'center' }}>
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'url(/passport-page-hq.png)',
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
    }} />
    {regions.map((region) => {
      const coords = regionCoords[region.id];
      if (!coords || !journey.completed.includes(region.id)) return null;
      return (
        <div
          key={region.id}
          style={{
            position: 'absolute', top: coords.top, left: coords.left,
            transform: 'translate(-50%, -50%)',
            width: '10%', aspectRatio: '1 / 1',
            borderRadius: '50%', border: '3px dashed #DDB572',
            backgroundColor: 'rgba(221,181,114,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <img src="/stamp-new.png" alt="" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
        </div>
      );
    })}
  </div>
);

export const PassportPdfTemplate = forwardRef<HTMLDivElement, PassportPdfTemplateProps>(
  ({ regions, journey }, ref) => (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', zIndex: -1 }}>
      <div
        ref={ref}
        className="flex flex-col items-center bg-white"
        style={{ width: 1440, padding: 40, gap: 40 }}
      >
        {/* 1: الغلاف الأمامي (النص اليمين) */}
        <Page side="right"><CoverSpread /></Page>

        {/* 2: intro شمال (فيها البيانات) */}
        <Page side="left"><IntroSpread journey={journey} withFields /></Page>

        {/* 3: intro يمين */}
        <Page side="right"><IntroSpread journey={journey} withFields={false} /></Page>

        {/* 4-5: الأختام */}
        <Page side="left"><StampsSpread regions={regions} journey={journey} /></Page>
        <Page side="right"><StampsSpread regions={regions} journey={journey} /></Page>

        {/* 6: الغلاف الخلفي (النص الشمال) */}
        <Page side="left"><CoverSpread /></Page>
      </div>
    </div>
  )
);

PassportPdfTemplate.displayName = 'PassportPdfTemplate';