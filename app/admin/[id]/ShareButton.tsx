'use client';

import React, { useState } from 'react';

export default function ShareButton({ routeId }: { routeId: number }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Dynamically construct the full URL
    const url = `${window.location.origin}/client/${routeId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all border ${
        copied 
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-[0_0_15px_rgba(79,70,229,0.3)]'
      }`}
    >
      {copied ? '✓ Copied!' : 'Share Client Link'}
    </button>
  );
}
