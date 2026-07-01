import React from 'react';
import { FaUser, FaPhone, FaBus, FaChair, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import './BookingCard.css';

export default function BookingCard({ booking, onCancel, onViewDetails }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'confirmed';
      case 'PENDING': return 'pending';
      case 'CANCELLED': return 'cancelled';
      case 'COMPLETED': return 'completed';
      default: return 'pending';
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="booking-id">
          <FaTicketAlt className="ticket-icon" />
          <span>Booking ID: <strong>{booking.id}</strong></span>
        </div>
        <div className={`booking-status ${getStatusColor(booking.status)}`}>
          {booking.status}
        </div>
      </div>

      <div className="booking-card-body">
        <div className="booking-info-section">
          <div className="info-item">
            <FaUser className="info-icon" />
            <div className="info-content">
              <span className="info-label">Passenger</span>
              <span className="info-value">{booking.passengerName}</span>
            </div>
          </div>

          <div className="info-item">
            <FaPhone className="info-icon" />
            <div className="info-content">
              <span className="info-label">Phone</span>
              <span className="info-value">{booking.phoneNumber || 'N/A'}</span>
            </div>
          </div>

          <div className="info-item">
            <FaBus className="info-icon" />
            <div className="info-content">
              <span className="info-label">Bus</span>
              <span className="info-value">{booking.bus?.busNumber || 'N/A'}</span>
            </div>
          </div>

          <div className="info-item">
            <FaChair className="info-icon" />
            <div className="info-content">
              <span className="info-label">Seat</span>
              <span className="info-value">{booking.seat?.seatNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="route-section">
          <div className="route-info">
            <div className="route-from">
              <FaMapMarkerAlt className="route-icon" />
              <div className="route-details">
                <span className="route-city">{booking.bus?.route?.fromCity || 'From'}</span>
                <span className="route-time">08:00 AM</span>
              </div>
            </div>
            
            <div className="route-line">
              <div className="line"></div>
              <div className="duration">4h</div>
            </div>
            
            <div className="route-to">
              <FaMapMarkerAlt className="route-icon" />
              <div className="route-details">
                <span className="route-city">{booking.bus?.route?.toCity || 'To'}</span>
                <span className="route-time">12:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-date-section">
          <div className="date-item">
            <FaCalendarAlt className="date-icon" />
            <div className="date-content">
              <span className="date-label">Travel Date</span>
              <span className="date-value">{formatDate(booking.bus?.travelDate)}</span>
            </div>
          </div>

          <div className="date-item">
            <FaCalendarAlt className="date-icon" />
            <div className="date-content">
              <span className="date-label">Booking Date</span>
              <span className="date-value">{formatDate(booking.bookingDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-card-footer">
        <button 
          className="view-details-btn"
          onClick={() => onViewDetails(booking)}
        >
          View Details
        </button>
        
        {booking.status === 'CONFIRMED' && (
          <button 
            className="cancel-btn"
            onClick={() => onCancel(booking.id)}
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}