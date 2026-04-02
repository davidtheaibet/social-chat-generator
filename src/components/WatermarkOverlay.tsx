import { useAppStore } from '../stores/appStore';

/**
 * Renders a repeating diagonal watermark over the preview for free users.
 * Hidden entirely when isPremium is true.
 */
export const WatermarkOverlay: React.FC = () => {
  const isPremium = useAppStore((s) => s.isPremium);

  if (isPremium) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Diagonal repeating text watermarks */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(i % 3) * 35 - 10}%`,
            top: `${Math.floor(i / 3) * 28 - 5}%`,
            transform: 'rotate(-30deg)',
            whiteSpace: 'nowrap',
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.55)',
            textShadow: '0 1px 2px rgba(0,0,0,0.35)',
            letterSpacing: '0.5px',
            userSelect: 'none',
          }}
        >
          mysocialgenerator.com
        </div>
      ))}
      {/* Bottom-centre badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 56,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.45)',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          padding: '3px 10px',
          borderRadius: '20px',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        mysocialgenerator.com
      </div>
    </div>
  );
};
