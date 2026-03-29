import React, { useState } from 'react';
import { useAppStore, type Platform } from '../stores/appStore';
import { Trash2, Plus, Crown } from 'lucide-react';

export const Editor: React.FC = () => {
  const { 
    currentPlatform, 
    setPlatform, 
    contact, 
    setContact, 
    addMessage, 
    clearMessages,
    messages,
    isPremium,
  } = useAppStore();
  
  const [messageText, setMessageText] = useState('');
  const [sender, setSender] = useState<'me' | 'contact'>('me');
  const [, setContactPhoto] = useState<string>('');
  
  const platforms: { id: Platform; name: string; color: string }[] = [
    { id: 'whatsapp', name: 'WhatsApp', color: '#25D366' },
    { id: 'instagram', name: 'Instagram', color: '#E4405F' },
    { id: 'snapchat', name: 'Snapchat', color: '#FFFC00' },
    { id: 'messenger', name: 'Messenger', color: '#0084FF' },
    { id: 'tiktok', name: 'TikTok', color: '#000000' },
  ];
  
  const handleAddMessage = () => {
    if (!messageText.trim()) return;
    
    addMessage({
      type: 'text',
      content: messageText,
      sender,
      status: sender === 'me' ? 'read' : undefined,
    });
    
    setMessageText('');
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContactPhoto(reader.result as string);
        setContact({ photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        🎨 Conversation Settings
      </h2>
      
      {/* Platform Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform
        </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            value={contact.name}
            onChange={(e) => setContact({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. John Smith"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
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
      <div className="border-t pt-4 mb-6">
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
            <span className="text-sm">Sent</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sender"
              checked={sender === 'contact'}
              onChange={() => setSender('contact')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">Received</span>
          </label>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
          />
          <button
            onClick={handleAddMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
      
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
          <p className="text-sm mb-2">Remove watermark + All platforms + Unlimited messages</p>
          <p className="font-bold">$2.99/week</p>
        </div>
      )}
      
      {/* Message Count */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        {messages.length} / {isPremium ? '∞' : '20'} messages
        {!isPremium && messages.length >= 20 && (
          <p className="text-red-500">Message limit reached. Upgrade to Premium!</p>
        )}
      </div>
    </div>
  );
};
