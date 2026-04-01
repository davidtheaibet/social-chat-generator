import { create } from 'zustand';

export type MessageType = 'text' | 'image' | 'voice';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  sender: 'me' | 'contact';
  timestamp: Date;
  customTimestamp?: string; // User-set HH:MM or "HH:MM DD/MM"
  status?: 'sent' | 'delivered' | 'read';
}

export interface Contact {
  name: string;
  photo?: string;
  status: string;
  verified?: boolean;
}

export type Platform = 'whatsapp' | 'instagram' | 'snapchat' | 'messenger' | 'tiktok';

interface AppState {
  // Platform
  currentPlatform: Platform;
  setPlatform: (platform: Platform) => void;
  
  // Contact
  contact: Contact;
  setContact: (contact: Partial<Contact>) => void;
  
  // Messages
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  editMessage: (id: string, content: string) => void;
  setMessageTimestamp: (id: string, customTimestamp: string) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  
  // Premium
  isPremium: boolean;
  setPremium: (value: boolean) => void;
  
  // Export
  exportImage: () => Promise<string>;
}

export const useAppStore = create<AppState>((set) => ({
  currentPlatform: 'whatsapp',
  setPlatform: (platform) => set({ currentPlatform: platform }),
  
  contact: {
    name: 'John Doe',
    status: 'online',
  },
  setContact: (contact) => set((state) => ({ 
    contact: { ...state.contact, ...contact } 
  })),
  
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }],
  })),
  editMessage: (id, content) => set((state) => ({
    messages: state.messages.map((m) =>
      m.id === id ? { ...m, content } : m
    ),
  })),
  setMessageTimestamp: (id, customTimestamp) => set((state) => ({
    messages: state.messages.map((m) =>
      m.id === id ? { ...m, customTimestamp: customTimestamp.trim() || undefined } : m
    ),
  })),
  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter((m) => m.id !== id),
  })),
  clearMessages: () => set({ messages: [] }),
  
  isPremium: false,
  setPremium: (value) => set({ isPremium: value }),
  
  exportImage: async () => {
    // Implementation in utils
    return '';
  },
}));
