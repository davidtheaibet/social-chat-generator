import { useRef } from 'react';
import { useAppStore } from './stores/appStore';
import { Editor } from './components/Editor';
import { WhatsAppPreview } from './platforms/WhatsApp';
import { InstagramPreview } from './platforms/Instagram';
import { SnapchatPreview } from './platforms/Snapchat';
import { MessengerPreview } from './platforms/Messenger';
import { TikTokPreview } from './platforms/TikTok';
import { Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

function App() {
  const { currentPlatform, isPremium, messages } = useAppStore();
  const previewRef = useRef<HTMLDivElement | null>(null);
  
  const handleExport = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      
      // Add watermark if not premium
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
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Social Chat Generator
          </h1>
          <div className="flex items-center gap-4">
            {!isPremium ? (
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow">
                Upgrade $2.99
              </button>
            ) : (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold flex items-center gap-2">
                ✨ Premium
              </span>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Editor Panel */}
          <div className="flex-1 w-full">
            <Editor />
          </div>
          
          {/* Preview Panel */}
          <div className="flex-1 w-full flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Preview</h2>
            
            {/* Phone Frame */}
            <div className="relative">
              <div className="bg-gray-800 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-black rounded-[2.5rem] overflow-hidden">
                  {currentPlatform === 'whatsapp' && (
                    <WhatsAppPreview containerRef={previewRef} />
                  )}
                  {currentPlatform === 'instagram' && (
                    <InstagramPreview containerRef={previewRef} />
                  )}
                  {currentPlatform === 'snapchat' && (
                    <SnapchatPreview containerRef={previewRef} />
                  )}
                  {currentPlatform === 'messenger' && (
                    <MessengerPreview containerRef={previewRef} />
                  )}
                  {currentPlatform === 'tiktok' && (
                    <TikTokPreview containerRef={previewRef} />
                  )}
                </div>
              </div>
              
              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={messages.length === 0}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Take Screenshot
              </button>
            </div>
            
            {/* Preview Info */}
            <p className="mt-8 text-sm text-gray-500 text-center max-w-sm">
              {isPremium 
                ? 'Premium: No watermark, unlimited messages, all platforms'
                : 'Free: Watermark on exports, max 20 messages, 1 platform'
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
