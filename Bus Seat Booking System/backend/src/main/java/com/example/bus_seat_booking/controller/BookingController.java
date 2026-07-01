package com.example.bus_seat_booking.controller;

import com.example.bus_seat_booking.model.Booking;
import com.example.bus_seat_booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ User tickets list (for My Profile)
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);

        List<Map<String, Object>> out = new ArrayList<>();
        for (Booking b : bookings) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", b.getId());
            m.put("ticketNo", b.getTicketNo());
            m.put("status", b.getStatus() != null ? b.getStatus().name() : "CONFIRMED");
            m.put("seatNumber", b.getSeat() != null ? b.getSeat().getSeatNumber() : "-");
            m.put("busNumber", b.getBus() != null ? b.getBus().getBusNumber() : "-");
            m.put("passengerName", b.getPassengerName() != null ? b.getPassengerName() : "-");
            m.put("phoneNumber", b.getPhoneNumber() != null ? b.getPhoneNumber() : "-");
            m.put("email", b.getEmail() != null ? b.getEmail() : "-");
            out.add(m);
        }

        return ResponseEntity.ok(out);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking createdBooking = bookingService.createBooking(booking);

            Map<String, Object> out = new LinkedHashMap<>();
            out.put("id", createdBooking.getId());
            out.put("ticketNo", createdBooking.getTicketNo());
            out.put("seatNumber", createdBooking.getSeat() != null ? createdBooking.getSeat().getSeatNumber() : "-");
            out.put("busNumber", createdBooking.getBus() != null ? createdBooking.getBus().getBusNumber() : "-");
            out.put("passengerName", createdBooking.getPassengerName() != null ? createdBooking.getPassengerName() : "-");

            return ResponseEntity.ok(out);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage()   //  frontend එකට match
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Bookings API is working!");
    }

    // ✅ Admin: bookings by bus (for Mark Seats)
    @GetMapping("/bus/{busId}")
    public ResponseEntity<?> getBookingsByBus(@PathVariable Long busId) {
        List<Booking> bookings = bookingService.getBookingsByBus(busId);

        List<Map<String, Object>> out = new ArrayList<>();
        for (Booking b : bookings) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", b.getId());
            m.put("ticketNo", b.getTicketNo());
            m.put("status", b.getStatus() != null ? b.getStatus().name() : "CONFIRMED");
            m.put("seatNumber", b.getSeat() != null ? b.getSeat().getSeatNumber() : "-");
            m.put("busId", b.getBus() != null ? b.getBus().getId() : null);
            m.put("busNumber", b.getBus() != null ? b.getBus().getBusNumber() : "-");
            m.put("passengerName", b.getPassengerName() != null ? b.getPassengerName() : "-");
            m.put("phoneNumber", b.getPhoneNumber() != null ? b.getPhoneNumber() : "-");
            m.put("email", b.getEmail() != null ? b.getEmail() : "-");
            out.add(m);
        }

        return ResponseEntity.ok(out);
    }

    // ✅ Cancel booking (used by My Profile & Admin)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Booking updated = bookingService.cancelBooking(id);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", updated.getId());
        out.put("status", updated.getStatus() != null ? updated.getStatus().name() : "CANCELLED");
        out.put("ticketNo", updated.getTicketNo());

        return ResponseEntity.ok(out);
    }
}
