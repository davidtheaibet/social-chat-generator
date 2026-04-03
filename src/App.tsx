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
import { Camera, Crown, X as CloseIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

type MobileTab = 'editor' | 'preview';


function App() {
  const { currentPlatform, isPremium, setPremium, messages } = useAppStore();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');
  const [upgradeBannerDismissed, setUpgradeBannerDismissed] = useState(false);
  const [exportPreview, setExportPreview] = useState<{ dataUrl: string; filename: string } | null>(null);

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
        allowTaint: false,
        scale: 2,
        backgroundColor: null,
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });

      // Watermark is rendered inside previewRef via WatermarkOverlay and captured by html2canvas.
      // No additional canvas drawing needed — adding it here would create a double-watermark
      // mismatch between the on-screen preview and the exported image.

      const filename = `chat-${currentPlatform}-${Date.now()}.png`;
      const dataUrl = canvas.toDataURL('image/png');
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        // iOS Safari blocks programmatic downloads — show the image in an overlay
        // so the user can long-press → "Save to Photos" / "Add to Photos"
        setExportPreview({ dataUrl, filename });
      } else {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      }
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
          boxShadow: '0 24px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          background: '#000',
          display: 'inline-block',
          outline: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {currentPlatform === 'whatsapp' && <WhatsAppPreview containerRef={previewRef} />}
        {currentPlatform === 'instagram' && <InstagramPreview containerRef={previewRef} />}
        {currentPlatform === 'snapchat' && <SnapchatPreview containerRef={previewRef} />}
        {currentPlatform === 'messenger' && <MessengerPreview containerRef={previewRef} />}
        {currentPlatform === 'tiktok' && <TikTokPreview containerRef={previewRef} />}
      </div>

      {/* Action buttons */}
      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Screenshot button */}
        <button
          onClick={handleExport}
          disabled={messages.length === 0}
          style={{
            height: '44px',
            width: '100%',
            borderRadius: '10px',
            border: 'none',
            background: messages.length === 0 ? '#9CA3AF' : '#6366F1',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'inherit',
            opacity: messages.length === 0 ? 0.4 : 1,
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            if (messages.length > 0) {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.01)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = messages.length === 0 ? '0.4' : '1';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          <Camera className="w-4 h-4" />
          Screenshot
        </button>

        {/* Video export */}
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
            <img
              src="/logo.jpg"
              alt="My Social Generator"
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          {isPremium ? (
            <span
              style={{
                height: '36px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1.5px solid #6366F1',
                color: '#6366F1',
                fontSize: '14px',
                fontWeight: 600,
                background: '#EEF2FF',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Crown style={{ width: 14, height: 14, color: '#F59E0B' }} />
              Premium
            </span>
          ) : (
            <button
              onClick={() => setShowUpgrade(true)}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
                transition: 'opacity 0.15s, transform 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <Crown style={{ width: 14, height: 14 }} />
              Remove Watermark
            </button>
          )}
        </div>
      </header>

      {/* Editor / Preview tab switcher — all screen sizes */}
      <div
        className="flex bg-white sticky z-30"
        style={{ top: '56px', borderBottom: '1px solid #F3F4F6' }}
      >
        {(['editor', 'preview'] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            style={{
              flex: 1,
              minHeight: '52px',
              padding: '14px 0',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'inherit',
              textTransform: 'capitalize',
              background: 'none',
              border: 'none',
              borderBottom: mobileTab === tab ? '2px solid #6366F1' : '2px solid transparent',
              color: mobileTab === tab ? '#6366F1' : '#6B7280',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Upgrade nudge banner — free users only */}
      {!isPremium && !upgradeBannerDismissed && (
        <div
          style={{
            background: 'linear-gradient(90deg, #EEF2FF, #F5F3FF)',
            borderBottom: '1px solid #E0E7FF',
            padding: '10px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Crown style={{ width: 16, height: 16, color: '#F59E0B', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#374151' }}>
              Your exports include a watermark.{' '}
              <button
                onClick={() => setShowUpgrade(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366F1',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit',
                  textDecoration: 'underline',
                }}
              >
                Upgrade to remove it
              </button>{' '}
              — $9.99 lifetime.
            </span>
          </div>
          <button
            onClick={() => setUpgradeBannerDismissed(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
              padding: '2px',
              lineHeight: 0,
              flexShrink: 0,
            }}
            aria-label="Dismiss"
          >
            <CloseIcon style={{ width: 14, height: 14 }} />
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto" style={{ padding: '32px 32px' }}>
        {mobileTab === 'editor' ? (
          /* Editor mode: side-by-side on desktop, editor only on mobile */
          <>
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
            <div className="lg:hidden">
              <Editor onUpgradeClick={() => setShowUpgrade(true)} />
            </div>
          </>
        ) : (
          /* Preview mode: phone mockup only, no editor controls */
          <div
            className="flex flex-col items-center"
            style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              padding: '40px 24px',
            }}
          >
            {PhonePreview}
          </div>
        )}
      </main>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* iOS export preview — long-press the image to save to Photos */}
      {exportPreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
            padding: '24px 16px',
          }}
          onClick={() => setExportPreview(null)}
        >
          <div
            style={{ position: 'relative', maxWidth: '340px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExportPreview(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '8px',
                lineHeight: 0,
              }}
            >
              <CloseIcon style={{ width: 24, height: 24 }} />
            </button>
            <img
              src={exportPreview.dataUrl}
              alt="Export preview"
              style={{
                width: '100%',
                borderRadius: '12px',
                display: 'block',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            />
            <p
              style={{
                color: 'white',
                textAlign: 'center',
                marginTop: '16px',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              Tap and hold the image → Save to Photos
            </p>
            <a
              href={exportPreview.dataUrl}
              download={exportPreview.filename}
              style={{
                display: 'block',
                marginTop: '12px',
                textAlign: 'center',
                color: '#A5B4FC',
                fontSize: '13px',
                textDecoration: 'underline',
              }}
            >
              Or tap here to download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
