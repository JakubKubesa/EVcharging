package com.example.evcharging.dto;

public class CarRequest {
    private String spz;
    private int batteryCapacityKwh;
    private String model; // <-- nový atribut

    public CarRequest() {} // prázdný konstruktor nutný pro Jackson

    public CarRequest(String spz, int batteryCapacityKwh, String model) {
        this.spz = spz;
        this.batteryCapacityKwh = batteryCapacityKwh;
        this.model = model;
    }

    // --- Gettery a settery ---
    public String getSpz() { return spz; }
    public void setSpz(String spz) { this.spz = spz; }

    public int getBatteryCapacityKwh() { return batteryCapacityKwh; }
    public void setBatteryCapacityKwh(int batteryCapacityKwh) { this.batteryCapacityKwh = batteryCapacityKwh; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
}
