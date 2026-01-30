package com.example.bus_seat_booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bus")
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String busNumber;
    private String travelDate;
    private String departureTime;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    // Default constructor
    public Bus() {}

    // Constructor with parameters
    public Bus(String busNumber, String travelDate, String departureTime, Route route) {
        this.busNumber = busNumber;
        this.travelDate = travelDate;
        this.departureTime = departureTime;
        this.route = route;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public String getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(String travelDate) {
        this.travelDate = travelDate;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }
}