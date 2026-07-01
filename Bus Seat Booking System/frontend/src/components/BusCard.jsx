import React from 'react';
import { FaBus, FaClock, FaCalendarAlt, FaChair, FaArrowRight } from 'react-icons/fa';
import './BusCard.css';

export default function BusCard({ bus, onSelect, isSelected = false }) {
  const calculateAvailableSeats = () => {
    // Assuming bus.seats is an array of seat objects
    if (!bus.seats) return 0;
    return bus.seats.filter(seat => !seat.booked).length;
  };

  const calculatePrice = () => {
    const available = calculateAvailableSeats();
    if (available < 10) return '$45'; // High demand
    if (available < 20) return '$40'; // Medium demand
    return '$35'; // Low demand
  };

  return (
    <div 
      className={`bus-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(bus)}
    >
      <div className="bus-card-header">
        <div className="bus-number">
          <FaBus className="bus-icon" />
          <h3>{bus.busNumber}</h3>
        </div>
        <div className="bus-type">
          <span className="type-badge">{bus.type || 'Standard'}</span>
        </div>
      </div>

      <div className="bus-card-body">
        <div className="route-info">
          <div className="route-cities">
            <div className="city">
              <strong>{bus.route?.fromCity || 'New York'}</strong>
              <span className="time">08:00 AM</span>
            </div>
            <div className="route-arrow">
              <FaArrowRight />
            </div>
            <div className="city">
              <strong>{bus.route?.toCity || 'Boston'}</strong>
              <span className="time">12:00 PM</span>
            </div>
          </div>
          
          <div className="duration">
            <FaClock className="duration-icon" />
            <span>4 hours</span>
          </div>
        </div>

        <div className="bus-details">
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Date</span>
              <span className="detail-value">{bus.travelDate || '2024-12-25'}</span>
            </div>
          </div>

          <div className="detail-item">
            <FaClock className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Departure</span>
              <span className="detail-value">{bus.departureTime || '08:00 AM'}</span>
            </div>
          </div>

          <div className="detail-item">
            <FaChair className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Available Seats</span>
              <span className="detail-value">{calculateAvailableSeats()}/40</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bus-card-footer">
        <div className="price-section">
          <span className="price-label">Starting from</span>
          <div className="price">{calculatePrice()}</div>
        </div>
        <button className={`select-btn ${isSelected ? 'selected' : ''}`}>
          {isSelected ? 'Selected ✓' : 'Select Bus'}
        </button>
      </div>
    </div>
  );
}