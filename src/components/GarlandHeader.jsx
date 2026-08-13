import React from 'react';

export const GarlandHeader = ({ isVisible = true }) => {
  return (
    <div className={`garland-container ${!isVisible ? 'garland-hidden' : ''}`}>
      {/* High-definition South Indian Mango Leaf (Maavilai) Toran with Hanging Marigold Strings */}
      <div className="mango-garland-wrapper">
        <svg
          className="mango-garland-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1400 110"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Leaf Gradients */}
            <linearGradient id="mangoLeafGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#43A047" />
              <stop offset="50%" stopColor="#2E7D32" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
            
            <linearGradient id="mangoLeafGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#66BB6A" />
              <stop offset="50%" stopColor="#388E3C" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>

            {/* Marigold Flower Gradients */}
            <radialGradient id="marigoldOrangeGrad">
              <stop offset="0%" stopColor="#FFB74D" />
              <stop offset="60%" stopColor="#F57C00" />
              <stop offset="100%" stopColor="#E65100" />
            </radialGradient>

            <radialGradient id="marigoldYellowGrad">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="60%" stopColor="#FBC02D" />
              <stop offset="100%" stopColor="#F57F17" />
            </radialGradient>

            {/* Mango Leaf Unit Symbol */}
            <g id="singleMangoLeaf">
              <path
                d="M 0 0 C -8 18, -13 40, 0 65 C 13 40, 8 18, 0 0 Z"
                fill="url(#mangoLeafGrad1)"
                stroke="#1B5E20"
                strokeWidth="0.8"
              />
              {/* Leaf Center Vein */}
              <path d="M 0 0 L 0 58" stroke="#81C784" strokeWidth="1" opacity="0.7" />
            </g>

            {/* Hanging Marigold String Unit */}
            <g id="hangingMarigoldString">
              {/* Thread */}
              <line x1="0" y1="0" x2="0" y2="75" stroke="#E65100" strokeWidth="1.5" strokeDasharray="2,2" />
              {/* 5 Stacked Marigold Flowers (Yellow & Orange) */}
              <g transform="translate(0, 14)">
                <circle cx="0" cy="0" r="7.5" fill="url(#marigoldOrangeGrad)" />
                <circle cx="0" cy="0" r="4.5" fill="url(#marigoldYellowGrad)" />
              </g>
              <g transform="translate(0, 27)">
                <circle cx="0" cy="0" r="8" fill="url(#marigoldYellowGrad)" />
                <circle cx="0" cy="0" r="4.8" fill="url(#marigoldOrangeGrad)" />
              </g>
              <g transform="translate(0, 40)">
                <circle cx="0" cy="0" r="8.5" fill="url(#marigoldOrangeGrad)" />
                <circle cx="0" cy="0" r="5" fill="url(#marigoldYellowGrad)" />
              </g>
              <g transform="translate(0, 54)">
                <circle cx="0" cy="0" r="9" fill="url(#marigoldYellowGrad)" />
                <circle cx="0" cy="0" r="5.2" fill="url(#marigoldOrangeGrad)" />
              </g>
              <g transform="translate(0, 68)">
                <circle cx="0" cy="0" r="9.5" fill="url(#marigoldOrangeGrad)" />
                <circle cx="0" cy="0" r="5.5" fill="url(#marigoldYellowGrad)" />
              </g>
            </g>
          </defs>

          {/* DENSE MANGO LEAF OVERLAPPING BANNER ROW */}
          <g transform="translate(0, -5)">
            {Array.from({ length: 90 }).map((_, i) => {
              const x = i * 16 - 10;
              const angle = (i % 2 === 0 ? 3 : -3);
              const scale = 0.9 + (i % 3) * 0.08;
              return (
                <use
                  key={i}
                  href="#singleMangoLeaf"
                  transform={`translate(${x}, 0) rotate(${angle}) scale(${scale})`}
                />
              );
            })}
          </g>

          {/* REPEATING HANGING MARIGOLD STRINGS AT REGULAR INTERVALS */}
          <g transform="translate(0, 30)">
            {Array.from({ length: 11 }).map((_, i) => {
              const x = i * 135 + 40;
              return (
                <use
                  key={i}
                  href="#hangingMarigoldString"
                  transform={`translate(${x}, 0)`}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
