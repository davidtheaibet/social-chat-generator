import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, type Platform } from '../stores/appStore';
import { Trash2, Plus, Crown, Pencil, Check, X, Zap, Infinity } from 'lucide-react';
import { DragDropPhoto } from './DragDropPhoto';

// Platform brand icons as inline SVGs
const PlatformIcon: React.FC<{ id: Platform; size?: number }> = ({ id, size = 18 }) => {
  switch (id) {
    case 'whatsapp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.948-1.42A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm5.07 13.97c-.22.617-1.293 1.183-1.77 1.215-.478.033-.49.358-3.09-.77-2.6-1.127-4.19-3.82-4.313-3.997-.12-.176-.99-1.35-.946-2.55.044-1.2.663-1.77.895-2.003.234-.233.508-.29.677-.29.17 0 .34.002.487.01.157.007.367-.06.574.438.207.497.703 1.713.765 1.838.062.125.1.27.018.434-.082.165-.123.267-.243.41-.12.143-.253.32-.36.43-.12.12-.243.25-.105.49.138.24.614.98 1.318 1.59.906.79 1.67 1.034 1.91 1.15.24.115.38.096.52-.058.14-.155.598-.697.758-.936.16-.238.32-.197.54-.118.22.08 1.4.66 1.638.78.24.12.4.178.46.277.06.098.06.568-.16 1.186z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      );
    case 'snapchat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.166.09C9.292.09 6.93 1.255 5.465 3.26c-.99 1.363-1.21 2.753-1.21 4.46v.58c-.48.22-1.18.335-1.875.335-.465 0-.912-.06-1.275-.18l-.09-.03c-.12-.03-.24-.045-.345-.045-.435 0-.69.24-.69.63 0 .525.39.93 1.11 1.17.09.03.225.075.375.12.525.165 1.32.42 1.575.93.09.18.09.39 0 .6-.015.03-.03.075-.045.105-.3.69-.87 1.845-2.19 2.82-.42.3-.645.66-.645 1.035 0 .585.495 1.065 1.275 1.275.315.09.645.135.975.135.135 0 .285-.015.405-.03.3-.03.615-.075.93-.075.225 0 .45.015.675.075.42.09.87.39 1.26.765.765.735 1.77 1.815 3.57 2.52.33.12.69.225 1.065.3.135.03.27.045.39.045.255 0 .495-.06.705-.18.21.12.45.18.705.18.12 0 .255-.015.39-.045.375-.075.735-.18 1.065-.3 1.8-.705 2.805-1.785 3.57-2.52.39-.375.84-.675 1.26-.765.225-.06.45-.075.675-.075.315 0 .63.045.93.075.12.015.27.03.405.03.33 0 .66-.045.975-.135.78-.21 1.275-.69 1.275-1.275 0-.375-.225-.735-.645-1.035-1.32-.975-1.89-2.13-2.19-2.82-.015-.03-.03-.075-.045-.105-.09-.21-.09-.42 0-.6.255-.51 1.05-.765 1.575-.93.15-.045.285-.09.375-.12.72-.24 1.11-.645 1.11-1.17 0-.39-.255-.63-.69-.63-.105 0-.225.015-.345.045l-.09.03c-.363.12-.81.18-1.275.18-.695 0-1.395-.115-1.875-.335v-.58c0-1.707-.22-3.097-1.21-4.46C17.07 1.255 14.708.09 11.834.09h.332z"/>
        </svg>
      );
    case 'messenger':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.131 3.26L19.752 8.1l-6.561 6.863z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
        </svg>
      );
  }
};

