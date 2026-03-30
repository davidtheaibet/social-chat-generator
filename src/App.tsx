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
import { Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

type MobileTab = 'editor' | 'preview';

// Minimal ChatFake logo icon
const ChatFakeLogo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="5" fill="#6366F1" />
    <path d="M5 7h10M5 10h7M5 13h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
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

  const PhonePreview = (
    <div className="flex flex-col items-center gap-6">
      {/* Phone frame */}
      <div
        style={{
          border: '8px solid #1C1C1E',
          borderRadius: '44px',
          boxShadow: '0 30px 70px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)',
          overflow: 'hidden',
          background: '#000',
          display: 'inline-block',
        }}
      >
        {currentPlatform === 'whatsapp' && <WhatsAppPreview containerRef={previewRef} />}
        {currentPlatform === 'instagram' && <InstagramPreview containerRef={previewRef} />}
        {currentPlatform === 'snapchat' && <SnapchatPreview containerRef={previewRef} />}
        {currentPlatform === 'messenger' && <MessengerPreview containerRef={previewRef} />}
        {currentPlatform === 'tiktok' && <TikTokPreview containerRef={previewRef} />}
      </div>

      {/* Screenshot button */}
      <button
        onClick={handleExport}
        disabled={messages.length === 0}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: messages.length === 0 ? '#9CA3AF' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          boxShadow: messages.length > 0 ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
        }}
      >
        <Camera className="w-4 h-4" />
        Screenshot
      </button>

      {/* Video export */}
      <div className="flex flex-col items-center gap-2">
        <VideoExport previewRef={previewRef} onUpgradeClick={() => setShowUpgrade(true)} />
        <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
          {isPremium
            ? 'Premium: No watermark · MP4 export · Unlimited messages'
            : 'Free: Watermark on exports · Max 20 messages'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FC' }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-40 bg-white"
        style={{ borderBottom: '1px solid #F3F4F6', height: '56px' }}
      >
        <div
          className="max-w-7xl mx-auto h-full flex items-center justify-between"
          style={{ padding: '0 32px' }}
        >
          <div className="flex items-center gap-2">
            <ChatFakeLogo />
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              ChatFake
            </span>
          </div>
          <button
            onClick={() => setShowUpgrade(true)}
            className="transition-colors"
            style={{
              height: '36px',
              padding: '0 16px',
              borderRadius: '8px',
              border: '1.5px solid #6366F1',
              color: '#6366F1',
              fontSize: '14px',
              fontWeight: 600,
              background: 'white',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = '#EEF2FF';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = 'white';
            }}
          >
            {isPremium ? '✦ Premium' : 'Upgrade'}
          </button>
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div
        className="lg:hidden flex bg-white sticky z-30"
        style={{ top: '56px', borderBottom: '1px solid #F3F4F6' }}
      >
        {(['editor', 'preview'] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className="flex-1 py-3 text-sm font-semibold capitalize transition-colors"
            style={{
              borderBottom: mobileTab === tab ? '2px solid #6366F1' : '2px solid transparent',
              color: mobileTab === tab ? '#6366F1' : '#6B7280',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto" style={{ padding: '32px 32px' }}>
        {/* Desktop: 40/60 split */}
        <div className="hidden lg:flex gap-8 items-start">
          <div style={{ width: '40%' }}>
            <Editor onUpgradeClick={() => setShowUpgrade(true)} />
          </div>
          <div
            style={{ width: '60%' }}
            className="flex items-center justify-center"
          >
            <div
              className="w-full flex flex-col items-center justify-center"
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                padding: '40px 24px',
                minHeight: '720px',
              }}
            >
              {PhonePreview}
            </div>
          </div>
        </div>

        {/* Mobile: tab-switched */}
        <div className="lg:hidden">
          {mobileTab === 'editor' && (
            <Editor onUpgradeClick={() => setShowUpgrade(true)} />
          )}
          {mobileTab === 'preview' && (
            <div
              className="flex flex-col items-center"
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                padding: '32px 16px',
              }}
            >
              {PhonePreview}
            </div>
          )}
        </div>
      </main>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export default App;
