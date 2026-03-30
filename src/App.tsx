import { useEffect, useRef, useState } from 'react';
import { useAppStore } from './stores/appStore';
import { Editor } from './components/Editor';
import { UpgradeModal } from './components/UpgradeModal';
import { VideoExport } from './components/VideoExport';
import { WhatsAppPreview } from './platforms/WhatsApp';
import { InstagramPreview } from './platforms/Instagram';
import { SnapchatPreview } from './platforms/Snapchat';
import { MessengerPreview } from './platforms/Messenger';
import { TikTokPreview } from './platforms/TikTok';
import { Camera, Crown, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

type MobileTab = 'editor' | 'preview';

// App logo — speech bubble
const Logo = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="34" height="34" rx="9" fill="url(#lg1)" />
    <path d="M7 9C7 7.34 8.34 6 10 6h14c1.66 0 3 1.34 3 3v11c0 1.66-1.34 3-3 3h-5.5l-3 4-3-4H10c-1.66 0-3-1.34-3-3V9Z" fill="white" fillOpacity="0.95"/>
    <circle cx="11.5" cy="14.5" r="1.5" fill="url(#lg1)" />
    <circle cx="17" cy="14.5" r="1.5" fill="url(#lg1)" />
    <circle cx="22.5" cy="14.5" r="1.5" fill="url(#lg1)" />
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1"/>
        <stop offset="1" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
  </svg>
);

function App() {
  const { currentPlatform, isPremium, setPremium, messages } = useAppStore();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get('premium_token');
    if (token) {
      verifyPremiumToken(token);
      const url = new URL(window.location.href);
      url.searchParams.delete('premium_token');
      window.history.replaceState({}, '', url.toString());
    }

    const sessionId = params.get('session_id');
    const payment = params.get('payment');
    if (payment === 'success' && sessionId) {
      exchangeSessionForToken(sessionId);
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }

    const saved = localStorage.getItem('premium_token');
    if (saved && !isPremium) {
      verifyPremiumToken(saved);
    }
  }, []);

  const verifyPremiumToken = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/verify-premium?token=${encodeURIComponent(token)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.isPremium) {
          setPremium(true);
          localStorage.setItem('premium_token', token);
        }
      }
    } catch {
      // silently fail
    }
  };

  const exchangeSessionForToken = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/checkout-success?session_id=${encodeURIComponent(sessionId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.premium_token) {
          await verifyPremiumToken(data.premium_token);
        }
      }
    } catch {
      // silently fail
    }
  };

  const handleExport = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });

      if (!isPremium) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.font = '14px Inter, -apple-system, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.textBaseline = 'bottom';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          const text = 'ChatFake.app';
          const x = canvas.width - ctx.measureText(text).width - 16;
          const y = canvas.height - 16;
          ctx.fillText(text, x, y);
          ctx.restore();
        }
      }

      const link = document.createElement('a');
      link.download = `chat-${currentPlatform}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const PreviewPanel = (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Phone label */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest hidden lg:block">Live Preview</p>

      {/* iPhone 14 Pro Frame */}
      <div className="relative flex-shrink-0">
        <div
          className="iphone-frame relative"
          style={{
            width: 276,
            background: 'linear-gradient(160deg, #2c2c2e 0%, #1c1c1e 50%, #0f0f10 100%)',
            borderRadius: 48,
            padding: '14px 8px 10px',
          }}
        >
          {/* Volume buttons (left) */}
          <div style={{ position: 'absolute', left: -3, top: 86, width: 3, height: 22, background: '#3a3a3c', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3, top: 118, width: 3, height: 32, background: '#3a3a3c', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3, top: 158, width: 3, height: 32, background: '#3a3a3c', borderRadius: '3px 0 0 3px' }} />
          {/* Power button (right) */}
          <div style={{ position: 'absolute', right: -3, top: 118, width: 3, height: 48, background: '#3a3a3c', borderRadius: '0 3px 3px 0' }} />

          {/* Screen area */}
          <div
            style={{
              width: '100%',
              borderRadius: 38,
              overflow: 'hidden',
              background: '#000',
              position: 'relative',
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 88,
                height: 26,
                background: '#000',
                borderRadius: 18,
                zIndex: 10,
              }}
            />

            {/* Platform content scaled to fit 260px from 375px = 0.693 */}
            <div
              style={{
                width: 375,
                height: 667,
                transform: 'scale(0.693)',
                transformOrigin: 'top left',
                pointerEvents: 'none',
              }}
            >
              {currentPlatform === 'whatsapp' && <WhatsAppPreview containerRef={previewRef} />}
              {currentPlatform === 'instagram' && <InstagramPreview containerRef={previewRef} />}
              {currentPlatform === 'snapchat' && <SnapchatPreview containerRef={previewRef} />}
              {currentPlatform === 'messenger' && <MessengerPreview containerRef={previewRef} />}
              {currentPlatform === 'tiktok' && <TikTokPreview containerRef={previewRef} />}
            </div>
          </div>

          {/* Home indicator */}
          <div style={{ margin: '8px auto 2px', width: 88, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
        </div>

        {/* Screenshot CTA — floating below phone */}
        <button
          onClick={handleExport}
          disabled={messages.length === 0}
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: messages.length === 0
              ? '#94a3b8'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: messages.length > 0 ? '0 4px 20px rgba(99,102,241,0.45)' : undefined,
          }}
        >
          <Camera className="w-4 h-4" />
          Screenshot
        </button>
      </div>

      {/* Video export + status */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <VideoExport previewRef={previewRef} onUpgradeClick={() => setShowUpgrade(true)} />
        <p className="text-xs text-gray-400 text-center max-w-[240px]">
          {isPremium
            ? '✨ Premium active — no watermark · unlimited · MP4'
            : 'Free plan: watermark on exports · max 20 messages'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(150deg, #eef0f8 0%, #e8ebf5 100%)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'rgba(0,0,0,0.07)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-bold text-gray-900 tracking-tight">ChatFake</span>
              <span className="hidden sm:inline text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Beta
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPremium ? (
              <button
                onClick={() => setShowUpgrade(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  boxShadow: '0 2px 12px rgba(245,158,11,0.4)',
                }}
              >
                <Crown className="w-3.5 h-3.5" />
                Upgrade
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                Premium
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div
        className="lg:hidden flex border-b sticky z-30"
        style={{
          top: 57,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(0,0,0,0.07)',
        }}
      >
        {(['editor', 'preview'] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-all ${
              mobileTab === tab
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Desktop: side-by-side */}
        <div className="hidden lg:flex gap-12 items-start">
          <div className="flex-1 min-w-0">
            <Editor onUpgradeClick={() => setShowUpgrade(true)} />
          </div>
          <div className="flex-shrink-0 pt-1">
            {PreviewPanel}
          </div>
        </div>

        {/* Mobile: tab-switched */}
        <div className="lg:hidden">
          {mobileTab === 'editor' && <Editor onUpgradeClick={() => setShowUpgrade(true)} />}
          {mobileTab === 'preview' && (
            <div className="flex justify-center pt-6">{PreviewPanel}</div>
          )}
        </div>
      </main>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export default App;
