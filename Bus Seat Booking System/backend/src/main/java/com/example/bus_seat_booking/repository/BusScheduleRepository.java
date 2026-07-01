package com.example.bus_seat_booking.repository;

import com.example.bus_seat_booking.model.BusSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long> {
    List<BusSchedule> findByRouteIdAndBusId(Long routeId, Long busId);

    void deleteByRouteIdAndBusId(Long routeId, Long busId);

    long countByRouteIdAndBusId(Long routeId, Long busId);
}

