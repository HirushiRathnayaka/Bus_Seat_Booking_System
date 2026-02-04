package com.example.bus_seat_booking.service;

import com.example.bus_seat_booking.model.Bus;
import com.example.bus_seat_booking.model.Seat;
import com.example.bus_seat_booking.repository.BusRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatService seatService;

    public List<Bus> getBusesByRoute(Long routeId) {
        return busRepository.findByRouteId(routeId);
    }

    public Bus getBusById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + id));
    }

    // ONLY create bus here
    public Bus createBus(Bus bus) {
        Bus savedBus = busRepository.save(bus);

        // call seat generation (delegation)
        seatService.generateSeatsForBus(savedBus, 40);

        return savedBus;
    }

}