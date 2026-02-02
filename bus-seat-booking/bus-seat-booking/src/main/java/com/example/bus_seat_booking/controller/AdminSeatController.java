package com.example.bus_seat_booking.controller;

import com.example.bus_seat_booking.model.Seat;
import com.example.bus_seat_booking.repository.SeatRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seats")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminSeatController {

    private final SeatRepository seatRepository;

    public AdminSeatController(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    // reserved seats (admin reserved)
    @GetMapping("/reserved")
    public List<Seat> getReservedSeats() {
        return seatRepository.findAll()
                .stream()
                .filter(Seat::isReserved)
                .toList();
    }

    //  CANCELLED seats (user booked → cancelled)
    @GetMapping("/cancelled")
    public List<Seat> getCancelledSeats() {
        return seatRepository.findAll()
                .stream()
                .filter(seat -> !seat.isBooked() && !seat.isReserved())
                .toList();
    }

}

