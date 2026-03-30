// Instagram DM Preview Component
import { useAppStore } from '../stores/appStore';
import { Phone, Video, Info } from 'lucide-react';

interface InstagramPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({ containerRef }) => {
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
      {/* Header with Gradient */}
      <div 
        className="text-white px-4 py-3 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <button className="text-white">←</button>
          {contact.photo ? (
            <img src={contact.photo} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold border-2 border-white">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm">{contact.name}</h3>
            <p className="text-xs text-white/80">{contact.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5" />
          <Video className="w-5 h-5" />
          <Info className="w-5 h-5" />
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Add messages using the editor</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              data-msg-bubble
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  message.sender === 'me' 
                    ? 'bg-[#3797F0] text-white rounded-br-sm' 
                    : 'bg-[#262626] text-white rounded-bl-sm border border-gray-800'
                }`}
              >
                {message.type === 'image' ? (
                  <img src={message.content} alt="" className="rounded max-w-full" />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-white/70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-black px-3 py-3 flex items-center gap-2 border-t border-gray-800">
        <span className="text-2xl">😊</span>
        <div className="flex-1 bg-[#262626] rounded-full px-4 py-2 flex items-center">
          <span className="text-gray-400 text-sm">Message...</span>
        </div>
        <span className="text-[#3797F0] font-semibold">Send</span>
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
