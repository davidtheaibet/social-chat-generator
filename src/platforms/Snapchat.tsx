import { useAppStore } from '../stores/appStore';

interface SnapchatPreviewProps {
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
      background: '#FFFC00',
    }}
  >
    <span style={{ fontSize: '11px', fontWeight: 700, color: '#000', letterSpacing: '-0.2px' }}>
      9:41
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <rect x="0" y="6.5" width="2.5" height="4.5" rx="0.5" fill="#000" />
        <rect x="4" y="4.5" width="2.5" height="6.5" rx="0.5" fill="#000" />
        <rect x="8" y="2.5" width="2.5" height="8.5" rx="0.5" fill="#000" />
        <rect x="12" y="0" width="2.5" height="11" rx="0.5" fill="#000" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <circle cx="7.5" cy="10" r="1.2" fill="#000" />
        <path d="M4.5 7C5.5 6 6.5 5.5 7.5 5.5C8.5 5.5 9.5 6 10.5 7" stroke="#000" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M2 4.5C3.8 2.7 5.5 1.8 7.5 1.8C9.5 1.8 11.2 2.7 13 4.5" stroke="#000" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </svg>
      <svg width="23" height="11" viewBox="0 0 23 11" fill="none">
        <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" stroke="#000" strokeWidth="1" />
        <rect x="20.5" y="3" width="2" height="5" rx="1" fill="#000" />
        <rect x="2" y="2" width="14" height="7" rx="1.5" fill="#000" />
      </svg>
    </div>
  </div>
);

export const SnapchatPreview: React.FC<SnapchatPreviewProps> = ({ containerRef }) => {
  const { contact, messages } = useAppStore();

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

  return (
    <div
      ref={containerRef}
      style={{
        width: '320px',
        height: '650px',
        background: '#FFFC00',
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
          background: '#FFFC00',
          padding: '8px 12px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {contact.photo ? (
            <img src={contact.photo} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }} />
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '15px',
                color: '#333',
                border: '2px solid rgba(0,0,0,0.1)',
              }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#000', lineHeight: 1.2 }}>
              {contact.name}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', lineHeight: 1 }}>
              🔥 12 · {contact.status || 'Snapchat'}
            </div>
          </div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
          <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.89 9.11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 2h3a2 2 0 0 1 2 1.72" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ fontSize: '13px', color: '#8E8E8E' }}>No messages yet</p>
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
                  <img src={contact.photo} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                    {contact.name.charAt(0)}
                  </div>
                )
              )}
              <div
                style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: message.sender === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: message.sender === 'me' ? '#FFFC00' : '#E5E5EA',
                  color: '#000',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                }}
              >
                {message.type === 'image' ? (
                  <img src={message.content} alt="" style={{ borderRadius: '8px', maxWidth: '100%' }} />
                ) : (
                  <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.4 }}>{message.content}</p>
                )}
                <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', margin: '2px 0 0', textAlign: 'right' }}>
                  {formatTime(message.timestamp)}
                  {message.sender === 'me' && ' ✓'}
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
          background: 'white',
          borderTop: '1px solid #F3F4F6',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            background: '#FFFC00',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" fill="#333" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </div>
        <div
          style={{
            flex: 1,
            background: '#F5F5F5',
            borderRadius: '20px',
            padding: '7px 14px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#8E8E8E' }}>Send a chat</span>
        </div>
        <span style={{ fontSize: '20px' }}>😊</span>
      </div>
    </div>
  );
};
