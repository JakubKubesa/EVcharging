package com.example.evcharging.model;

import jakarta.persistence.*;

@Entity
@Table(name = "charging_stations")
public class ChargingStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int powerKw;
    private boolean active = true;

    public ChargingStation() {}

    public ChargingStation(String name, int powerKw, boolean active) {
        this.name = name;
        this.powerKw = powerKw;
        this.active = active;
    }

    // get/set
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getPowerKw() { return powerKw; }
    public void setPowerKw(int powerKw) { this.powerKw = powerKw; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
