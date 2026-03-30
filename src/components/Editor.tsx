import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, type Platform } from '../stores/appStore';
import { Trash2, Plus, Crown, Pencil, Check, X } from 'lucide-react';
import { DragDropPhoto } from './DragDropPhoto';

export const Editor: React.FC = () => {
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

  const platforms: { id: Platform; name: string; color: string }[] = [
    { id: 'whatsapp', name: 'WhatsApp', color: '#25D366' },
    { id: 'instagram', name: 'Instagram', color: '#E4405F' },
    { id: 'snapchat', name: 'Snapchat', color: '#FFFC00' },
    { id: 'messenger', name: 'Messenger', color: '#0084FF' },
    { id: 'tiktok', name: 'TikTok', color: '#000000' },
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

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        🎨 Conversation Settings
      </h2>

      {/* Platform Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <div className="flex gap-2 flex-wrap">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setPlatform(platform.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentPlatform === platform.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: currentPlatform === platform.id ? platform.color : undefined,
              }}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Settings */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
          <input
            type="text"
            value={contact.name}
            onChange={(e) => setContact({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. John Smith"
          />
        </div>

        <DragDropPhoto
          currentPhoto={contact.photo}
          onPhotoChange={(photo) => setContact({ photo })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status (optional)
          </label>
          <input
            type="text"
            value={contact.status}
            onChange={(e) => setContact({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="online, typing..."
          />
        </div>
      </div>

      {/* Message Builder */}
      <div className="border-t pt-4 mb-4">
        <h3 className="font-semibold mb-3">Add Messages</h3>

        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sender"
              checked={sender === 'me'}
              onChange={() => setSender('me')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">To (You send)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sender"
              checked={sender === 'contact'}
              onChange={() => setSender('contact')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">From (They send)</span>
          </label>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
          />
          <button
            onClick={handleAddMessage}
            disabled={!isPremium && messages.length >= 20}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Message List with Edit/Delete */}
      {messages.length > 0 && (
        <div className="border rounded-lg divide-y mb-4 max-h-56 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-2 px-3 py-2 group hover:bg-gray-50">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  msg.sender === 'me' ? 'bg-blue-500' : 'bg-gray-400'
                }`}
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
                  className="flex-1 text-sm px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <span className="flex-1 text-sm text-gray-700 truncate">{msg.content}</span>
              )}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {editingId === msg.id ? (
                  <>
                    <button onClick={commitEdit} className="p-1 text-green-600 hover:text-green-700" title="Save">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={cancelEdit} className="p-1 text-gray-400 hover:text-gray-600" title="Cancel">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(msg.id, msg.content)}
                      className="p-1 text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(msg.id)}
                      className={`p-1 transition-colors ${
                        pendingDeleteId === msg.id
                          ? 'text-red-600 bg-red-50 rounded'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                      title={pendingDeleteId === msg.id ? 'Click again to confirm' : 'Delete'}
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

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={clearMessages}
          className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Premium Promo */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5" />
            <h3 className="font-bold">Premium Version</h3>
          </div>
          <p className="text-sm mb-2">Remove watermark + All platforms + Unlimited messages + MP4 export</p>
          <p className="font-bold">$2.99/week or $9.99 lifetime</p>
        </div>
      )}

      {/* Message Count */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        {messages.length} / {isPremium ? '∞' : '20'} messages
        {!isPremium && messages.length >= 20 && (
          <p className="text-red-500 mt-1">Message limit reached. Upgrade to Premium!</p>
        )}
      </div>
    </div>
  );
};
