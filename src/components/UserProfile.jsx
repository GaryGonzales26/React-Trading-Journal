'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const UserProfile = () => {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    trading_style: profile?.trading_style || '',
    experience_level: profile?.experience_level || 'beginner'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await updateProfile(formData)

    if (error) {
      setMessage('Error updating profile: ' + error.message)
    } else {
      setMessage('Profile updated successfully!')
      setIsEditing(false)
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-3xl text-white">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '👤'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {profile?.full_name || 'Trading Trader'}
                </h1>
                <p className="text-blue-100 text-lg">{user?.email}</p>
                <p className="text-blue-200 text-sm">
                  Member since {new Date(profile?.created_at || user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="experience_level" className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    id="experience_level"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="trading_style" className="block text-sm font-semibold text-gray-700 mb-2">
                  Trading Style
                </label>
                <select
                  id="trading_style"
                  name="trading_style"
                  value={formData.trading_style}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select trading style</option>
                  <option value="day_trading">Day Trading</option>
                  <option value="swing_trading">Swing Trading</option>
                  <option value="scalping">Scalping</option>
                  <option value="position_trading">Position Trading</option>
                  <option value="algorithmic">Algorithmic Trading</option>
                </select>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Tell us about your trading journey..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Full Name:</span>
                      <p className="font-medium text-gray-900">{profile?.full_name || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Experience Level:</span>
                      <p className="font-medium text-gray-900 capitalize">{profile?.experience_level || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Trading Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Trading Style:</span>
                      <p className="font-medium text-gray-900">
                        {profile?.trading_style ? profile.trading_style.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="text-gray-700 leading-relaxed">
                  {profile?.bio || 'No bio available. Click "Edit Profile" to add one.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile

