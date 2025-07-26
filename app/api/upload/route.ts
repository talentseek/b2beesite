import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')
    const formData = await request.formData()
    const file = formData.get('file') as File

    console.log('File received:', file ? `${file.name} (${file.type}, ${file.size} bytes)` : 'No file')

    if (!file) {
      console.log('No file uploaded')
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Try to upload to Imgur first (works in both dev and production)
    try {
      console.log('Attempting to upload to Imgur...')
      
      // Convert file to base64
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Image = buffer.toString('base64')
      
      // Upload to Imgur
      const imgurResponse = await axios.post('https://api.imgur.com/3/image', {
        image: base64Image,
        type: 'base64',
        name: file.name,
        title: `B2BEE Bee Profile - ${file.name}`
      }, {
        headers: {
          'Authorization': 'Client-ID 546c25a59c58ad7', // Imgur client ID
          'Content-Type': 'application/json'
        }
      })

      if (imgurResponse.data && imgurResponse.data.success) {
        const imgurUrl = imgurResponse.data.data.link
        console.log('Uploaded to Imgur successfully:', imgurUrl)
        
        return NextResponse.json({ 
          success: true, 
          url: imgurUrl,
          filename: file.name,
          source: 'imgur'
        })
      } else {
        throw new Error('Imgur upload failed')
      }
    } catch (imgurError) {
      console.error('Imgur upload failed:', imgurError)
      
      // Fallback to local filesystem for development
      if (process.env.NODE_ENV !== 'production') {
        try {
          console.log('Falling back to local filesystem...')
          
          // Create uploads directory if it doesn't exist
          const uploadsDir = join(process.cwd(), 'public', 'uploads')
          if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
          }

          // Generate unique filename
          const timestamp = Date.now()
          const randomString = Math.random().toString(36).substring(2, 15)
          const extension = file.name.split('.').pop()
          const filename = `bee-${timestamp}-${randomString}.${extension}`
          const filepath = join(uploadsDir, filename)

          // Convert file to buffer and save
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          await writeFile(filepath, buffer)

          // Return the public URL
          const publicUrl = `/uploads/${filename}`

          console.log('File saved locally successfully:', filename)
          console.log('Public URL:', publicUrl)

          return NextResponse.json({ 
            success: true, 
            url: publicUrl,
            filename: filename,
            source: 'local'
          })
        } catch (fsError) {
          console.error('Local filesystem error:', fsError)
          throw new Error('Both Imgur and local upload failed')
        }
      } else {
        // In production, if Imgur fails, we can't fallback to local
        throw new Error('Image upload service unavailable')
      }
    }

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload file. Please try again or use an external image URL.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 