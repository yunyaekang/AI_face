
import React, { useState, useCallback } from 'react';
import { CameraIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-violet-400 bg-violet-50/80 scale-105' : 'border-slate-300 hover:border-violet-400 hover:bg-violet-50/50'}`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
        <CameraIcon className={`w-16 h-16 transition-colors duration-300 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
        <div className="text-slate-500">
          <p className="font-semibold text-lg">
            클릭하거나 파일을 드래그하여 업로드하세요
          </p>
          <p className="text-sm mt-1">PNG, JPG, WEBP 형식 지원</p>
        </div>
      </label>
    </div>
  );
};