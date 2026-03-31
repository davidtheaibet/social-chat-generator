import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, type Platform } from '../stores/appStore';
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react';
import { DragDropPhoto } from './DragDropPhoto';

interface EditorProps {
  onUpgradeClick: () => void;
}

const PLATFORM_ICONS: Record<string, { color: string; activeBg: string; lightBg?: boolean; path: string }> = {
  whatsapp: {
    color: '#25D366',
    activeBg: '#25D366',
    path: 'M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.136.301-.355.45-.53.149-.175.199-.3.299-.5.1-.201.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z',
  },
  instagram: {
    color: '#E4405F',
    activeBg: 'linear-gradient(135deg, #833AB4, #FD1D1D, #FCAF45)',
    path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12c0 3.259.014 3.668.072 4.948.058 1.277.26 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.058 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.645-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
  },
  snapchat: {
    color: '#FFFC00',
    activeBg: '#FFFC00',
    lightBg: true,
    path: 'M12.166 3C8.021 3 5.386 5.86 5.386 9.712v.617c0 .139-.027.265-.05.386-.02.103-.038.2-.038.313-.028.32-.203.588-.463.728.012.039.012.075.012.112 0 .28-.175.525-.426.632-.147.065-.315.085-.49.062-.35-.05-.715-.105-1.062-.105-.19 0-.39.029-.577.086-.182.054-.365.184-.39.258.007.02.015.037.022.056.13.38.35.782.68 1.063.282.243.64.41.962.537.12.047.233.087.337.126.448.165.763.408.763.807 0 .033-.006.071-.013.11l-.01.065c-.07.405-.358.584-.682.726-.28.124-.594.24-.857.422-.205.14-.307.3-.307.472 0 .127.049.252.152.378.194.237.586.437 1.082.545.28.062.487.166.582.333.063.112.07.25.017.42-.102.32-.312.65-.519.957l-.076.114c-.237.358-.36.725-.365 1.1.005.548.318.95.795 1.05.256.056.544.013.885-.132.388-.164.798-.356 1.307-.356.15 0 .305.016.463.048.606.12 1.183.502 1.792.502.64 0 1.166-.417 1.784-.667.516-.207.992-.31 1.452-.31.49 0 .997.117 1.545.34.594.24 1.147.637 1.771.637.609 0 1.186-.382 1.792-.502.158-.032.313-.048.463-.048.509 0 .92.192 1.307.356.341.145.629.188.885.132.477-.1.79-.502.795-1.05-.005-.375-.128-.742-.365-1.1l-.076-.114c-.207-.307-.417-.637-.519-.957-.053-.17-.046-.308.017-.42.095-.167.302-.271.582-.333.496-.108.888-.308 1.082-.545.103-.126.152-.251.152-.378 0-.172-.102-.332-.307-.472-.263-.182-.577-.298-.857-.422-.324-.142-.612-.321-.682-.726l-.01-.065c-.007-.039-.013-.077-.013-.11 0-.399.315-.642.763-.807.104-.039.217-.079.337-.126.322-.127.68-.294.962-.537.33-.281.55-.683.68-1.063.007-.019.015-.036.022-.056-.025-.074-.208-.204-.39-.258-.187-.057-.387-.086-.577-.086-.347 0-.712.055-1.062.105-.175.023-.343.003-.49-.062-.251-.107-.426-.352-.426-.632 0-.037 0-.073.012-.112-.26-.14-.435-.408-.463-.728-.038-.113-.056-.21-.076-.313-.023-.12-.05-.247-.05-.386V9.712C18.614 5.86 16.311 3 12.166 3z',
  },
  messenger: {
    color: '#0084FF',
    activeBg: '#0084FF',
    path: 'M12 2C6.477 2 2 6.145 2 11.243c0 2.951 1.426 5.586 3.665 7.317V21.5l3.363-1.846a10.655 10.655 0 0 0 2.972.415c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.006 12.435l-2.543-2.71-4.965 2.71 5.465-5.804 2.605 2.71 4.903-2.71-5.465 5.804z',
  },
  tiktok: {
    color: '#010101',
    activeBg: '#010101',
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
};

const PlatformIcon: React.FC<{ platform: string; active: boolean }> = ({ platform, active }) => {
  const cfg = PLATFORM_ICONS[platform];
  if (!cfg) return null;
  const iconFill = active ? (cfg.lightBg ? '#111' : 'white') : cfg.color;
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={iconFill} style={{ flexShrink: 0 }}>
      <path d={cfg.path} />
    </svg>
  );
};

