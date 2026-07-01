package com.example.bus_seat_booking.controller;

import com.example.bus_seat_booking.model.Bus;
import com.example.bus_seat_booking.repository.BusRepository;
import com.example.bus_seat_booking.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminBusController {

    private final BusRepository busRepository;
    private final BusService busService;

    public AdminBusController(BusRepository busRepository, BusService busService) {

        this.busRepository = busRepository;
        this.busService = busService;
    }

    @GetMapping("/buses/route/{routeId}")
    public List<Bus> getBusesByRoute(@PathVariable Long routeId) {
        return busRepository.findByRouteId(routeId);
    }

    @DeleteMapping("/buses/{busId}")
    public ResponseEntity<String> deleteBus(@PathVariable Long busId) {
        if (!busRepository.existsById(busId)) {
            return ResponseEntity.badRequest().body("Bus not found");
        }
        busRepository.deleteById(busId);
        return ResponseEntity.ok("Bus deleted");
    }

    @PostMapping("/bus")
    public ResponseEntity<?> createBus(@RequestBody Bus bus) {
        return ResponseEntity.ok(busService.createBus(bus));
    }


}

