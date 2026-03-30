import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, type Platform } from '../stores/appStore';
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react';
import { DragDropPhoto } from './DragDropPhoto';

interface EditorProps {
  onUpgradeClick: () => void;
}

// Simple platform icons as colored SVG marks
const PlatformIcon: React.FC<{ platform: string; size?: number }> = ({ platform, size = 14 }) => {
  const colors: Record<string, string> = {
    whatsapp: '#25D366',
    instagram: '#E4405F',
    snapchat: '#FFFC00',
    messenger: '#0084FF',
    tiktok: '#FE2C55',
  };

  return (
    <span
      style={{
        width: size + 4,
        height: size + 4,
        borderRadius: '50%',
        background: colors[platform] || '#6B7280',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    />
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
    deleteMessage,
    clearMessages,
    messages,
    isPremium,
  } = useAppStore();

  const [messageText, setMessageText] = useState('');
  const [sender, setSender] = useState<'me' | 'contact'>('me');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
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
    addMessage({
      type: 'text',
      content: messageText,
      sender,
      status: sender === 'me' ? 'read' : undefined,
    });
    setMessageText('');
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
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '20px',
                  border: '1.5px solid',
                  borderColor: currentPlatform === p.id ? '#6366F1' : '#E5E7EB',
                  background: currentPlatform === p.id ? '#6366F1' : 'white',
                  color: currentPlatform === p.id ? 'white' : '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                <PlatformIcon platform={p.id} />
                {p.name}
              </button>
            ))}
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
                  <span
                    style={{
                      flex: 1,
                      fontSize: '13px',
                      color: '#374151',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {msg.content}
                  </span>
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

      {/* Premium section card */}
      {!isPremium && (
        <div
          style={{
            background: '#1E1B4B',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#A5B4FC',
              marginBottom: '14px',
            }}
          >
            UPGRADE TO PREMIUM
          </p>

          {/* Two pricing cards */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            {/* Weekly */}
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '12px',
                border: '1.5px solid rgba(255,255,255,0.12)',
                padding: '14px',
              }}
            >
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                $2.99
              </p>
              <p style={{ fontSize: '12px', color: '#A5B4FC', marginBottom: '10px' }}>per week</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['No watermark', 'MP4 export', 'Unlimited msgs'].map((f) => (
                  <li key={f} style={{ fontSize: '12px', color: '#C7D2FE', display: 'flex', gap: '5px' }}>
                    <span style={{ color: '#34D399' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lifetime */}
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '12px',
                border: '1.5px solid #F59E0B',
                padding: '14px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#F59E0B',
                  color: '#78350F',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  whiteSpace: 'nowrap',
                }}
              >
                BEST VALUE
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                $9.99
              </p>
              <p style={{ fontSize: '12px', color: '#A5B4FC', marginBottom: '10px' }}>lifetime</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['No watermark', 'MP4 export', 'Unlimited msgs'].map((f) => (
                  <li key={f} style={{ fontSize: '12px', color: '#C7D2FE', display: 'flex', gap: '5px' }}>
                    <span style={{ color: '#34D399' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={onUpgradeClick}
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            }}
          >
            Unlock Premium
          </button>
        </div>
      )}
    </div>
  );
};