export const Editor: React.FC<EditorProps> = ({ onUpgradeClick }) => {
  const {
    currentPlatform,
    setPlatform,
    contact,
    setContact,
    addMessage,
    editMessage,
    setMessageTimestamp,
    deleteMessage,
    clearMessages,
    messages,
    isPremium,
  } = useAppStore();

  const [messageText, setMessageText] = useState('');
  const [sender, setSender] = useState<'me' | 'contact'>('me');
  const [customTime, setCustomTime] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingTimestampId, setEditingTimestampId] = useState<string | null>(null);
  const [editingTimestampValue, setEditingTimestampValue] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const platforms: { id: Platform; name: string }[] = [
    { id: 'whatsapp', name: 'WhatsApp' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'snapchat', name: 'Snapchat' },
    { id: 'messenger', name: 'Messenger' },
    { id: 'tiktok', name: 'TikTok' },
  ];

  const handleAddMessage = () => {
    if (!messageText.trim()) return;
    if (!isPremium && messages.length >= 20) return;
    const customTimestamp = customTime.trim()
      ? customDate.trim()
        ? `${customTime.trim()} ${customDate.trim()}`
        : customTime.trim()
      : undefined;
    addMessage({
      type: 'text',
      content: messageText,
      sender,
      customTimestamp,
      status: sender === 'me' ? 'read' : undefined,
    });
    setMessageText('');
    setCustomTime('');
    setCustomDate('');
  };

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditingText(content);
    setPendingDeleteId(null);
  };

  const commitEdit = () => {
    if (editingId && editingText.trim()) {
      editMessage(editingId, editingText.trim());
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleDeleteClick = (id: string) => {
    if (pendingDeleteId === id) {
      deleteMessage(id);
      setPendingDeleteId(null);
    } else {
      setPendingDeleteId(id);
    }
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '24px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Main editor card */}
      <div style={cardStyle}>
        {/* Platform selector */}
        <div style={{ marginBottom: '20px' }}>
          <span className="section-label">PLATFORM</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {platforms.map((p) => {
              const isActive = currentPlatform === p.id;
              const cfg = PLATFORM_ICONS[p.id];
              return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '36px',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: '1.5px solid',
                  borderColor: isActive ? (cfg?.color || '#6366F1') : '#E5E7EB',
                  background: isActive ? (cfg?.activeBg || '#6366F1') : 'white',
                  color: isActive ? (cfg?.lightBg ? '#111' : 'white') : '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                <PlatformIcon platform={p.id} active={isActive} />
                {p.name}
              </button>
              );
            })}
          </div>
        </div>

        {/* Contact name */}
        <div style={{ marginBottom: '20px' }}>
          <span className="section-label">CONTACT NAME</span>
          <input
            className="input-field"
            type="text"
            value={contact.name}
            onChange={(e) => setContact({ name: e.target.value })}
            placeholder="e.g. John Smith"
          />
        </div>

        {/* Contact photo */}
        <div style={{ marginBottom: '20px' }}>
          <DragDropPhoto
            currentPhoto={contact.photo}
            onPhotoChange={(photo) => setContact({ photo })}
          />
        </div>

        {/* Status */}
        <div style={{ marginBottom: '20px' }}>
          <span className="section-label">STATUS</span>
          <input
            className="input-field"
            type="text"
            value={contact.status}
            onChange={(e) => setContact({ status: e.target.value })}
            placeholder="online, typing..."
          />
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #F3F4F6', marginBottom: '20px' }} />

        {/* Message builder */}
        <div style={{ marginBottom: '16px' }}>
          <span className="section-label">ADD MESSAGE</span>

          {/* Sender toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {(['contact', 'me'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSender(s)}
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: '8px',
                  border: '1.5px solid',
                  borderColor: sender === s ? '#6366F1' : '#E5E7EB',
                  background: sender === s ? '#EEF2FF' : 'white',
                  color: sender === s ? '#6366F1' : '#6B7280',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {s === 'me' ? 'You send' : 'They send'}
              </button>
            ))}
          </div>

          {/* Timestamp inputs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              className="input-field"
              style={{ flex: 1 }}
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="Time (HH:MM)"
              maxLength={5}
            />
            <input
              className="input-field"
              style={{ flex: 1 }}
              type="text"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              placeholder="Date (DD/MM) optional"
              maxLength={5}
            />
          </div>

          {/* Message input + add button */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="input-field"
              style={{ flex: 1 }}
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
              placeholder="Type your message..."
            />
            <button
              onClick={handleAddMessage}
              disabled={!isPremium && messages.length >= 20}
              style={{
                height: '40px',
                padding: '0 16px',
                borderRadius: '8px',
                border: 'none',
                background: (!isPremium && messages.length >= 20) ? '#E5E7EB' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: (!isPremium && messages.length >= 20) ? '#9CA3AF' : 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: (!isPremium && messages.length >= 20) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
                fontFamily: 'inherit',
                transition: 'opacity 0.15s',
              }}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Message list */}
        {messages.length > 0 && (
          <div
            style={{
              border: '1.5px solid #E5E7EB',
              borderRadius: '10px',
              overflow: 'hidden',
              maxHeight: '220px',
              overflowY: 'auto',
              marginBottom: '12px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="group"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderBottom: '1px solid #F9FAFB',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                {/* Mini bubble indicator */}
                <div
                  style={{
                    width: '28px',
                    height: '18px',
                    borderRadius: msg.sender === 'me' ? '8px 8px 2px 8px' : '8px 8px 8px 2px',
                    background: msg.sender === 'me' ? '#6366F1' : '#E5E7EB',
                    flexShrink: 0,
                  }}
                />
                {editingId === msg.id ? (
                  <input
                    ref={editInputRef}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    onBlur={commitEdit}
                    style={{
                      flex: 1,
                      fontSize: '13px',
                      padding: '2px 8px',
                      border: '1.5px solid #6366F1',
                      borderRadius: '6px',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                ) : (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#374151',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                      }}
                    >
                      {msg.content}
                    </span>
                    {editingTimestampId === msg.id ? (
                      <input
                        autoFocus
                        value={editingTimestampValue}
                        onChange={(e) => setEditingTimestampValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setMessageTimestamp(msg.id, editingTimestampValue);
                            setEditingTimestampId(null);
                          }
                          if (e.key === 'Escape') setEditingTimestampId(null);
                        }}
                        onBlur={() => {
                          setMessageTimestamp(msg.id, editingTimestampValue);
                          setEditingTimestampId(null);
                        }}
                        placeholder="HH:MM or HH:MM DD/MM"
                        style={{
                          fontSize: '11px',
                          padding: '1px 6px',
                          border: '1px solid #6366F1',
                          borderRadius: '4px',
                          outline: 'none',
                          fontFamily: 'inherit',
                          width: '100%',
                          marginTop: '2px',
                        }}
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setEditingTimestampId(msg.id);
                          setEditingTimestampValue(msg.customTimestamp || '');
                        }}
                        style={{
                          fontSize: '11px',
                          color: msg.customTimestamp ? '#6366F1' : '#9CA3AF',
                          cursor: 'pointer',
                          display: 'block',
                        }}
                        title="Click to set timestamp"
                      >
                        {msg.customTimestamp || 'set time...'}
                      </span>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  {editingId === msg.id ? (
                    <>
                      <button onClick={commitEdit} style={{ padding: '2px', color: '#10B981' }}>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={cancelEdit} style={{ padding: '2px', color: '#9CA3AF' }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(msg.id, msg.content)}
                        style={{ padding: '2px', color: '#6366F1' }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(msg.id)}
                        style={{
                          padding: '2px',
                          color: pendingDeleteId === msg.id ? '#EF4444' : '#9CA3AF',
                          background: pendingDeleteId === msg.id ? '#FEF2F2' : 'transparent',
                          borderRadius: '4px',
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear all + message count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={clearMessages}
            disabled={messages.length === 0}
            style={{
              height: '36px',
              padding: '0 14px',
              borderRadius: '8px',
              border: '1.5px solid #FCA5A5',
              background: 'white',
              color: '#EF4444',
              fontSize: '13px',
              fontWeight: 500,
              cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
              opacity: messages.length === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'inherit',
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
            {messages.length} / {isPremium ? '∞' : '20'}
            {!isPremium && messages.length >= 20 && (
              <span style={{ color: '#EF4444', marginLeft: '4px' }}>Limit reached</span>
            )}
          </span>
        </div>
      </div>

    </div>
  );
};
