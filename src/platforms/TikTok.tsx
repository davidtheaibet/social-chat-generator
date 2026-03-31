import { useAppStore, type Message } from '../stores/appStore';

interface TikTokPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const StatusBar: React.FC = () => (
  <div
    style={{
      height: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      background: '#121212',
    }}
  >
    <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '-0.2px' }}>
      9:41
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <rect x="0" y="6.5" width="2.5" height="4.5" rx="0.5" fill="white" />
        <rect x="4" y="4.5" width="2.5" height="6.5" rx="0.5" fill="white" />
        <rect x="8" y="2.5" width="2.5" height="8.5" rx="0.5" fill="white" />
        <rect x="12" y="0" width="2.5" height="11" rx="0.5" fill="white" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <circle cx="7.5" cy="10" r="1.2" fill="white" />
        <path d="M4.5 7C5.5 6 6.5 5.5 7.5 5.5C8.5 5.5 9.5 6 10.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M2 4.5C3.8 2.7 5.5 1.8 7.5 1.8C9.5 1.8 11.2 2.7 13 4.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </svg>
      <svg width="23" height="11" viewBox="0 0 23 11" fill="none">
        <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" stroke="white" strokeWidth="1" />
        <rect x="20.5" y="3" width="2" height="5" rx="1" fill="white" />
        <rect x="2" y="2" width="14" height="7" rx="1.5" fill="white" />
      </svg>
    </div>
  </div>
);

export const TikTokPreview: React.FC<TikTokPreviewProps> = ({ containerRef }) => {
  const { contact, messages } = useAppStore();

  const formatTime = (message: Message) =>
    message.customTimestamp ||
    message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

  return (
    <div
      ref={containerRef}
      style={{
        width: '320px',
        height: '650px',
        background: '#121212',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StatusBar />

      {/* Chat header */}
      <div
        style={{
          background: '#1A1A1A',
          padding: '8px 12px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid #2A2A2A',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity={0.9}>
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        {contact.photo ? (
          <img src={contact.photo} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#2A2A2A',
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
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: 'white', lineHeight: 1.2 }}>
            {contact.name}
          </div>
          <div style={{ fontSize: '12px', color: '#888', lineHeight: 1 }}>
            {contact.status || 'TikTok'}
          </div>
        </div>
        {/* TikTok call icon */}
        <svg width="22" height="22" fill="white" opacity={0.8} viewBox="0 0 24 24">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
        </svg>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          background: '#121212',
        }}
      >
        <div style={{ flex: 1 }} />
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ fontSize: '13px', color: '#555' }}>No messages yet</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const sameSenderAsPrev = prevMsg?.sender === message.sender;
            const marginTop = index === 0 ? '0' : (sameSenderAsPrev ? '2px' : '8px');
            return (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '6px',
                marginTop,
              }}
            >
              {message.sender === 'contact' && (
                contact.photo ? (
                  <img src={contact.photo} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white', flexShrink: 0 }}>
                    {contact.name.charAt(0)}
                  </div>
                )
              )}
              <div
                style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  background: message.sender === 'me' ? '#FE2C55' : '#2A2A2A',
                  color: 'white',
                }}
              >
                {message.type === 'image' ? (
                  <img src={message.content} alt="" style={{ borderRadius: '8px', maxWidth: '100%' }} />
                ) : (
                  <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.4 }}>{message.content}</p>
                )}
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0', textAlign: 'right' }}>
                  {formatTime(message)}
                </p>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderTop: '1px solid #2A2A2A',
          background: '#1A1A1A',
        }}
      >
        {contact.photo ? (
          <img src={contact.photo} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', flexShrink: 0 }}>
            {contact.name.charAt(0)}
          </div>
        )}
        <div
          style={{
            flex: 1,
            background: '#2A2A2A',
            borderRadius: '20px',
            padding: '7px 14px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#555' }}>Message...</span>
        </div>
        <span style={{ fontSize: '18px' }}>😊</span>
      </div>
    </div>
  );
};
