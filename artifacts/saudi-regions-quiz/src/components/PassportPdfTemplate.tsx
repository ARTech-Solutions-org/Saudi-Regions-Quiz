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

// الغلاف: fill زي الموقع (object-fill). نفس السبريد بيتستخدم للغلاف الأمامي (يمين)
// والغلاف الخلفي (شمال) — من غير أي عكس/مرآة.
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

const IntroPage = ({ journey }: { journey: SavedJourney }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex' }}>
      <div style={{ width: '50%', height: '100%', position: 'relative' }}>
        <img
          src="/passport-intro-new.png"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', objectFit: 'fill' }}
        />
        <div
          style={{
            position: 'absolute',
            top: '27%',
            left: '9%',
            width: '80%',
            height: '9.5%',
            color: '#000000',
            fontSize: 26,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {journey.player?.name}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '47%',
            left: '9%',
            width: '80%',
            height: '9.5%',
            color: '#000000',
            fontSize: 22,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {journey.player?.email}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '64%',
            left: '9%',
            width: '80%',
            height: '30.5%',
            paddingTop: '3%',
            color: '#000000',
            fontSize: 26,
            fontWeight: 'bold',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'hidden',
          }}
        >
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
    // position: fixed + left: -10000px (بدل width/height: 0) عشان iOS Safari
    // يحسب الـ layout الداخلي صح قبل ما html2canvas يصوّر.
    <div style={{ position: 'fixed', top: 0, left: '-10000px', zIndex: -1, pointerEvents: 'none' }}>
      <div
        ref={ref}
        className="flex flex-col items-center bg-white"
        style={{ width: 1440, padding: 40, gap: 40 }}
      >
        {/* 1: الغلاف الأمامي (النص اليمين من سبريد الغلاف) */}
        <Page side="right">
          <CoverSpread />
        </Page>

        {/* 2: صفحة البيانات (النص الشمال) */}
        <Page side="left">
          <IntroPage journey={journey} />
        </Page>

        {/* 3: الأختام - النص الشمال من سبريد الأختام */}
        <Page side="left">
          <StampsSpread regions={regions} journey={journey} />
        </Page>

        {/* 4: الأختام - النص اليمين من سبريد الأختام */}
        <Page side="right">
          <StampsSpread regions={regions} journey={journey} />
        </Page>

        {/* 5: الغلاف الخلفي = النص الشمال من نفس سبريد الغلاف (من غير عكس/مرآة) */}
        <Page side="left">
          <CoverSpread />
        </Page>
      </div>
    </div>
  )
);

PassportPdfTemplate.displayName = 'PassportPdfTemplate';