'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUpload: (url: string) => void
  onImageRemove: () => void
}

export default function ImageUpload({ currentImageUrl, onImageUpload, onImageRemove }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError('')
    
    console.log('Uploading file:', file.name, file.type, file.size)

    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('Sending upload request...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      console.log('Upload response status:', response.status)
      const data = await response.json()
      console.log('Upload response data:', data)

      if (response.ok) {
        onImageUpload(data.url)
        console.log('Upload successful, URL:', data.url)
      } else {
        setUploadError(data.error || 'Upload failed')
        console.error('Upload failed:', data.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-upload">
      <div className="upload-area">
        {currentImageUrl ? (
          <div className="image-preview">
            <Image
              src={currentImageUrl}
              alt="Bee profile"
              width={200}
              height={200}
              className="preview-image"
            />
            <div className="image-overlay">
              <button
                type="button"
                className="change-image-btn"
                onClick={handleClick}
                disabled={isUploading}
              >
                Change Image
              </button>
              <button
                type="button"
                className="remove-image-btn"
                onClick={onImageRemove}
                disabled={isUploading}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            {isUploading ? (
              <div className="upload-status">
                <div className="spinner"></div>
                <p>Uploading...</p>
              </div>
            ) : (
              <div className="upload-content">
                <div className="upload-icon">📷</div>
                <p>Click to upload or drag and drop</p>
                <p className="upload-hint">PNG, JPG, WebP up to 5MB</p>
              </div>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {uploadError && (
        <div className="upload-error">
          {uploadError}
        </div>
      )}

      <style jsx>{`
        .image-upload {
          margin-bottom: 1rem;
        }

        .upload-area {
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #fe8a00;
        }

        .image-preview {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #f3f4f6;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-preview:hover .image-overlay {
          opacity: 1;
        }

        .change-image-btn,
        .remove-image-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .change-image-btn {
          background: #3b82f6;
          color: white;
        }

        .change-image-btn:hover {
          background: #2563eb;
        }

        .remove-image-btn {
          background: #ef4444;
          color: white;
        }

        .remove-image-btn:hover {
          background: #dc2626;
        }

        .upload-zone {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-zone:hover {
          background: #f9fafb;
        }

        .upload-zone.dragging {
          border-color: #fe8a00;
          background: #fef3c7;
        }

        .upload-zone.uploading {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .upload-content {
          text-align: center;
          color: #6b7280;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .upload-hint {
          font-size: 0.875rem;
          margin-top: 0.25rem;
          opacity: 0.7;
        }

        .upload-status {
          text-align: center;
          color: #6b7280;
        }

        .spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #fe8a00;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .upload-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #fef2f2;
          border-radius: 6px;
          border: 1px solid #fecaca;
        }

        @media (max-width: 768px) {
          .image-overlay {
            opacity: 1;
            background: rgba(0, 0, 0, 0.5);
          }

          .change-image-btn,
          .remove-image-btn {
            padding: 0.75rem 1rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
} 