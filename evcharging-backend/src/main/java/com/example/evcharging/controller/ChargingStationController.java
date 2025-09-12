package com.example.evcharging.controller;

import com.example.evcharging.model.ChargingStation;
import com.example.evcharging.repository.ChargingStationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class ChargingStationController {

    private final ChargingStationRepository stationRepository;

    public ChargingStationController(ChargingStationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    @GetMapping
    public List<ChargingStation> getAllStations() {
        return stationRepository.findAll();
    }

    @PostMapping
    public ChargingStation createStation(@RequestBody ChargingStation station) {
        return stationRepository.save(station);
    }
}
