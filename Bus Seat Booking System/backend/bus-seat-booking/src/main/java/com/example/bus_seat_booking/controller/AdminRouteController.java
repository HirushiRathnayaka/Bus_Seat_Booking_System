package com.example.bus_seat_booking.controller;

import com.example.bus_seat_booking.model.Route;
import com.example.bus_seat_booking.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/routes")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminRouteController {

    @Autowired
    private RouteRepository routeRepository;

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        return ResponseEntity.ok(route);
    }

    @PostMapping
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        if (route.getFromCity() == null || route.getToCity() == null) {
            throw new RuntimeException("fromCity and toCity are required");
        }
        return ResponseEntity.ok(routeRepository.save(route));
    }
}
