package com.example.bus_seat_booking.controller;

import com.example.bus_seat_booking.model.BusSchedule;
import com.example.bus_seat_booking.repository.BusScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminScheduleController {

    @Autowired
    private BusScheduleRepository scheduleRepository;

    // create schedule
    @PostMapping("/schedules")
    public BusSchedule create(@RequestBody BusSchedule schedule) {
        return scheduleRepository.save(schedule);
    }

    // get all schedules
    @GetMapping("/schedules")
    public ResponseEntity<List<BusSchedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleRepository.findAll());
    }

    // delete schedules by Route + Bus
    @DeleteMapping("/schedules/by-bus")
    public ResponseEntity<String> deleteByBus(@RequestParam Long routeId, @RequestParam Long busId) {

        long count = scheduleRepository.countByRouteIdAndBusId(routeId, busId);
        if (count == 0) {
            return ResponseEntity.badRequest().body("No schedules found for this bus");
        }

        scheduleRepository.deleteByRouteIdAndBusId(routeId, busId);
        return ResponseEntity.ok("Deleted " + count + " schedule(s) for this bus");
    }
}
