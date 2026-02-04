package com.example.bus_seat_booking.service;

import com.example.bus_seat_booking.model.Bus;
import com.example.bus_seat_booking.model.Seat;
import com.example.bus_seat_booking.repository.BusRepository;
import com.example.bus_seat_booking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class SeatService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Transactional
    public void generateSeatsForBus(Bus bus, int totalSeats) {

        // prevent duplicate generation
        if (seatRepository.existsByBusId(bus.getId())) {
            return;
        }

        for (int i = 1; i <= totalSeats; i++) {
            Seat seat = new Seat();
            seat.setSeatNumber("S" + i);
            seat.setBooked(false);
            seat.setBus(bus);

            seatRepository.save(seat);
        }
    }

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

    // Book seat
    public Seat bookSeat(Long seatId) {
        Seat seat = getSeatById(seatId);

        if (seat.isBooked()) {
            throw new RuntimeException("Seat " + seat.getSeatNumber() + " is already booked");
        }

        seat.setBooked(true);
        return seatRepository.save(seat);
    }

    public List<Seat> getSeatsByRouteId(Long routeId) {

        // route -> bus
        Bus bus = busRepository.findFirstByRouteId(routeId);

        if (bus == null) {
            return Collections.emptyList();
        }

        // bus -> seats
        return seatRepository.findByBusId(bus.getId());
    }

    // Unbook seat (used when ticket is cancelled)
    public void unbookSeat(Long seatId) {
        Seat seat = getSeatById(seatId);
        seat.setBooked(false);
        seatRepository.save(seat);
    }

    public Seat createSeat(Seat seat) {
        return seatRepository.save(seat);
    }

}
