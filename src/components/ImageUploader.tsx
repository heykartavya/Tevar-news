import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  defaultImage?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUploadSuccess, 
  onUploadError,
  className = "",
  defaultImage
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onUploadError?.('Please select an image file');
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
    } catch (error: any) {
      console.error('Upload error:', error);
      setPreviewUrl(defaultImage || null);
      onUploadError?.(error.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onUploadSuccess(''); // Pass empty string to clear the parent state
  };

  return (
    <div className={`relative ${className}`}>
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
          <img 
            src={previewUrl} 
            alt="Upload preview" 
            className={`w-full h-auto max-h-64 object-cover ${isUploading ? 'opacity-50 blur-sm' : ''}`}
          />
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow-md" />
            </div>
          )}

          {!isUploading && (
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
};
