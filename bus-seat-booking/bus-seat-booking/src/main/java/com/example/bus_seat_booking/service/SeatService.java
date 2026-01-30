package com.example.bus_seat_booking.service;

import com.example.bus_seat_booking.model.Seat;
import com.example.bus_seat_booking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<Seat> getSeatsByBus(Long busId) {
        return seatRepository.findByBusId(busId);
    }

    public List<Seat> getAvailableSeatsByBus(Long busId) {
        return seatRepository.findByBusIdAndBookedFalse(busId);
    }

    public Seat getSeatById(Long id) {
        return seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));
    }

    public Seat bookSeat(Long seatId) {
        Seat seat = getSeatById(seatId);

        if (seat.isBooked()) {
            throw new RuntimeException("Seat " + seat.getSeatNumber() + " is already booked");
        }

        seat.setBooked(true);
        return seatRepository.save(seat);
    }

    public Seat createSeat(Seat seat) {
        return seatRepository.save(seat);
    }
}