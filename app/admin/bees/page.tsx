'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'

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

    console.log('Submitting bee data:', beeData)

    try {
      const url = editingBee ? `/api/bees/${editingBee.id}` : '/api/bees'
      const method = editingBee ? 'PUT' : 'POST'
      
      console.log('Sending request to:', url, 'with method:', method)
      
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
    return <div className="loading">Loading bees...</div>
  }

  return (
    <div className="bees-management">
      <div className="header">
        <h1>Busy Bees Management</h1>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          Add New Bee
        </button>
      </div>

      {showAddForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editingBee ? 'Edit Bee' : 'Add New Bee'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <input
                  type="text"
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (optional)</label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Bee Profile Image (optional)</label>
                <ImageUpload
                  currentImageUrl={formData.image_url}
                  onImageUpload={(url) => setFormData({...formData, image_url: url})}
                  onImageRemove={() => setFormData({...formData, image_url: ''})}
                />
                <p className="form-hint">Upload an image above, or provide a URL below</p>
                <input
                  type="text"
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Or enter image URL directly (e.g., https://example.com/image.jpg)..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingBee ? 'Update Bee' : 'Add Bee'}
                </button>
                <button type="button" className="cancel-button" onClick={cancelForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bees-grid">
        {bees.map((bee) => (
          <div key={bee.id} className="bee-card">
            <div className="bee-image">
              {bee.image_url ? (
                <Image
                  src={bee.image_url}
                  alt={bee.name}
                  width={200}
                  height={200}
                  className="bee-avatar"
                />
              ) : (
                <div className="bee-placeholder">🐝</div>
              )}
            </div>
            <div className="bee-info">
              <h3>{bee.name}</h3>
              <p className="bee-role">{bee.role}</p>
              <p className="bee-description">{bee.description}</p>
              {bee.price && (
                <p className="bee-price">${bee.price}/month</p>
              )}
            </div>
            <div className="bee-actions">
              <button 
                className="edit-button"
                onClick={() => handleEdit(bee)}
              >
                Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(bee.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {bees.length === 0 && (
        <div className="empty-state">
          <p>No bees added yet. Click "Add New Bee" to get started!</p>
        </div>
      )}

      <style jsx>{`
        .bees-management {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          color: #205b41;
          margin: 0;
        }

        .add-button {
          background: #fe8a00;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-button:hover {
          background: #e67a00;
          transform: translateY(-2px);
        }

        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .form-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .form-container h2 {
          color: #205b41;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #fe8a00;
        }

        .form-hint {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.5rem 0;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .save-button {
          background: #205b41;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-button:hover {
          background: #1a4a35;
        }

        .cancel-button {
          background: #6b7280;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          background: #4b5563;
        }

        .bees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .bee-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .bee-card:hover {
          transform: translateY(-4px);
        }

        .bee-image {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
        }

        .bee-avatar {
          object-fit: contain;
          width: 100%;
          height: 100%;
          background: #f3f4f6;
        }

        .bee-placeholder {
          font-size: 4rem;
        }

        .bee-info {
          padding: 1.5rem;
        }

        .bee-info h3 {
          color: #205b41;
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .bee-role {
          color: #fe8a00;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
        }

        .bee-description {
          color: #666;
          margin: 0 0 0.75rem 0;
          line-height: 1.5;
        }

        .bee-price {
          color: #205b41;
          font-weight: 600;
          margin: 0;
        }

        .bee-actions {
          padding: 0 1.5rem 1.5rem;
          display: flex;
          gap: 0.75rem;
        }

        .edit-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-button:hover {
          background: #2563eb;
        }

        .delete-button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .delete-button:hover {
          background: #dc2626;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .bees-management {
            padding: 1rem;
          }

          .header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .bees-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
} 