package com.example.bus_seat_booking.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminTestController {

    @GetMapping("/hello")
    public String hello() {
        return "Admin access OK!";
    }
}
