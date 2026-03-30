// TikTok Preview Component
import { useAppStore } from '../stores/appStore';
import { Heart, MessageCircle } from 'lucide-react';

interface TikTokPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const TikTokPreview: React.FC<TikTokPreviewProps> = ({ containerRef }) => {
  const { contact, messages, isPremium } = useAppStore();
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-[375px] h-[667px] bg-black relative overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-black px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <button className="text-white">←</button>
        <h3 className="font-semibold text-white">Comments</h3>
        <button className="text-white">✕</button>
      </div>
      
      {/* Video Preview Area */}
      <div className="h-48 bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p className="text-sm">Video Preview</p>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-sm">No comments yet</p>
            <p className="text-xs">Add comments using the editor</p>
          </div>
        ) : (
          messages.map((message) => (
            <div data-msg-bubble key={message.id} className="flex gap-3">
              {contact.photo ? (
                <img src={contact.photo} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-white text-sm">{contact.name}</span>
                  <span className="text-gray-500 text-xs">{formatTime(message.timestamp)}</span>
                </div>
                {message.type === 'image' ? (
                  <img src={message.content} alt="" className="rounded-lg mt-1 max-w-full" />
                ) : (
                  <p className="text-white text-sm mt-1">{message.content}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-gray-400 text-xs">
                    <Heart className="w-4 h-4" />
                    <span>24</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-400 text-xs">
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-black px-3 py-3 flex items-center gap-2 border-t border-gray-800">
        {contact.photo ? (
          <img src={contact.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">
            {contact.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 bg-[#1a1a1a] rounded-full px-4 py-2 flex items-center">
          <span className="text-gray-500 text-sm">Add comment...</span>
        </div>
        <span className="text-gray-400 text-sm">@</span>
        <span className="text-gray-400 text-sm">😊</span>
      </div>
      
      {/* Watermark */}
      {!isPremium && (
        <div className="absolute bottom-16 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
          social-chat-generator.app
        </div>
      )}
    </div>
  );
};
