package com.example.bus_seat_booking.service;

import com.example.bus_seat_booking.model.Bus;
import com.example.bus_seat_booking.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    public List<Bus> getBusesByRoute(Long routeId) {
        return busRepository.findByRouteId(routeId);
    }

    public Bus getBusById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with id: " + id));
    }

    public Bus createBus(Bus bus) {
        return busRepository.save(bus);
    }
}