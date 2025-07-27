'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUpload: (url: string) => void
  onImageRemove: () => void
}

export default function ImageUpload({ currentImageUrl, onImageUpload, onImageRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        onImageUpload(data.url)
      } else {
        setUploadError(data.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Browse Button */}
      <Button 
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        style={{
          background: '#fe8a00',
          color: 'white',
          border: 'none',
          padding: 'clamp(10px, 2vw, 14px) clamp(20px, 3vw, 28px)',
          borderRadius: '12px',
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: isUploading ? 0.6 : 1,
          alignSelf: 'flex-start'
        }}
        onMouseEnter={(e) => {
          if (!isUploading) {
            e.currentTarget.style.background = '#e67a00'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isUploading) {
            e.currentTarget.style.background = '#fe8a00'
            e.currentTarget.style.transform = 'translateY(0)'
          }
        }}
      >
        {isUploading ? 'Uploading...' : 'Browse Image'}
      </Button>

      {/* Image Preview */}
      {currentImageUrl && (
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '200px',
          height: '120px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #e2e8f0',
          alignSelf: 'flex-start'
        }}>
          <Image
            src={currentImageUrl}
            alt="Current image"
            fill
            style={{
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            gap: '8px'
          }}>
            <Button 
              size="sm" 
              onClick={handleClick} 
              disabled={isUploading}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#2d3748',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.6 : 1
              }}
            >
              Change
            </Button>
            <Button 
              size="sm" 
              onClick={onImageRemove} 
              disabled={isUploading}
              style={{
                background: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.6 : 1
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{
          display: 'none'
        }}
      />

      {/* Error Message */}
      {uploadError && (
        <p style={{
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          color: '#e53e3e',
          margin: '0'
        }}>
          {uploadError}
        </p>
      )}

      {/* Help Text */}
      <p style={{
        fontSize: 'clamp(11px, 2vw, 12px)',
        color: '#666',
        margin: '0'
      }}>
        Supported formats: PNG, JPG, WebP (max 5MB)
      </p>
    </div>
  )
}