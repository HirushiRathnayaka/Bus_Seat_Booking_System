package com.example.bus_seat_booking.controller;

import com.example.bus_seat_booking.model.Ticket;
import com.example.bus_seat_booking.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {
    @Autowired
    private TicketService ticketService;

    // MyProfile - tickets list with bookingid
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> myTickets(@PathVariable Long userId) {

        List<Ticket> tickets = ticketService.getUserTickets(userId);
        List<Map<String, Object>> out = new ArrayList<>();

        for (Ticket t : tickets) {
            Map<String, Object> m = new LinkedHashMap<>();

            m.put("id", t.getId());                 // ticket id
            m.put("ticketNo", t.getTicketNo());
            m.put("seatNumber", t.getSeatNumber());
            m.put("busNumber", t.getBusNumber());
            m.put("passengerName", t.getPassengerName());


            // status from booking
            m.put(
                    "status",
                    t.getBooking() != null && t.getBooking().getStatus() != null
                            ? t.getBooking().getStatus().name()
                            : "CONFIRMED"
            );

            // bookingId for cancel
            m.put(
                    "bookingId",
                    t.getBooking() != null ? t.getBooking().getId() : null
            );

            out.add(m);
        }

        return ResponseEntity.ok(out);
    }
    // Ticket view by ticketNo
    @GetMapping("/no/{ticketNo}")
    public ResponseEntity<?> byTicketNo(@PathVariable String ticketNo) {
        return ResponseEntity.ok(ticketService.getByTicketNo(ticketNo));
    }
}

