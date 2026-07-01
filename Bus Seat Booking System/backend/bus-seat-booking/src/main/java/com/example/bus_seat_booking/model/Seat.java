package com.example.bus_seat_booking.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "seat",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"bus_id", "seatNumber"})
        }
)
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private boolean reserved = false; // admin reserved/cancel

    @Column(nullable = false)
    private boolean booked = false; // user booking

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    public Seat() {}

    public Seat(String seatNumber, Bus bus) {
        this.seatNumber = seatNumber;
        this.bus = bus;
        this.reserved = false;
        this.booked = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public boolean isReserved() {return reserved;}

    public void setReserved(boolean reserved) {this.reserved = reserved;}

    public boolean isBooked() {
        return booked;
    }

    public void setBooked(boolean booked) {
        this.booked = booked;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }
}