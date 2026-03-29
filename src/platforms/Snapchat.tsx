// Snapchat Preview Component
import { useAppStore } from '../stores/appStore';

interface SnapchatPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const SnapchatPreview: React.FC<SnapchatPreviewProps> = ({ containerRef }) => {
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
      className="w-[375px] h-[667px] bg-[#FFFC00] relative overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#FFFC00] px-4 py-3 flex items-center justify-between border-b border-yellow-400">
        <div className="flex items-center gap-3">
          <button className="text-black font-bold text-lg">←</button>
          {contact.photo ? (
            <img src={contact.photo} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold border-2 border-white">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-sm text-black">{contact.name}</h3>
            <div className="flex items-center gap-1">
              <span className="text-xs text-black/70">🔥 12</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
      
      {/* Streak Banner */}
      <div className="bg-[#FFFC00] px-4 py-2 flex items-center justify-center border-b border-yellow-400">
        <span className="text-sm font-bold text-black">🔥 Snapstreak: 12 days</span>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Add messages using the editor</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {message.sender !== 'me' && contact.photo && (
                  <img src={contact.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                )}
                <div 
                  className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'me' 
                      ? 'bg-[#FFFC00] text-black rounded-br-sm' 
                      : 'bg-[#E5E5EA] text-black rounded-bl-sm'
                  }`}
                >
                  {message.type === 'image' ? (
                    <div className="relative">
                      <img src={message.content} alt="" className="rounded max-w-full" />
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        🔴 Live
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-black/50">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'me' && <span className="text-[10px]">✓</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-white px-3 py-3 flex items-center gap-2 border-t">
        <div className="w-10 h-10 bg-[#FFFC00] rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2 flex items-center">
          <span className="text-gray-400 text-sm">Send a chat</span>
        </div>
        <div className="w-10 h-10 bg-[#FFFC00] rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </div>
      </div>
      
      {/* Watermark */}
      {!isPremium && (
        <div className="absolute bottom-16 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          social-chat-generator.app
        </div>
      )}
    </div>
  );
};