interface EditorProps {
  onUpgradeClick: () => void;
}

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

  const platforms: { id: Platform; name: string; color: string; bg: string }[] = [
    { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', bg: '#f0fdf4' },
    { id: 'instagram', name: 'Instagram', color: '#E4405F', bg: '#fff1f2' },
    { id: 'snapchat', name: 'Snapchat', color: '#b8970a', bg: '#fefce8' },
    { id: 'messenger', name: 'Messenger', color: '#0084FF', bg: '#eff6ff' },
    { id: 'tiktok', name: 'TikTok', color: '#111827', bg: '#f9fafb' },
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
    borderRadius: 20,
    border: '1px solid rgba(0,0,0,0.07)',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
    padding: '20px',
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition-all';

  const sectionLabel = 'block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3';

  return (
    <div className="w-full max-w-[480px] space-y-4">

      {/* ── Platform Selector ── */}
      <div style={cardStyle}>
        <p className={sectionLabel}>Platform</p>
        <div className="grid grid-cols-5 gap-2">
          {platforms.map((p) => {
            const active = currentPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                title={p.name}
                className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all"
                style={{
                  background: active ? p.bg : 'transparent',
                  color: active ? p.color : '#d1d5db',
                  border: `2px solid ${active ? p.color + '40' : 'transparent'}`,
                  boxShadow: active ? `0 0 0 3px ${p.color}18` : undefined,
                }}
              >
                <PlatformIcon id={p.id} size={22} />
                <span className="text-[10px] font-semibold truncate w-full text-center leading-none" style={{ color: active ? p.color : '#9ca3af' }}>
                  {p.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Contact Settings ── */}
      <div style={cardStyle} className="space-y-3.5">
        <p className={sectionLabel}>Contact</p>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Name</label>
          <input
            type="text"
            value={contact.name}
            onChange={(e) => setContact({ name: e.target.value })}
            className={inputClass}
            placeholder="e.g. Sarah Johnson"
          />
        </div>
        <DragDropPhoto
          currentPhoto={contact.photo}
          onPhotoChange={(photo) => setContact({ photo })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
          <input
            type="text"
            value={contact.status}
            onChange={(e) => setContact({ status: e.target.value })}
            className={inputClass}
            placeholder="online, typing..."
          />
        </div>
      </div>

      {/* ── Message Builder ── */}
      <div style={cardStyle}>
        <p className={sectionLabel}>Messages</p>

        {/* Sender toggle pill */}
        <div className="flex gap-1.5 mb-3.5 p-1 bg-gray-100 rounded-2xl">
          {(['me', 'contact'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSender(s)}
              className="flex-1 py-2 text-sm font-semibold rounded-xl transition-all"
              style={{
                background: sender === s ? 'white' : 'transparent',
                color: sender === s ? '#6366f1' : '#9ca3af',
                boxShadow: sender === s ? '0 1px 4px rgba(0,0,0,0.1)' : undefined,
              }}
            >
              {s === 'me' ? 'You send' : 'They send'}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
            className={`${inputClass} flex-1`}
            placeholder="Type a message..."
            disabled={!isPremium && messages.length >= 20}
          />
          <button
            onClick={handleAddMessage}
            disabled={!isPremium && messages.length >= 20}
            className="flex-shrink-0 flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Counter / limit notice */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {messages.length} / {isPremium ? '∞' : '20'}
          </span>
          {!isPremium && messages.length >= 20 && (
            <button onClick={onUpgradeClick} className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Upgrade for unlimited →
            </button>
          )}
        </div>

        {/* Chat bubble preview list */}
        {messages.length > 0 && (
          <div className="mt-3 space-y-1.5 max-h-60 overflow-y-auto">
            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} className={`flex items-end gap-1.5 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
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
                      className="flex-1 text-sm px-3 py-2 rounded-xl border-2 border-indigo-400 bg-indigo-50 focus:outline-none"
                    />
                  ) : (
                    <div
                      className="max-w-[72%] px-3 py-2 text-sm leading-snug rounded-2xl"
                      style={{
                        background: isMe ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f3f4f6',
                        color: isMe ? 'white' : '#1f2937',
                        borderBottomRightRadius: isMe ? 4 : 16,
                        borderBottomLeftRadius: isMe ? 16 : 4,
                      }}
                    >
                      {msg.content}
                    </div>
                  )}

                  {/* Edit/Delete controls */}
                  {editingId !== msg.id ? (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => startEdit(msg.id, msg.content)}
                        className="p-1 text-gray-300 hover:text-indigo-500 rounded-lg hover:bg-indigo-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(msg.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          pendingDeleteId === msg.id
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title={pendingDeleteId === msg.id ? 'Confirm delete' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button onClick={commitEdit} className="p-1 text-green-500 hover:text-green-600 rounded-lg hover:bg-green-50">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={cancelEdit} className="p-1 text-gray-300 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* ── Premium Paywall ── */}
      {!isPremium && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)',
            boxShadow: '0 6px 30px rgba(99,102,241,0.35)',
          }}
        >
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold text-[15px]">Unlock Premium</span>
            </div>
            <p className="text-indigo-300 text-sm leading-snug">Make your screenshots look totally real.</p>
          </div>

          {/* Two pricing cards */}
          <div className="grid grid-cols-2 gap-2.5 px-4 pb-3">
            {/* Weekly */}
            <button
              onClick={onUpgradeClick}
              className="flex flex-col items-center gap-1.5 bg-white/10 hover:bg-white/[0.16] border border-white/20 rounded-2xl p-4 transition-all active:scale-95 group"
            >
              <Zap className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-white font-extrabold text-xl leading-none">$2.99</span>
              <span className="text-indigo-300 text-xs font-medium">per week</span>
            </button>

            {/* Lifetime */}
            <button
              onClick={onUpgradeClick}
              className="relative flex flex-col items-center gap-1.5 rounded-2xl p-4 transition-all active:scale-95 group overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
            >
              <span
                className="absolute top-2 right-2 text-[9px] font-bold text-white/90 px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                BEST
              </span>
              <Infinity className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-white font-extrabold text-xl leading-none">$9.99</span>
              <span className="text-white/80 text-xs font-medium">one-time</span>
            </button>
          </div>

          {/* Feature list */}
          <div className="px-5 pb-5 grid grid-cols-2 gap-y-2 gap-x-3">
            {['No watermark', 'Unlimited messages', 'MP4 video export', 'All 5 platforms'].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-indigo-200 text-xs">
                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
