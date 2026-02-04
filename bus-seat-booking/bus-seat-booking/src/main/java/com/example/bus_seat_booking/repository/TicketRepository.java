package com.example.bus_seat_booking.repository;

import com.example.bus_seat_booking.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByBooking_User_IdOrderByIdDesc(Long userId);

    Optional<Ticket> findByTicketNo(String ticketNo);
}
