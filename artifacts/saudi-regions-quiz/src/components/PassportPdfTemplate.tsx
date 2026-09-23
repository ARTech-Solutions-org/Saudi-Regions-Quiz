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

// حدود صندوق الرسالة على الغلاف الخلفي (نفس النسب: top:86% left:10% width:80% height:11%)
const MESSAGE_BOX = {
  top: 0.86 * PAGE_H,
  left: 0.10 * PAGE_W,
  width: 0.80 * PAGE_W,
  height: 0.11 * PAGE_H,
};

// بيستنى الخطوط تخلص تحميل فعليًا (مش بس تتحمل، لكن تبقى جاهزة للاستخدام).
// ده بيتحل هنا كـ state عشان أي حساب هيعتمد عليه يتعمل من تاني بعد الجاهزية،
// مش يتحسب مرة واحدة بس وقت أول render (لما الخط لسه ممكن يكون مش جاهز).
function useFontsReady() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) setReady(true);
      });
    } else {
      setReady(true);
    }
    return () => {
      cancelled = true;
    };
  }, []);
  return ready;
}

// بيجيب الـ font-family الفعلي المطبّق على أي className (زي 'font-display')
// من الصفحة نفسها، بدل ما نكتب اسم الخط يدويًا وممكن نغلط فيه أو ننساه.
function getResolvedFontFamily(className: string, fontWeight: string): string {
  if (typeof document === 'undefined') return 'sans-serif';
  const probe = document.createElement('span');
  probe.className = className;
  probe.style.position = 'fixed';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.left = '-9999px';
  probe.style.fontWeight = fontWeight;
  probe.textContent = 'x';
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily || 'sans-serif';
  document.body.removeChild(probe);
  return family;
}

// بيقسم النص على أسطر بحيث كل سطر يدخل جوّه عرض الصندوق.
// لو كلمة كاملة (أو نص من غير أي فراغات) أطول من عرض الصندوق، بيكسرها حرف بحرف.
function wrapAtSize(
  text: string,
  size: number,
  boxWidth: number,
  ctx: CanvasRenderingContext2D,
  fontFamily: string,
  fontWeight: string
): string[] {
  ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  const fits = (s: string) => ctx.measureText(s).width <= boxWidth;

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (fits(candidate)) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
      current = '';
    }

    if (fits(word)) {
      current = word;
    } else {
      let chunk = '';
      for (const ch of word) {
        const trial = chunk + ch;
        if (fits(trial)) {
          chunk = trial;
        } else {
          if (chunk) lines.push(chunk);
          chunk = ch;
        }
      }
      current = chunk;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function wrapAndFitText(
  text: string,
  boxWidth: number,
  boxHeight: number,
  opts: {
    fontFamily: string;
    fontWeight?: string;
    maxFontSize?: number;
    minFontSize?: number;
    lineHeightRatio?: number;
  }
): { fontSize: number; lines: string[] } {
  const {
    fontFamily,
    fontWeight = '700',
    maxFontSize = 32,
    minFontSize = 10,
    lineHeightRatio = 1.25,
  } = opts;

  if (typeof document === 'undefined' || !text) {
    return { fontSize: minFontSize, lines: text ? [text] : [] };
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { fontSize: minFontSize, lines: [text] };

  for (let size = maxFontSize; size >= minFontSize; size -= 0.5) {
    const lines = wrapAtSize(text, size, boxWidth, ctx, fontFamily, fontWeight);
    const totalHeight = lines.length * size * lineHeightRatio;
    if (totalHeight <= boxHeight) {
      return { fontSize: size, lines };
    }
  }

  return { fontSize: minFontSize, lines: wrapAtSize(text, minFontSize, boxWidth, ctx, fontFamily, fontWeight) };
}

function FittedMessage({ text }: { text: string }) {
  const fontsReady = useFontsReady();

  const { fontSize, lines } = React.useMemo(() => {
    const fontFamily = getResolvedFontFamily('font-display', '700');
    return wrapAndFitText(text, MESSAGE_BOX.width, MESSAGE_BOX.height, {
      fontFamily,
      fontWeight: '700',
      maxFontSize: 32,
      minFontSize: 8,          // ← نزّلنا الحد الأدنى شوية كهامش أمان إضافي
      lineHeightRatio: 1.3,    // ← زودناها شوية عشان تاخد بالها من الحروف اللي ليها ذيل (g, y, j...)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontsReady]);

  return (
    <div
      style={{
        position: 'absolute',
        top: MESSAGE_BOX.top,
        left: MESSAGE_BOX.left,
        width: MESSAGE_BOX.width,
        height: MESSAGE_BOX.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',  // ← بدل center: يبدأ من فوق دايمًا، مش يتلزّق ويقطع
        overflow: 'visible',           // ← بدل hidden: مفيش قص خالص، لأننا ضامنين الحجم صح من الحساب
        textAlign: 'center',
        color: '#7CFFB2',
        opacity: fontsReady ? 1 : 0,
      }}
      className="font-display"
    >
      {lines.map((line, i) => (
        <div key={i} style={{ fontSize, fontWeight: 700, lineHeight: 1.3, maxWidth: '100%' }}>
          {line}
        </div>
      ))}
    </div>
  );
}
  
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

        {/* 2: الأختام - النص الشمال من سبريد الأختام */}
        <Page side="left">
          <StampsSpread regions={regions} journey={journey} />
        </Page>

        {/* 3: الأختام - النص اليمين من سبريد الأختام */}
        <Page side="right">
          <StampsSpread regions={regions} journey={journey} />
        </Page>

        {/* 4: الغلاف الخلفي = النص الشمال من نفس سبريد الغلاف (من غير عكس/مرآة) */}
        <Page side="left">
          <CoverSpread />
          {journey.player?.phone && <FittedMessage text={journey.player.phone} />}
        </Page>
      </div>
    </div>
  )
);

PassportPdfTemplate.displayName = 'PassportPdfTemplate';
