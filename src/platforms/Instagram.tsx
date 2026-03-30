import { useAppStore } from '../stores/appStore';

interface InstagramPreviewProps {
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

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({ containerRef }) => {
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
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#262626">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <div style={{ position: 'relative' }}>
            {contact.photo ? (
              <img
                src={contact.photo}
                alt=""
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(white,white), linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                }}
              />
            ) : (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                {contact.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Active dot */}
            <div
              style={{
                position: 'absolute',
                bottom: 1,
                right: 1,
                width: 9,
                height: 9,
                background: '#22C55E',
                borderRadius: '50%',
                border: '1.5px solid white',
              }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#262626', lineHeight: 1.2 }}>
              {contact.name}
            </div>
            <div style={{ fontSize: '11px', color: '#8E8E8E', lineHeight: 1 }}>
              {contact.status || 'Active now'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <PhoneIcon />
          <VideoIcon />
          <InfoIcon />
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
          gap: '6px',
          background: 'white',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#F3F4F6',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {contact.photo ? (
                <img src={contact.photo} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '20px', color: '#6B7280' }}>{contact.name.charAt(0)}</span>
              )}
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#262626' }}>{contact.name}</p>
            <p style={{ fontSize: '12px', color: '#8E8E8E' }}>Instagram</p>
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
                  <img src={contact.photo} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>
                    {contact.name.charAt(0)}
                  </div>
                )
              )}
              <div
                style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: '22px',
                  background: message.sender === 'me' ? '#C13584' : '#EFEFEF',
                  color: message.sender === 'me' ? 'white' : '#262626',
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
          gap: '8px',
          borderTop: '1px solid #F3F4F6',
        }}
      >
        <span style={{ fontSize: '22px' }}>😊</span>
        <div
          style={{
            flex: 1,
            background: '#FAFAFA',
            borderRadius: '22px',
            padding: '7px 14px',
            border: '1px solid #E5E7EB',
          }}
        >
          <span style={{ fontSize: '13px', color: '#8E8E8E' }}>Message...</span>
        </div>
        <span style={{ color: '#3897F0', fontWeight: 600, fontSize: '13px' }}>Send</span>
      </div>
    </div>
  );
};

const PhoneIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#262626" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.89 9.11a19.79 19.79 0 01-3.07-8.67A2 2 0 012.81 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l.94-.94a2 2 0 012.12-.45 12.84 12.84 0 002.81.7A2 2 0 0122 17.2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VideoIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#262626" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#262626" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
    <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
  </svg>
);
