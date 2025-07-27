'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Bee {
  id: number
  name: string
  role: string
  description: string
  price: number | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

export default function BeesManagement() {
  const [bees, setBees] = useState<Bee[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBee, setEditingBee] = useState<Bee | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    price: '',
    image_url: ''
  })

  useEffect(() => {
    fetchBees()
  }, [])

  const fetchBees = async () => {
    try {
      const response = await fetch('/api/bees')
      if (response.ok) {
        const data = await response.json()
        setBees(data.bees || [])
      }
    } catch (error) {
      console.error('Error fetching bees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const beeData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null
    }

    try {
      const url = editingBee ? `/api/bees/${editingBee.id}` : '/api/bees'
      const method = editingBee ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(beeData)
      })

      if (response.ok) {
        setShowAddForm(false)
        setEditingBee(null)
        resetForm()
        fetchBees()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save bee')
      }
    } catch (error) {
      console.error('Error saving bee:', error)
      alert('Failed to save bee')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bee?')) return

    try {
      const response = await fetch(`/api/bees/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchBees()
      } else {
        alert('Failed to delete bee')
      }
    } catch (error) {
      console.error('Error deleting bee:', error)
      alert('Failed to delete bee')
    }
  }

  const handleEdit = (bee: Bee) => {
    setEditingBee(bee)
    setFormData({
      name: bee.name,
      role: bee.role,
      description: bee.description,
      price: bee.price?.toString() || '',
      image_url: bee.image_url || ''
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      description: '',
      price: '',
      image_url: ''
    })
  }

  const cancelForm = () => {
    setShowAddForm(false)
    setEditingBee(null)
    resetForm()
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both'
            }}>🐝</div>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both 0.2s'
            }}>🐝</div>
            <div style={{
              fontSize: '24px',
              animation: 'bounce 1.4s ease-in-out infinite both 0.4s'
            }}>🐝</div>
          </div>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 18px)',
            fontWeight: '500',
            opacity: '0.9'
          }}>
            Loading bees...
          </p>
        </div>
        
        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(32px, 6vw, 48px)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(16px, 3vw, 24px)'
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          margin: '0'
        }}>
          Busy Bees Management
        </h1>
        
        <Button 
          onClick={() => {
            console.log('Add New Bee button clicked')
            setShowAddForm(true)
          }}
          style={{
            background: '#fe8a00',
            color: 'white',
            border: 'none',
            padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
            borderRadius: '12px',
            fontSize: 'clamp(14px, 3vw, 16px)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e67a00'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fe8a00'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        >
          Add New Bee
        </Button>
      </div>

      {/* Custom Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: 'none',
            padding: 'clamp(24px, 4vw, 32px)',
            maxWidth: '500px',
            width: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'clamp(16px, 3vw, 24px)'
            }}>
              <h2 style={{
                fontSize: 'clamp(20px, 4vw, 24px)',
                fontWeight: 'bold',
                color: '#2d3748',
                margin: 0
              }}>
                {editingBee ? 'Edit Bee' : 'Add New Bee'}
              </h2>
              <Button 
                onClick={() => setShowAddForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                }}
              >
                ×
              </Button>
            </div>
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(16px, 3vw, 24px)'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label htmlFor="name" style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Name *
                </label>
                <Input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{
                    padding: 'clamp(12px, 2vw, 16px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fe8a00'
                    e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label htmlFor="role" style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Role *
                </label>
                <Input
                  type="text"
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                  style={{
                    padding: 'clamp(12px, 2vw, 16px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fe8a00'
                    e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label htmlFor="description" style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                  style={{
                    padding: 'clamp(12px, 2vw, 16px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fe8a00'
                    e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label htmlFor="price" style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Price (optional)
                </label>
                <Input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  step="0.01"
                  min="0"
                  style={{
                    padding: 'clamp(12px, 2vw, 16px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fe8a00'
                    e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <label style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Bee Profile Image (optional)
                </label>
                <ImageUpload
                  currentImageUrl={formData.image_url}
                  onImageUpload={(url) => setFormData({...formData, image_url: url})}
                  onImageRemove={() => setFormData({...formData, image_url: ''})}
                />
                <p style={{
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  color: '#666',
                  margin: '0'
                }}>
                  Upload an image above, or provide a URL below
                </p>
                <Input
                  type="text"
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Or enter image URL directly..."
                  style={{
                    padding: 'clamp(12px, 2vw, 16px)',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fe8a00'
                    e.target.style.boxShadow = '0 0 0 3px rgba(254, 138, 0, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'clamp(12px, 2vw, 16px)',
                marginTop: 'clamp(16px, 3vw, 24px)'
              }}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelForm}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#2d3748',
                    border: '2px solid #e2e8f0',
                    padding: 'clamp(10px, 2vw, 14px) clamp(20px, 3vw, 28px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.borderColor = '#fe8a00'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  style={{
                    background: '#fe8a00',
                    color: 'white',
                    border: 'none',
                    padding: 'clamp(10px, 2vw, 14px) clamp(20px, 3vw, 28px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e67a00'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fe8a00'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {editingBee ? 'Update Bee' : 'Add Bee'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bees Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'clamp(20px, 4vw, 32px)'
      }}>
        {bees.map((bee) => (
          <div key={bee.id} style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '200px',
              overflow: 'hidden'
            }}>
              {bee.image_url ? (
                <Image
                  src={bee.image_url}
                  alt={bee.name}
                  fill
                  style={{
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px'
                }}>
                  🐝
                </div>
              )}
            </div>
            
            <div style={{
              padding: 'clamp(20px, 4vw, 24px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(8px, 2vw, 12px)'
            }}>
              <h3 style={{
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 'bold',
                color: '#2d3748',
                margin: '0'
              }}>
                {bee.name}
              </h3>
              <p style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                fontWeight: '600',
                color: '#fe8a00',
                margin: '0'
              }}>
                {bee.role}
              </p>
              <p style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#666',
                lineHeight: '1.5',
                margin: '0'
              }}>
                {bee.description}
              </p>
              {bee.price && (
                <p style={{
                  fontSize: 'clamp(18px, 4vw, 20px)',
                  fontWeight: 'bold',
                  color: '#fe8a00',
                  margin: '0'
                }}>
                  ${bee.price}/month
                </p>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'clamp(8px, 2vw, 12px)',
                marginTop: 'clamp(12px, 2vw, 16px)'
              }}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(bee)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#2d3748',
                    border: '2px solid #e2e8f0',
                    padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.borderColor = '#fe8a00'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(bee.id)}
                  style={{
                    background: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#c53030'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#e53e3e'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bees.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'clamp(40px, 8vw, 80px)',
          color: 'white'
        }}>
          <p style={{
            fontSize: 'clamp(18px, 4vw, 24px)',
            margin: '0',
            opacity: '0.9'
          }}>
            No bees added yet. Click "Add New Bee" to get started!
          </p>
        </div>
      )}
    </div>
  )
}