import React, { useCallback, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface DragDropPhotoProps {
  currentPhoto?: string;
  onPhotoChange: (base64: string | undefined) => void;
  label?: string;
}

export const DragDropPhoto: React.FC<DragDropPhotoProps> = ({
  currentPhoto,
  onPhotoChange,
  label = 'Contact Photo',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onPhotoChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div>
      <span className="section-label">{label.toUpperCase()}</span>
      {currentPhoto ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={currentPhoto}
            alt="Contact"
            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5E7EB' }}
          />
          <button
            onClick={() => onPhotoChange(undefined)}
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              background: '#EF4444',
              borderRadius: '50%',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
            title="Remove photo"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            height: '72px',
            border: `1.5px dashed ${isDragging ? '#6366F1' : '#D1D5DB'}`,
            borderRadius: '12px',
            background: isDragging ? '#EEF2FF' : '#FAFAFA',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <Upload style={{ width: 18, height: 18, color: '#9CA3AF' }} />
          <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
            Drag & drop or <span style={{ color: '#6366F1', fontWeight: 500 }}>browse</span>
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};
