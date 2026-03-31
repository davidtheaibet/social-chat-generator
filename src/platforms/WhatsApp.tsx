import { useAppStore, type Message } from '../stores/appStore';
import { Check, CheckCheck, Mic, Camera, Smile, Paperclip } from 'lucide-react';

interface WhatsAppPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const StatusBar: React.FC<{ textColor?: string }> = ({ textColor = 'rgba(255,255,255,0.9)' }) => (
  <div
    style={{
      height: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      background: '#075e54',
    }}
  >
    <span style={{ fontSize: '11px', fontWeight: 700, color: textColor, letterSpacing: '-0.2px' }}>
      9:41
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      {/* Signal bars */}
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <rect x="0" y="6.5" width="2.5" height="4.5" rx="0.5" fill={textColor} />
        <rect x="4" y="4.5" width="2.5" height="6.5" rx="0.5" fill={textColor} />
        <rect x="8" y="2.5" width="2.5" height="8.5" rx="0.5" fill={textColor} />
        <rect x="12" y="0" width="2.5" height="11" rx="0.5" fill={textColor} />
      </svg>
      {/* Wifi */}
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <circle cx="7.5" cy="10" r="1.2" fill={textColor} />
        <path d="M4.5 7C5.5 6 6.5 5.5 7.5 5.5C8.5 5.5 9.5 6 10.5 7" stroke={textColor} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M2 4.5C3.8 2.7 5.5 1.8 7.5 1.8C9.5 1.8 11.2 2.7 13 4.5" stroke={textColor} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </svg>
      {/* Battery */}
      <svg width="23" height="11" viewBox="0 0 23 11" fill="none">
        <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" stroke={textColor} strokeWidth="1" />
        <rect x="20.5" y="3" width="2" height="5" rx="1" fill={textColor} />
        <rect x="2" y="2" width="14" height="7" rx="1.5" fill={textColor} />
      </svg>
    </div>
  </div>
);

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ containerRef }) => {
  const { contact, messages } = useAppStore();

  return (
    <div
      ref={containerRef}
      style={{
        width: '320px',
        height: '650px',
        background: '#ECE5DD',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d1d7db' fill-opacity='0.35' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Status bar */}
      <StatusBar />

      {/* Chat header */}
      <div
        style={{
          background: '#075e54',
          color: 'white',
          padding: '8px 12px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity="0.9">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {contact.photo ? (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img src={contact.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#128C7E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '15px',
                flexShrink: 0,
              }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', lineHeight: 1.2 }}>{contact.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}>
              {contact.status || 'online'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <VideoHeaderIcon />
          <PhoneIcon />
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ fontSize: '13px', color: '#667781' }}>No messages yet</p>
            <p style={{ fontSize: '11px', color: '#9CA3AF' }}>Add messages using the editor</p>
          </div>
        ) : (
          messages.map((message: Message, index: number) => (
            <WhatsAppBubble
              key={message.id}
              message={message}
              sameSenderAsPrev={index > 0 && messages[index - 1].sender === message.sender}
              isFirst={index === 0}
            />
          ))
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          background: '#F0F2F5',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Paperclip style={{ width: 22, height: 22, color: '#54656F', flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            background: 'white',
            borderRadius: '21px',
            height: '42px',
            padding: '0 10px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          <Smile style={{ width: 20, height: 20, color: '#54656F', flexShrink: 0, marginRight: '8px' }} />
          <input
            readOnly
            placeholder="Message"
            className="whatsapp-input"
            style={{
              flex: 1,
              fontSize: '15px',
              color: '#111',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
          />
          <Camera style={{ width: 20, height: 20, color: '#54656F', flexShrink: 0, marginLeft: '8px' }} />
        </div>
        <div
          style={{
            width: '42px',
            height: '42px',
            background: '#00A884',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Mic style={{ width: 20, height: 20, color: 'white' }} />
        </div>
      </div>
    </div>
  );
};

const WhatsAppBubble: React.FC<{ message: Message; sameSenderAsPrev: boolean; isFirst: boolean }> = ({ message, sameSenderAsPrev, isFirst }) => {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

  const isMe = message.sender === 'me';
  const marginTop = isFirst ? '0' : (sameSenderAsPrev ? '2px' : '8px');

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'read': return <CheckCheck style={{ width: 12, height: 12, color: '#53bdeb' }} />;
      case 'delivered': return <CheckCheck style={{ width: 12, height: 12, color: '#667781' }} />;
      default: return <Check style={{ width: 12, height: 12, color: '#667781' }} />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        marginTop,
      }}
    >
      <div
        style={{
          maxWidth: '72%',
          padding: '6px 8px 4px',
          borderRadius: isMe ? '8px 0px 8px 8px' : '0px 8px 8px 8px',
          background: isMe ? '#DCF8C6' : 'white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
          position: 'relative',
        }}
      >
        {/* Bubble tail — only on first in a group */}
        {!sameSenderAsPrev && (
          isMe ? (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: -7,
                width: 0,
                height: 0,
                borderLeft: '7px solid #DCF8C6',
                borderBottom: '7px solid transparent',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: -7,
                width: 0,
                height: 0,
                borderRight: '7px solid white',
                borderBottom: '7px solid transparent',
              }}
            />
          )
        )}
        {message.type === 'image' ? (
          <img src={message.content} alt="" style={{ borderRadius: '4px', maxWidth: '100%' }} />
        ) : (
          <p style={{ fontSize: '14.2px', color: '#111', margin: 0, lineHeight: 1.42 }}>
            {message.content}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px', marginTop: '2px' }}>
          <span style={{ fontSize: '11px', color: '#667781' }}>{formatTime(message.timestamp)}</span>
          {isMe && getStatusIcon(message.status)}
        </div>
      </div>
    </div>
  );
};

const VideoHeaderIcon = () => (
  <svg width="22" height="22" fill="white" opacity={0.9} viewBox="0 0 24 24">
    <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="22" height="22" fill="white" opacity={0.9} viewBox="0 0 24 24">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
  </svg>
);
