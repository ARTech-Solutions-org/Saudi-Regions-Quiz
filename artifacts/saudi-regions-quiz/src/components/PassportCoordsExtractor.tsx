import { useEffect } from 'react';

export function PassportCoordsExtractor() {
  useEffect(() => {
    fetch('/passport-page.svg')
      .then(res => res.text())
      .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) return;
        
        // Temporarily append to DOM to get bounding boxes
        svg.style.position = 'absolute';
        svg.style.visibility = 'hidden';
        svg.style.width = '1440px';
        svg.style.height = '1024px';
        document.body.appendChild(svg);

        const ids = [
          'Riyadh', 'Madinah', 'Al-Qassim', 'Makkah', 'Eastern\nProvince',
          'Asir', 'Tabuk', 'Jazan', 'Al- Bahah', 'Hail', 'Najran', 
          'Northern\nBorders', 'Al- Jouf'
        ];

        const coords: any = {};
        ids.forEach(id => {
          const el = doc.getElementById(id);
          if (el) {
            const bbox = (el as unknown as SVGGraphicsElement).getBBox();
            coords[id] = {
              left: (bbox.x / 1440) * 100,
              top: (bbox.y / 1024) * 100,
              width: (bbox.width / 1440) * 100,
              height: (bbox.height / 1024) * 100
            };
          }
        });

        console.log("EXTRACTED COORDS:", JSON.stringify(coords, null, 2));
        document.body.removeChild(svg);
      });
  }, []);

  return null;
}
