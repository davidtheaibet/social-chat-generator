import React, { useState } from 'react';
import { Crown, X, Loader2, Check, Zap, Infinity } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState<'weekly' | 'lifetime' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async (tier: 'weekly' | 'lifetime') => {
    setLoading(tier);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: tier }),
      });
      if (!res.ok) throw new Error('Failed to create checkout session');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Could not start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '360px',
          padding: '28px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9CA3AF',
            padding: '4px',
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Crown style={{ width: 22, height: 22, color: '#F59E0B' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Upgrade to Premium
          </h2>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Remove watermark from exports', 'Unlimited messages', 'MP4 video export', 'All 5 platform renderers'].map((f) => (
            <li key={f} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', color: '#374151' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> {f}
            </li>
          ))}
        </ul>

        {error && (
          <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => handleUpgrade('weekly')}
            disabled={loading !== null}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading !== null ? 'not-allowed' : 'pointer',
              opacity: loading !== null ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            }}
          >
            {loading === 'weekly' && <Loader2 className="w-4 h-4 animate-spin" />}
            $2.99 / week
          </button>

          {/* Lifetime — featured */}
          <button
            onClick={() => handleUpgrade('lifetime')}
            disabled={loading !== null}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '12px',
              border: '1.5px solid #F59E0B',
              background: '#1E1B4B',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading !== null ? 'not-allowed' : 'pointer',
              opacity: loading !== null ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: 'inherit',
            }}
          >
            {loading === 'lifetime' && <Loader2 className="w-4 h-4 animate-spin" />}
            $9.99 lifetime — Best Value
          </button>

          <p className="text-center text-xs text-gray-400 pt-1">
            Secure checkout via Stripe · Instant access
          </p>
        </div>
      </div>
    </div>
  );
};
