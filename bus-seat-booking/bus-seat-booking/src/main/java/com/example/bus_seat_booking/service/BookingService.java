package com.example.bus_seat_booking.service;

import com.example.bus_seat_booking.model.Booking;
import com.example.bus_seat_booking.model.Seat;
import com.example.bus_seat_booking.model.Bus;
import com.example.bus_seat_booking.model.User;
import com.example.bus_seat_booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatService seatService;

    @Autowired
    private BusService busService;

    @Autowired
    private AuthService authService;

    public Booking createBooking(Booking booking) {
        // Validate and book the seat
        if (booking.getSeat() == null || booking.getSeat().getId() == null) {
            throw new RuntimeException("Seat ID is required");
        }

        Seat seat = seatService.bookSeat(booking.getSeat().getId());
        booking.setSeat(seat);

        // Get bus details
        if (booking.getBus() == null || booking.getBus().getId() == null) {
            throw new RuntimeException("Bus ID is required");
        }

        Bus bus = busService.getBusById(booking.getBus().getId());
        booking.setBus(bus);

        // Set user if provided
        if (booking.getUser() != null && booking.getUser().getId() != null) {
            User user = authService.getUserById(booking.getUser().getId());
            booking.setUser(user);
        }

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }
}