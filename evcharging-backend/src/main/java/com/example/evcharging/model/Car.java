package com.example.evcharging.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // více aut může patřit jednomu uživateli
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String spz;
    private int batteryCapacityKwh;

    // konstruktory
    public Car() {}

    public Car(User user, String spz, int batteryCapacityKwh) {
        this.user = user;
        this.spz = spz;
        this.batteryCapacityKwh = batteryCapacityKwh;
    }

    // V třídě Car přidej tento konstruktor
    public Car(String spz, int batteryCapacityKwh) {
        this.spz = spz;
        this.batteryCapacityKwh = batteryCapacityKwh;
    }

    // get/set
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSpz() { return spz; }
    public void setSpz(String spz) { this.spz = spz; }

    public int getBatteryCapacityKwh() { return batteryCapacityKwh; }
    public void setBatteryCapacityKwh(int batteryCapacityKwh) { this.batteryCapacityKwh = batteryCapacityKwh; }
}
