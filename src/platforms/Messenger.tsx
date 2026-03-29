// Messenger Preview Component
import { useAppStore } from '../stores/appStore';
import { Phone, Video, Info } from 'lucide-react';

interface MessengerPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const MessengerPreview: React.FC<MessengerPreviewProps> = ({ containerRef }) => {
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
      className="w-[375px] h-[667px] bg-white relative overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-[#0084FF]">←</button>
          {contact.photo ? (
            <img src={contact.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm text-black">{contact.name}</h3>
            <p className="text-xs text-gray-500">{contact.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-[#0084FF]" />
          <Video className="w-5 h-5 text-[#0084FF]" />
          <Info className="w-5 h-5 text-[#0084FF]" />
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
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
              <div 
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  message.sender === 'me' 
                    ? 'bg-[#0084FF] text-white rounded-br-sm' 
                    : 'bg-[#E4E6EB] text-black rounded-bl-sm'
                }`}
              >
                {message.type === 'image' ? (
                  <img src={message.content} alt="" className="rounded max-w-full" />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-[10px] ${message.sender === 'me' ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender === 'me' && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-white px-3 py-3 flex items-center gap-2 border-t">
        <div className="flex items-center gap-2">
          <span className="text-2xl">➕</span>
          <span className="text-2xl">📷</span>
          <span className="text-2xl">🎙️</span>
        </div>
        <div className="flex-1 bg-[#F0F2F5] rounded-full px-4 py-2 flex items-center">
          <span className="text-gray-500 text-sm">Aa</span>
        </div>
        <span className="text-2xl">👍</span>
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
