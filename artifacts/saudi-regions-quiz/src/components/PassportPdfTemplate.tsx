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
const PAGE_BG = '#f3f2ed'; // لون خلفية الـ PDF

// صفحة واحدة = نص الـ spread (يمين أو شمال)
const Page = ({ side, children }: { side: 'left' | 'right'; children: React.ReactNode }) => (
  <div
    data-pdf-page="true"
    style={{ width: PAGE_W, height: PAGE_H, position: 'relative', overflow: 'hidden', backgroundColor: PAGE_BG }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: side === 'right' ? -PAGE_W : 0,
        width: PAGE_W * 2,
        height: PAGE_H,
      }}
    >
      {children}
    </div>
  </div>
);

// الغلاف: fill زي الموقع (object-fill)
const CoverSpread = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: 'url(/passport-cover-hq.png)',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
    }}
  />
);

const BackCoverSpread = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: 'url(/passport-cover-hq.png)',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      transform: 'scaleX(-1)', // flipped horizontally
    }}
  />
);

const IntroPage = ({ journey }: { journey: SavedJourney }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex' }}>
      {/* 
        This is rendered inside a w: 1440 container, but the image is only for the left page.
        Wait, Page component uses width: PAGE_W * 2, and side="left" offsets it by 0.
        So we just render IntroPage in the left half of the 200% width container.
      */}
      <div style={{ width: '50%', height: '100%', position: 'relative' }}>
        <img
          src="/passport-intro-new.png"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', objectFit: 'fill' }}
        />
        <div style={{ position: 'absolute', top: '29.5%', left: '6.5%', width: '82%', height: '9.5%', color: '#e02424', fontSize: 28, fontWeight: 'bold', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {journey.player?.name}
        </div>
        <div style={{ position: 'absolute', top: '47%', left: '6.5%', width: '82%', height: '9.5%', color: '#059669', fontSize: 24, fontWeight: 'bold', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {journey.player?.email}
        </div>
        <div style={{ position: 'absolute', top: '64.5%', left: '6.5%', width: '82%', height: '30.5%', paddingTop: '3%', color: '#1d4ed8', fontSize: 28, fontWeight: 'bold', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'hidden' }}>
          {journey.player?.phone}
        </div>
      </div>
    </div>
  );
};

// صفحة الأختام: cover + scale(1.03) زي الموقع
const StampsSpread = ({ regions, journey }: PassportPdfTemplateProps) => (
  <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.03)', transformOrigin: 'center' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/passport-page-hq.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
    {regions.map((region) => {
      const coords = regionCoords[region.id];
      if (!coords || !journey.completed.includes(region.id)) return null;
      return (
        <div
          key={region.id}
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -50%)',
            width: '10%',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            border: '3px dashed #DDB572',
            backgroundColor: 'rgba(221,181,114,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
    <div style={{ position: 'fixed', top: 0, left: '-10000px', zIndex: -1, pointerEvents: 'none' }}>
      <div
        ref={ref}
        className="flex flex-col items-center bg-white"
        style={{ width: 1440, padding: 40, gap: 40 }}
      >
        {/* 1: Front Cover (Right Side of cover spread) */}
        <Page side="right">
          <CoverSpread />
        </Page>

        {/* 2: Intro (Left Side) */}
        <Page side="left">
          <IntroPage journey={journey} />
        </Page>

        {/* 3: Stamps 1 (Right Side) -> which is the left half of the stamps spread */}
        {/* Wait, if it's the right side of the PDF page, we set side="right".
            BUT StampsSpread has the left stamps on the left side of the spread.
            If we set side="right", it will render the RIGHT half of StampsSpread.
            Ah! We want to render the LEFT half of StampsSpread, but we want it to be a standalone page.
            Actually, the Page component offsets the inner div.
            If side="left", it shows the left half of the inner div.
            If side="right", it shows the right half of the inner div.
            The first 6 stamps are on the LEFT half of StampsSpread.
            So to show the left half, we MUST use side="left".
            But if we want to visually represent it as "Page 3", it doesn't matter for the PDF because the PDF is single pages!
            We just need to capture the correct half of the spread.
        */}
        <Page side="left">
          <StampsSpread regions={regions} journey={journey} />
        </Page>

        {/* 4: Stamps 2 (Right half of the stamps spread) */}
        <Page side="right">
          <StampsSpread regions={regions} journey={journey} />
        </Page>

        {/* 5: Back Cover (Right Side of back cover spread) */}
        {/* To show the right side of the back cover spread, we use side="right" */}
        <Page side="right">
          <BackCoverSpread />
        </Page>
      </div>
    </div>
  )
);

PassportPdfTemplate.displayName = 'PassportPdfTemplate';
