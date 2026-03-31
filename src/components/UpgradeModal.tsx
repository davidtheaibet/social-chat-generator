import React, { useState } from 'react';
import { Crown, X, Loader2 } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
  const [selectedTier, setSelectedTier] = useState<'weekly' | 'lifetime'>('lifetime');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: selectedTier }),
      });
      if (!res.ok) throw new Error('Failed to create checkout session');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Could not start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: '380px',
          padding: '32px 28px 24px',
          position: 'relative',
        }}
      >
        {/* X close */}
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
            lineHeight: 0,
          }}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Crown style={{ width: 24, height: 24, color: '#F59E0B' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Unlock Premium
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
          Remove watermarks · Unlimited messages · MP4 export
        </p>

        {/* Pricing options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {/* Weekly option */}
          <button
            onClick={() => setSelectedTier('weekly')}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: `2px solid ${selectedTier === 'weekly' ? '#6366F1' : '#E5E7EB'}`,
              background: selectedTier === 'weekly' ? '#EEF2FF' : 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>$2.99 / week</span>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>Billed weekly</span>
          </button>

          {/* Lifetime option — featured */}
          <button
            onClick={() => setSelectedTier('lifetime')}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: `2px solid ${selectedTier === 'lifetime' ? '#F59E0B' : '#E5E7EB'}`,
              background: selectedTier === 'lifetime' ? '#FFFBEB' : 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>$9.99 lifetime</span>
            <span
              style={{
                background: '#F59E0B',
                color: '#78350F',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: '20px',
                letterSpacing: '0.04em',
              }}
            >
              BEST VALUE
            </span>
          </button>
        </div>

        {error && (
          <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        {/* Primary CTA */}
        <button
          onClick={handleContinue}
          disabled={loading}
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '12px',
            border: 'none',
            background: loading ? '#A5B4FC' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'inherit',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.45)',
            transition: 'opacity 0.15s',
            marginBottom: '12px',
          }}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Continue to Payment
        </button>

        {/* Secondary close */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '36px',
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Not now
        </button>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#D1D5DB', marginTop: '8px' }}>
          Secure checkout via Stripe · Instant access
        </p>
      </div>
    </div>
  );
};
