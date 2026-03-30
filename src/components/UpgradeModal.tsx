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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'white' }}>
        {/* Header */}
        <div
          className="relative px-6 pt-6 pb-5 text-white"
          style={{ background: 'linear-gradient(145deg, #1e1b4b, #4c1d95)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 mb-1">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold">Upgrade to Premium</h2>
          </div>
          <p className="text-indigo-300 text-sm">Make every screenshot look completely real.</p>
        </div>

        {/* Features */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
            {[
              'No watermark on exports',
              'Unlimited messages',
              'MP4 video export',
              'All 5 platform styles',
            ].map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="p-5 space-y-3">
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-xl">{error}</p>
          )}

          {/* Weekly */}
          <button
            onClick={() => handleUpgrade('weekly')}
            disabled={loading !== null}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Weekly</p>
                <p className="text-xs text-gray-400">Cancel anytime</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {loading === 'weekly' && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
              <span className="text-lg font-bold text-gray-900">
                $2.99<span className="text-sm font-normal text-gray-400">/wk</span>
              </span>
            </div>
          </button>

          {/* Lifetime — featured */}
          <button
            onClick={() => handleUpgrade('lifetime')}
            disabled={loading !== null}
            className="w-full relative flex items-center justify-between px-5 py-4 rounded-2xl text-white transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
            }}
          >
            <span
              className="absolute top-2.5 right-[4.5rem] text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              BEST VALUE
            </span>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Infinity className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">Lifetime</p>
                <p className="text-xs text-white/70">Pay once, yours forever</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {loading === 'lifetime' && <Loader2 className="w-4 h-4 animate-spin text-white/70" />}
              <span className="text-lg font-bold">$9.99</span>
            </div>
          </button>

          <p className="text-center text-xs text-gray-400 pt-1">
            Secure checkout via Stripe · Instant access
          </p>
        </div>
      </div>
    </div>
  );
};
