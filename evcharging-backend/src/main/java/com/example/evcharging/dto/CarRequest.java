package com.example.evcharging.dto;

public class CarRequest {
    private String spz;
    private int batteryCapacityKwh;
    private String model;

    public CarRequest() {}

    public CarRequest(String spz, int batteryCapacityKwh, String model) {
        this.spz = spz;
        this.batteryCapacityKwh = batteryCapacityKwh;
        this.model = model;
    }


    public String getSpz() { return spz; }
    public void setSpz(String spz) { this.spz = spz; }

    public int getBatteryCapacityKwh() { return batteryCapacityKwh; }
    public void setBatteryCapacityKwh(int batteryCapacityKwh) { this.batteryCapacityKwh = batteryCapacityKwh; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
}
