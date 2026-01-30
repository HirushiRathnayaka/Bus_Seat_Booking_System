import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import './ConfirmationModal.css';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // 'warning', 'success', 'danger', 'info'
  isLoading = false
}) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { icon: <FaCheckCircle />, color: '#27ae60' };
      case 'danger':
        return { icon: <FaExclamationTriangle />, color: '#e74c3c' };
      case 'info':
        return { icon: <FaExclamationTriangle />, color: '#3498db' };
      default:
        return { icon: <FaExclamationTriangle />, color: '#f39c12' };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="modal-header">
          <div className="modal-icon" style={{ color: styles.color }}>
            {styles.icon}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="modal-btn cancel-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          
          <button 
            className="modal-btn confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
            style={{ backgroundColor: styles.color }}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}