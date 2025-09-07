import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  label = "Image", 
  required = false,
  className = "" 
}) => {
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  const handleMethodChange = (method) => {
    setUploadMethod(method);
    if (method === 'url') {
      setPreview(imageUrl);
      onImageChange(imageUrl);
    } else {
      setImageUrl('');
      setPreview('');
      onImageChange('');
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreview(url);
    onImageChange(url);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const uploadedUrl = response.data.data.secure_url;
        setImageUrl(uploadedUrl);
        onImageChange(uploadedUrl);
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.error || 'Failed to upload image');
      setPreview('');
      onImageChange('');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setPreview('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-white mb-2 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Method Selection */}
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => handleMethodChange('url')}
          className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
            uploadMethod === 'url'
              ? 'border-neon-cyan bg-neon-cyan text-black'
              : 'border-gray-600 text-gray-400 hover:border-neon-cyan hover:text-neon-cyan'
          }`}
        >
          📎 Image URL
        </button>
        <button
          type="button"
          onClick={() => handleMethodChange('file')}
          className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
            uploadMethod === 'file'
              ? 'border-neon-cyan bg-neon-cyan text-black'
              : 'border-gray-600 text-gray-400 hover:border-neon-cyan hover:text-neon-cyan'
          }`}
        >
          📁 Upload File
        </button>
      </div>

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div>
          <input
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
            required={required}
          />
          <p className="text-xs text-gray-400 mt-1">
            Paste any image URL (social media, CDN, etc.)
          </p>
        </div>
      )}

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon-cyan file:text-black hover:file:bg-cyan-400"
            disabled={uploading}
            required={required}
          />
          <p className="text-xs text-gray-400 mt-1">
            Upload JPG, PNG, GIF, WebP (max 5MB)
          </p>
        </div>
      )}

      {/* Loading State */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-4"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon-cyan mr-3"></div>
          <span className="text-neon-cyan">Uploading...</span>
        </motion.div>
      )}

      {/* Image Preview */}
      {preview && !uploading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="relative w-full max-w-xs mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border-2 border-gray-600"
              onError={(e) => {
                e.target.style.display = 'none';
                setPreview('');
                onImageChange('');
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs transition-colors"
              title="Remove image"
            >
              ✕
            </button>
          </div>
          {uploadMethod === 'file' && (
            <p className="text-xs text-green-400 text-center mt-2">
              ✅ Uploaded to cloud storage
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ImageUpload;