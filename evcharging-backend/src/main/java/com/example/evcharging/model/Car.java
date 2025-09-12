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

    private String model; // <-- nový atribut

    // konstruktory
    public Car() {}

    public Car(User user, String spz, int batteryCapacityKwh, String model) {
        this.user = user;
        this.spz = spz;
        this.batteryCapacityKwh = batteryCapacityKwh;
        this.model = model;
    }

    public Car(String spz, int batteryCapacityKwh, String model) {
        this.spz = spz;
        this.batteryCapacityKwh = batteryCapacityKwh;
        this.model = model;
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

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
}
