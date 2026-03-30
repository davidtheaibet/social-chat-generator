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
import { Camera, Crown } from 'lucide-react';
import html2canvas from 'html2canvas';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

type MobileTab = 'editor' | 'preview';

function App() {
  const { currentPlatform, isPremium, setPremium, messages } = useAppStore();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');

  // Check for premium return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Handle direct premium_token in URL (legacy / manual flow)
    const token = params.get('premium_token');
    if (token) {
      verifyPremiumToken(token);
      const url = new URL(window.location.href);
      url.searchParams.delete('premium_token');
      window.history.replaceState({}, '', url.toString());
    }

    // Handle Stripe success redirect with session_id
    const sessionId = params.get('session_id');
    const payment = params.get('payment');
    if (payment === 'success' && sessionId) {
      exchangeSessionForToken(sessionId);
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }

    // Restore saved premium token
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
      // silently fail; not critical
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
      // silently fail; not critical
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
          ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.textBaseline = 'bottom';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 3;
          const text = 'social-chat-generator.app';
          const x = canvas.width - ctx.measureText(text).width - 12;
          const y = canvas.height - 12;
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
    <div className="flex-1 w-full flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 hidden lg:block">Preview</h2>

      {/* Phone Frame */}
      <div className="relative">
        <div className="bg-gray-800 rounded-[3rem] p-3 shadow-2xl">
          <div className="bg-black rounded-[2.5rem] overflow-hidden">
            {currentPlatform === 'whatsapp' && <WhatsAppPreview containerRef={previewRef} />}
            {currentPlatform === 'instagram' && <InstagramPreview containerRef={previewRef} />}
            {currentPlatform === 'snapchat' && <SnapchatPreview containerRef={previewRef} />}
            {currentPlatform === 'messenger' && <MessengerPreview containerRef={previewRef} />}
            {currentPlatform === 'tiktok' && <TikTokPreview containerRef={previewRef} />}
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={messages.length === 0}
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          <Camera className="w-5 h-5" />
          Screenshot
        </button>
      </div>

      {/* Video Export + info */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <VideoExport previewRef={previewRef} onUpgradeClick={() => setShowUpgrade(true)} />
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {isPremium
            ? 'Premium: No watermark, unlimited messages, MP4 export'
            : 'Free: Watermark on exports, max 20 messages'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Social Chat Generator
          </h1>
          <div className="flex items-center gap-2">
            {!isPremium ? (
              <button
                onClick={() => setShowUpgrade(true)}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-shadow flex items-center gap-1"
              >
                <Crown className="w-4 h-4" />
                Upgrade
              </button>
            ) : (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm flex items-center gap-2">
                ✨ Premium
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b bg-white sticky top-[57px] z-30">
        {(['editor', 'preview'] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
              mobileTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Desktop: side by side */}
        <div className="hidden lg:flex gap-8 items-start">
          <div className="flex-1 w-full">
            <Editor />
          </div>
          {PreviewPanel}
        </div>

        {/* Mobile: tab-switched */}
        <div className="lg:hidden">
          {mobileTab === 'editor' && (
            <div className="w-full">
              <Editor />
            </div>
          )}
          {mobileTab === 'preview' && PreviewPanel}
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export default App;
