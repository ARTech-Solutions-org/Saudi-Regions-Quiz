import React, { forwardRef } from 'react';
import { Region } from '../data/regions';
import { SavedJourney } from '../App';
import { regionCoords } from './Passport';

interface PassportPdfTemplateProps {
  regions: Region[];
  journey: SavedJourney;
}

export const PassportPdfTemplate = forwardRef<HTMLDivElement, PassportPdfTemplateProps>(
  ({ regions, journey }, ref) => {
    return (
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', zIndex: -1 }}>
        <div 
          ref={ref} 
          className="flex flex-col items-center bg-white"
          style={{ width: '1440px', padding: '40px', gap: '40px' }}
        >
        
        {/* PAGE 1: FRONT COVER (Right half of the cover SVG) */}
        <div data-pdf-page="true" style={{ width: '720px', height: '1024px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '-720px', width: '1440px', height: '1024px' }}>
            <img
              src="/passport-cover-hq.png"
              alt="Cover"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* PAGE 2: INTRO LEFT PAGE */}
        <div data-pdf-page="true" style={{ width: '720px', height: '1024px', position: 'relative', overflow: 'hidden', backgroundColor: '#F6F4EB' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '1440px', height: '1024px' }}>
            <img
              src="/passport-intro.svg"
              alt="Intro"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
            
            <div style={{ position: 'absolute', top: '28%', left: '3.5%', width: '40%', height: '6.64%', display: 'flex', alignItems: 'center', paddingLeft: '2%', paddingRight: '2%', color: '#004D40', fontSize: '22px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {journey.player?.name}
            </div>
            <div style={{ position: 'absolute', top: '45.5%', left: '3.5%', width: '40%', height: '6.64%', display: 'flex', alignItems: 'center', paddingLeft: '2%', paddingRight: '2%', color: '#004D40', fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {journey.player?.email}
            </div>
            <div style={{ position: 'absolute', top: '63%', left: '3.5%', width: '40%', height: '6.64%', display: 'flex', alignItems: 'center', paddingLeft: '2%', paddingRight: '2%', color: '#004D40', fontSize: '22px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {journey.player?.phone}
            </div>
          </div>
        </div>

        {/* PAGE 3: INTRO RIGHT PAGE */}
        <div data-pdf-page="true" style={{ width: '720px', height: '1024px', position: 'relative', overflow: 'hidden', backgroundColor: '#F6F4EB' }}>
          <div style={{ position: 'absolute', top: 0, left: '-720px', width: '1440px', height: '1024px' }}>
            <img
              src="/passport-intro.svg"
              alt="Intro"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* PAGE 4: INNER LEFT PAGE (Left half of the spread) */}
        <div data-pdf-page="true" style={{ width: '720px', height: '1024px', position: 'relative', overflow: 'hidden', backgroundColor: '#F6F4EB' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '1440px', height: '1024px' }}>
            <img
              src="/passport-page-hq.png"
              alt="Pages"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />

            {regions.map((region) => {
              const coords = regionCoords[region.id];
              if (!coords) return null;
              if (!journey.completed.includes(region.id)) return null;

              return (
                <div 
                  key={region.id}
                  style={{ 
                    position: 'absolute',
                    top: coords.top, 
                    left: coords.left,
                    transform: 'translate(-50%, -50%)',
                    width: '144px',
                    height: '144px',
                    borderRadius: '50%',
                    border: '4px dashed #DDB572',
                    backgroundColor: 'rgba(221, 181, 114, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img src="/stamp-new.png" alt="" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* PAGE 5: INNER RIGHT PAGE (Right half of the spread) */}
        <div data-pdf-page="true" style={{ width: '720px', height: '1024px', position: 'relative', overflow: 'hidden', backgroundColor: '#F6F4EB' }}>
          <div style={{ position: 'absolute', top: 0, left: '-720px', width: '1440px', height: '1024px' }}>
            <img
              src="/passport-page-hq.png"
              alt="Pages"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />

            {regions.map((region) => {
              const coords = regionCoords[region.id];
              if (!coords) return null;
              if (!journey.completed.includes(region.id)) return null;

              return (
                <div 
                  key={region.id}
                  style={{ 
                    position: 'absolute',
                    top: coords.top, 
                    left: coords.left,
                    transform: 'translate(-50%, -50%)',
                    width: '144px',
                    height: '144px',
                    borderRadius: '50%',
                    border: '4px dashed #DDB572',
                    backgroundColor: 'rgba(221, 181, 114, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img src="/stamp-new.png" alt="" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* PAGE 6: BACK COVER (Left half of the cover SVG) */}
        <div data-pdf-page="true" style={{ width: '720px', height: '1024px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '1440px', height: '1024px' }}>
            <img
              src="/passport-cover-hq.png"
              alt="Cover"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>

      </div>
      </div>
    );
  }
);

PassportPdfTemplate.displayName = 'PassportPdfTemplate';
