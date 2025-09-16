package com.example.evcharging.controller;

import com.example.evcharging.model.ChargingStation;
import com.example.evcharging.model.Reservation;
import com.example.evcharging.repository.ChargingStationRepository;
import com.example.evcharging.repository.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class ChargingStationController {

    private final ChargingStationRepository stationRepository;
    private final ReservationRepository reservationRepository;

    public ChargingStationController(ChargingStationRepository stationRepository,
                                     ReservationRepository reservationRepository) {
        this.stationRepository = stationRepository;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public List<ChargingStation> getAllStations() {
        return stationRepository.findAll();
    }

    @PostMapping
    public ChargingStation createStation(@RequestBody ChargingStation station) {
        return stationRepository.save(station);
    }

    @GetMapping("/available")
    public List<ChargingStation> getAvailableStations(@RequestParam("startTime") String startTimeString) {
        LocalDateTime startTime = LocalDateTime.parse(startTimeString);

        List<Long> busyStationIds = reservationRepository.findStationIdsWithReservationsAt(startTime);

        if (busyStationIds.isEmpty()) {
            return stationRepository.findAll();
        } else {
            return stationRepository.findByIdNotIn(busyStationIds);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStation(@PathVariable Long id) {
        if (!stationRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Station not found");
        }

        // Smazat všechny rezervace pro tuto stanici
        reservationRepository.deleteAll(
                reservationRepository.findByStationId(id)
        );

        // Smazat samotnou stanici
        stationRepository.deleteById(id);

        return ResponseEntity.ok("Station and related reservations deleted successfully");
    }



}
