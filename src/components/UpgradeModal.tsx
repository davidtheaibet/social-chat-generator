import React, { useState } from 'react';
import { Crown, X, Loader2 } from 'lucide-react';

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
    } catch (err) {
      setError('Could not start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">Upgrade to Premium</h2>
        </div>

        <ul className="text-sm text-gray-600 space-y-2 mb-6">
          <li>✅ Remove watermark from exports</li>
          <li>✅ Unlimited messages</li>
          <li>✅ MP4 video export</li>
          <li>✅ All 5 platform renderers</li>
        </ul>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleUpgrade('weekly')}
            disabled={loading !== null}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading === 'weekly' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            $2.99 / week
          </button>
          <button
            onClick={() => handleUpgrade('lifetime')}
            disabled={loading !== null}
            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading === 'lifetime' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            $9.99 lifetime
          </button>
        </div>
      </div>
    </div>
  );
};
