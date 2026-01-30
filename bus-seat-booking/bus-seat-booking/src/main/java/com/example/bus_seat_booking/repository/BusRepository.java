package com.example.bus_seat_booking.repository;

import com.example.bus_seat_booking.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByRouteId(Long routeId);
}