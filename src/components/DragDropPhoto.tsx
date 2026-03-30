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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {currentPhoto ? (
        <div className="relative inline-block">
          <img
            src={currentPhoto}
            alt="Contact"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <button
            onClick={() => onPhotoChange(undefined)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
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
          className={`flex flex-col items-center justify-center gap-2 w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <Upload className="w-6 h-6 text-gray-400" />
          <p className="text-xs text-gray-500 text-center px-2">
            Drag & drop or <span className="text-blue-600 font-medium">click to browse</span>
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};
