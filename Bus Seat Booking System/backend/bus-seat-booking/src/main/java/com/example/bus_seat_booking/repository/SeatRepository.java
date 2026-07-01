package com.example.bus_seat_booking.repository;

import com.example.bus_seat_booking.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    //route/ bus view (user side)
    List<Seat> findByBusId(Long busId);
    List<Seat> findByBusIdAndBookedFalse(Long busId);

    // admin side mark seats model
    List<Seat> findByReservedTrue();
    List<Seat> findByReservedFalse();

    boolean existsByBusId(Long busId);



}
