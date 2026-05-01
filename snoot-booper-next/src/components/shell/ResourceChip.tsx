/**
 * A single HUD-top resource readout: glyph badge + value + label/sub.
 */
import Image from 'next/image';

interface ResourceChipProps {
  glyph?: string;
  imageSrc?: string;
  imageAlt?: string;
  label: string;
  value: string;
  sub: string;
  tone: string; // CSS color for the glyph + value glow
}

export default function ResourceChip({ glyph, imageSrc, imageAlt = '', label, value, sub, tone }: ResourceChipProps) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <div
        className={`glyph-badge ${imageSrc ? 'asset-badge' : ''}`}
        style={{ color: tone, width: 38, height: 38 }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={38}
            height={38}
            className="resource-chip-art"
          />
        ) : (
          <span style={{ fontSize: 16 }}>{glyph}</span>
        )}
      </div>
      <div className="leading-tight min-w-0">
        <div
          className="font-display nums text-[18px] font-bold whitespace-nowrap"
          style={{ color: '#fff7df', textShadow: '0 0 8px rgba(255,225,170,0.4)' }}
        >
          {value}
        </div>
        <div className="h-eyebrow resource-chip-meta whitespace-nowrap">
          {label} · {sub}
        </div>
      </div>
    </div>
  );
}
