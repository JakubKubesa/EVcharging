package com.example.evcharging.dto;

public class CarRequest {
    private String spz;
    private int batteryCapacityKwh;

    public CarRequest() {} // prázdný konstruktor nutný pro Jackson

    public CarRequest(String spz, int batteryCapacityKwh) {
        this.spz = spz;
        this.batteryCapacityKwh = batteryCapacityKwh;
    }

    // --- Gettery a settery ---
    public String getSpz() { return spz; }
    public void setSpz(String spz) { this.spz = spz; }

    public int getBatteryCapacityKwh() { return batteryCapacityKwh; }
    public void setBatteryCapacityKwh(int batteryCapacityKwh) { this.batteryCapacityKwh = batteryCapacityKwh; }
}
