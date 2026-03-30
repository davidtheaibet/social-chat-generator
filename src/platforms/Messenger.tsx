import { useAppStore } from '../stores/appStore';

interface MessengerPreviewProps {
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
      background: 'white',
    }}
  >
    <span style={{ fontSize: '11px', fontWeight: 700, color: '#111', letterSpacing: '-0.2px' }}>
      9:41
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <rect x="0" y="6.5" width="2.5" height="4.5" rx="0.5" fill="#111" />
        <rect x="4" y="4.5" width="2.5" height="6.5" rx="0.5" fill="#111" />
        <rect x="8" y="2.5" width="2.5" height="8.5" rx="0.5" fill="#111" />
        <rect x="12" y="0" width="2.5" height="11" rx="0.5" fill="#111" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <circle cx="7.5" cy="10" r="1.2" fill="#111" />
        <path d="M4.5 7C5.5 6 6.5 5.5 7.5 5.5C8.5 5.5 9.5 6 10.5 7" stroke="#111" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M2 4.5C3.8 2.7 5.5 1.8 7.5 1.8C9.5 1.8 11.2 2.7 13 4.5" stroke="#111" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </svg>
      <svg width="23" height="11" viewBox="0 0 23 11" fill="none">
        <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" stroke="#111" strokeWidth="1" />
        <rect x="20.5" y="3" width="2" height="5" rx="1" fill="#111" />
        <rect x="2" y="2" width="14" height="7" rx="1.5" fill="#111" />
      </svg>
    </div>
  </div>
);

export const MessengerPreview: React.FC<MessengerPreviewProps> = ({ containerRef }) => {
  const { contact, messages } = useAppStore();

  return (
    <div
      ref={containerRef}
      style={{
        width: '280px',
        height: '580px',
        background: 'white',
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
          background: 'white',
          padding: '8px 12px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0084FF">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {contact.photo ? (
            <img src={contact.photo} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#E4E6EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#606770',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#050505', lineHeight: 1.2 }}>
              {contact.name}
            </div>
            <div style={{ fontSize: '11px', color: '#65676B', lineHeight: 1 }}>
              {contact.status || 'Active now'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '14px' }}>
          <svg width="18" height="18" fill="#0084FF" viewBox="0 0 24 24">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
          </svg>
          <svg width="18" height="18" fill="#0084FF" viewBox="0 0 24 24">
            <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ fontSize: '13px', color: '#65676B' }}>No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '6px',
              }}
            >
              {message.sender === 'contact' && (
                contact.photo ? (
                  <img src={contact.photo} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E4E6EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', flexShrink: 0 }}>
                    {contact.name.charAt(0)}
                  </div>
                )
              )}
              <div
                style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: message.sender === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: message.sender === 'me' ? '#0084FF' : '#F0F0F0',
                  color: message.sender === 'me' ? 'white' : '#050505',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                }}
              >
                {message.type === 'image' ? (
                  <img src={message.content} alt="" style={{ borderRadius: '8px', maxWidth: '100%' }} />
                ) : (
                  <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.4 }}>{message.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderTop: '1px solid #F0F2F5',
        }}
      >
        <span style={{ fontSize: '20px' }}>➕</span>
        <span style={{ fontSize: '20px' }}>📷</span>
        <div
          style={{
            flex: 1,
            background: '#F0F2F5',
            borderRadius: '20px',
            padding: '7px 14px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#65676B' }}>Aa</span>
        </div>
        <span style={{ fontSize: '20px' }}>👍</span>
      </div>
    </div>
  );
};
