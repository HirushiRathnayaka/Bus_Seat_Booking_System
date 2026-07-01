package com.example.bus_seat_booking.service;

import com.example.bus_seat_booking.model.Ticket;
import com.example.bus_seat_booking.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    public List<Ticket> getUserTickets(Long userId) {
        return ticketRepository.findByBooking_User_IdOrderByIdDesc(userId);
    }

    public Ticket getByTicketNo(String ticketNo) {
        return ticketRepository.findByTicketNo(ticketNo)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketNo));
    }

}
