package com.example.bus_seat_booking.controller;

import com.example.bus_seat_booking.model.Seat;
import com.example.bus_seat_booking.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:3000")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<Seat>> getSeatsByBus(@PathVariable Long busId) {
        List<Seat> seats = seatService.getSeatsByBus(busId);
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/bus/{busId}/available")
    public ResponseEntity<List<Seat>> getAvailableSeats(@PathVariable Long busId) {
        List<Seat> seats = seatService.getAvailableSeatsByBus(busId);
        return ResponseEntity.ok(seats);
    }

    @PostMapping("/{seatId}/book")
    public ResponseEntity<Seat> bookSeat(@PathVariable Long seatId) {
        Seat bookedSeat = seatService.bookSeat(seatId);
        return ResponseEntity.ok(bookedSeat);
    }

    @PostMapping
    public ResponseEntity<Seat> createSeat(@RequestBody Seat seat) {
        Seat createdSeat = seatService.createSeat(seat);
        return ResponseEntity.ok(createdSeat);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Seats API is working!");
    }
}