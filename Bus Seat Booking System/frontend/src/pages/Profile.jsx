import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/authApi';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaLock, FaCalendarAlt } from 'react-icons/fa';
import '../styles/profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });
  
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || ''
      });
    }
  }, [user]);

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!profile.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (profile.phone && !/^\d{10}$/.test(profile.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!password.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!password.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (password.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (password.newPassword !== password.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      const updatedData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth
      };
      
      const response = await updateProfile(updatedData);
      
      updateUser(response.user);
      
      toast.success('Profile updated successfully!');
      setEditing(false);
      
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      // In real app, call API to change password
      toast.success('Password changed successfully!');
      
      setPassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
      
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <Navigation />
      
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="avatar-section">
              <div className="avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="user-info">
                <h1 className="user-name">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="user-email">{user?.email}</p>
                <p className="user-role">
                  <span className={`role-badge ${user?.role?.toLowerCase()}`}>
                    {user?.role}
                  </span>
                </p>
              </div>
            </div>
            
            <button 
              className="edit-profile-btn"
              onClick={() => setEditing(!editing)}
            >
              {editing ? (
                <>
                  <FaSave className="edit-icon" />
                  Save Changes
                </>
              ) : (
                <>
                  <FaEdit className="edit-icon" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Left Column - Profile Info */}
          <div className="profile-info-column">
            <div className="profile-card">
              <h3 className="card-title">Personal Information</h3>
              
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FaUser className="input-icon" />
                      First Name
                    </label>
                    {editing ? (
                      <>
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleInputChange}
                          className={`form-input ${errors.firstName ? 'error' : ''}`}
                          disabled={loading}
                        />
                        {errors.firstName && (
                          <span className="error-message">{errors.firstName}</span>
                        )}
                      </>
                    ) : (
                      <div className="read-only-value">{profile.firstName}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FaUser className="input-icon" />
                      Last Name
                    </label>
                    {editing ? (
                      <>
                        <input
                          type="text"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleInputChange}
                          className={`form-input ${errors.lastName ? 'error' : ''}`}
                          disabled={loading}
                        />
                        {errors.lastName && (
                          <span className="error-message">{errors.lastName}</span>
                        )}
                      </>
                    ) : (
                      <div className="read-only-value">{profile.lastName}</div>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FaUser className="input-icon" />
                    Username
                  </label>
                  <div className="read-only-value">{profile.username}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FaEnvelope className="input-icon" />
                    Email Address
                  </label>
                  {editing ? (
                    <>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        disabled={loading}
                      />
                      {errors.email && (
                        <span className="error-message">{errors.email}</span>
                      )}
                    </>
                  ) : (
                    <div className="read-only-value">{profile.email}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FaPhone className="input-icon" />
                    Phone Number
                  </label>
                  {editing ? (
                    <>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        disabled={loading}
                        placeholder="Optional"
                      />
                      {errors.phone && (
                        <span className="error-message">{errors.phone}</span>
                      )}
                    </>
                  ) : (
                    <div className="read-only-value">
                      {profile.phone || 'Not provided'}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FaCalendarAlt className="input-icon" />
                    Date of Birth
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={loading}
                    />
                  ) : (
                    <div className="read-only-value">
                      {formatDate(profile.dateOfBirth)}
                    </div>
                  )}
                </div>
                
                {editing && (
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="save-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner"></span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setEditing(false);
                        // Reset to original values
                        setProfile({
                          firstName: user.firstName || '',
                          lastName: user.lastName || '',
                          username: user.username || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          dateOfBirth: user.dateOfBirth || ''
                        });
                        setErrors({});
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
            
            {/* Change Password Card */}
            <div className="password-card">
              <div className="card-header">
                <h3 className="card-title">
                  <FaLock className="card-icon" />
                  Change Password
                </h3>
                <button 
                  className="toggle-password-btn"
                  onClick={() => setChangingPassword(!changingPassword)}
                >
                  {changingPassword ? 'Cancel' : 'Change Password'}
                </button>
              </div>
              
              {changingPassword && (
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={password.currentPassword}
                      onChange={handlePasswordInputChange}
                      className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                      disabled={loading}
                      placeholder="Enter current password"
                    />
                    {errors.currentPassword && (
                      <span className="error-message">{errors.currentPassword}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordInputChange}
                      className={`form-input ${errors.newPassword ? 'error' : ''}`}
                      disabled={loading}
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && (
                      <span className="error-message">{errors.newPassword}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      disabled={loading}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <span className="error-message">{errors.confirmPassword}</span>
                    )}
                  </div>
                  
                  <div className="password-hints">
                    <p className="hint-title">Password requirements:</p>
                    <ul className="hint-list">
                      <li>At least 6 characters</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                    </ul>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="save-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner"></span>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column - Account Info */}
          <div className="account-info-column">
            {/* Account Summary Card */}
            <div className="account-summary-card">
              <h3 className="card-title">Account Summary</h3>
              
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-icon">🎫</div>
                  <div className="summary-content">
                    <span className="summary-label">Total Bookings</span>
                    <span className="summary-value">24</span>
                  </div>
                </div>
                
                <div className="summary-item">
                  <div className="summary-icon">✅</div>
                  <div className="summary-content">
                    <span className="summary-label">Completed Trips</span>
                    <span className="summary-value">18</span>
                  </div>
                </div>
                
                <div className="summary-item">
                  <div className="summary-icon">⭐</div>
                  <div className="summary-content">
                    <span className="summary-label">Member Since</span>
                    <span className="summary-value">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          })
                        : '2024'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="summary-item">
                  <div className="summary-icon">👑</div>
                  <div className="summary-content">
                    <span className="summary-label">Loyalty Points</span>
                    <span className="summary-value">1,250</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity Card */}
            <div className="activity-card">
              <h3 className="card-title">Recent Activity</h3>
              
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🎫</div>
                  <div className="activity-content">
                    <h4>New Booking</h4>
                    <p>Booked seat S15 on NY-Boston route</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">💰</div>
                  <div className="activity-content">
                    <h4>Payment Processed</h4>
                    <p>Payment of $35 for booking #BOOK12345</p>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">📧</div>
                  <div className="activity-content">
                    <h4>Email Verified</h4>
                    <p>Confirmed your email address</p>
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">👋</div>
                  <div className="activity-content">
                    <h4>Welcome</h4>
                    <p>Joined BusBooking platform</p>
                    <span className="activity-time">2 months ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preferences Card */}
            <div className="preferences-card">
              <h3 className="card-title">Preferences</h3>
              
              <div className="preferences-list">
                <div className="preference-item">
                  <span className="preference-label">Email Notifications</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <span className="preference-label">SMS Notifications</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <span className="preference-label">Auto-fill Passenger Info</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <span className="preference-label">Dark Mode</span>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              
              <button className="save-preferences-btn">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}