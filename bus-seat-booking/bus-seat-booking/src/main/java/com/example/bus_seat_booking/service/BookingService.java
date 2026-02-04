package com.example.bus_seat_booking.service;

import com.example.bus_seat_booking.model.Ticket;
import com.example.bus_seat_booking.repository.TicketRepository;
import com.example.bus_seat_booking.model.Booking;
import com.example.bus_seat_booking.model.Seat;
import com.example.bus_seat_booking.model.Bus;
import com.example.bus_seat_booking.model.User;
import com.example.bus_seat_booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


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

    @Autowired
    private TicketRepository ticketRepository;


    public Booking createBooking(Booking booking) {
        // Validate and book the seat
        if (booking.getSeat() == null || booking.getSeat().getId() == null) {
            throw new RuntimeException("Seat ID is required");
        }

        Seat seat = seatService.bookSeat(booking.getSeat().getId());
        booking.setSeat(seat);

        // validate bus
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

        // generate ticket number
        String ticketNo ="TKT-" + java.util.UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();

        booking.setTicketNo(ticketNo);

        // save booking
        Booking saved = bookingRepository.save(booking);

        // create and save booking
        Ticket t = new Ticket();
        t.setTicketNo(saved.getTicketNo());
        t.setSeatNumber(saved.getSeat() != null ? saved.getSeat().getSeatNumber() : "-");
        t.setBusNumber(saved.getBus() != null ? saved.getBus().getBusNumber() : "-");
        t.setPassengerName(saved.getPassengerName() != null ? saved.getPassengerName() : "-");
        t.setBooking(saved);

        ticketRepository.save(t);

        return saved;
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

    public List<Booking> getBookingsByBus(Long busId) {
        return bookingRepository.findByBusId(busId);
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            return booking; // already cancelled
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        if (booking.getSeat() != null && booking.getSeat().getId() != null) {
            seatService.unbookSeat(booking.getSeat().getId());
        }

        return bookingRepository.save(booking);
    }


}