import React, { useState, useRef } from 'react';
import { Video, Loader2, Crown } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import html2canvas from 'html2canvas';

interface VideoExportProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onUpgradeClick: () => void;
}

export const VideoExport: React.FC<VideoExportProps> = ({ previewRef, onUpgradeClick }) => {
  const { isPremium, messages } = useAppStore();
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelRef = useRef(false);

  const exportVideo = async () => {
    if (!previewRef.current || messages.length === 0) return;

    setExporting(true);
    cancelRef.current = false;
    setProgress(0);

    try {
      const el = previewRef.current;
      const width = el.offsetWidth * 2;
      const height = el.offsetHeight * 2;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      // Set up MediaRecorder
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
        videoBitsPerSecond: 4_000_000,
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      await new Promise<void>((resolve, reject) => {
        recorder.onstop = () => resolve();
        recorder.onerror = () => reject(new Error('MediaRecorder error'));
        recorder.start();

        (async () => {
          // Hold count: frames per message + intro/outro
          const FPS = 30;
          const HOLD_MS = 600;   // how long each message is held
          const APPEAR_MS = 200; // fade-in duration

          const totalMessages = messages.length;

          const renderFrame = async (visibleCount: number, alpha: number) => {
            // Temporarily show only visibleCount messages
            const allBubbles = el.querySelectorAll<HTMLElement>('[data-msg-bubble]');
            allBubbles.forEach((b, i) => {
              if (i < visibleCount - 1) {
                b.style.opacity = '1';
              } else if (i === visibleCount - 1) {
                b.style.opacity = String(alpha);
              } else {
                b.style.opacity = '0';
              }
            });

            const snap = await html2canvas(el, {
              useCORS: true,
              scale: 2,
              backgroundColor: null,
              logging: false,
            });

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(snap, 0, 0, width, height);
          };

          // Intro: show first frame (all hidden) for 500ms
          await renderFrame(0, 0);
          await sleep(500);

          for (let i = 0; i < totalMessages; i++) {
            if (cancelRef.current) break;

            // Fade in
            const frames = Math.round((APPEAR_MS / 1000) * FPS);
            for (let f = 0; f <= frames; f++) {
              if (cancelRef.current) break;
              await renderFrame(i + 1, f / frames);
              await sleep(1000 / FPS);
            }

            // Hold
            await sleep(HOLD_MS);

            setProgress(Math.round(((i + 1) / totalMessages) * 90));
          }

          // Outro hold
          await sleep(800);

          // Restore visibility
          const allBubbles = el.querySelectorAll<HTMLElement>('[data-msg-bubble]');
          allBubbles.forEach((b) => (b.style.opacity = '1'));

          recorder.stop();
        })().catch(reject);
      });

      if (!cancelRef.current) {
        setProgress(100);
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Video export failed:', err);
      alert('Video export failed. Your browser may not support MediaRecorder.');
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  if (!isPremium) {
    return (
      <button
        onClick={onUpgradeClick}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-shadow"
      >
        <Crown className="w-4 h-4" />
        Export MP4 (Premium)
      </button>
    );
  }

  return (
    <button
      onClick={exportVideo}
      disabled={exporting || messages.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full font-semibold text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {progress > 0 ? `${progress}%` : 'Recording...'}
        </>
      ) : (
        <>
          <Video className="w-4 h-4" />
          Export Video
        </>
      )}
    </button>
  );
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
