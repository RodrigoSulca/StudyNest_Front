import { useState, useEffect, useCallback } from 'react';
import type { Multimedia } from '../../types/multimedia.types';

interface GaleriaViewerProps {
  imagenes: Multimedia[];
  startIndex: number;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function GaleriaViewer({ imagenes, startIndex, onClose, onDelete }: GaleriaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const sorted = imagenes.slice().sort((a, b) => a.orden - b.orden);
  const current = sorted[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % sorted.length);
  }, [sorted.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + sorted.length) % sorted.length);
  }, [sorted.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {sorted.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      <img
        src={current.url_almacenamiento}
        alt={`Image ${current.orden}`}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
        {currentIndex + 1} / {sorted.length}
      </div>

      {onDelete && (
        <button
          onClick={() => {
            onDelete(current.id);
            if (sorted.length === 1) onClose();
            else if (currentIndex === sorted.length - 1) setCurrentIndex((i) => i - 1);
          }}
          className="absolute bottom-4 right-4 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}
