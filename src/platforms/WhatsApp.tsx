import { useAppStore, type Message } from '../stores/appStore';
import { Check, CheckCheck, Mic, Camera } from 'lucide-react';

interface WhatsAppPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ containerRef }) => {
  const { contact, messages, isPremium } = useAppStore();
  
  return (
    <div 
      ref={containerRef}
      className="w-[375px] h-[667px] bg-[#e5ddd5] relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d1d7db' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-white">←</button>
          {contact.photo ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
              <img 
                src={contact.photo} 
                alt="" 
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm">{contact.name}</h3>
            <p className="text-xs text-gray-300">{contact.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Camera className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Add messages using the editor</p>
          </div>
        ) : (
          messages.map((message: Message, index: number) => (
            <MessageBubble key={message.id} message={message} isFirst={index === 0} />
          ))
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-[#f0f0f0] px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">😊</span>
          <span className="text-gray-400 text-sm">Type a message</span>
        </div>
        <div className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
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

interface MessageBubbleProps {
  message: Message;
  isFirst: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      default:
        return <Check className="w-3 h-3 text-gray-400" />;
    }
  };
  
  const isMe = message.sender === 'me';
  
  return (
    <div data-msg-bubble className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] px-3 py-2 rounded-lg relative ${
          isMe 
            ? 'bg-[#dcf8c6] rounded-tr-none' 
            : 'bg-white rounded-tl-none'
        }`}
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      >
        {message.type === 'image' ? (
          <img src={message.content} alt="" className="rounded max-w-full" />
        ) : (
          <p className="text-sm text-gray-800">{message.content}</p>
        )}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] text-gray-500">
            {formatTime(message.timestamp)}
          </span>
          {isMe && getStatusIcon(message.status)}
        </div>
      </div>
    </div>
  );
};

// Missing imports
const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MoreVertical = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);
