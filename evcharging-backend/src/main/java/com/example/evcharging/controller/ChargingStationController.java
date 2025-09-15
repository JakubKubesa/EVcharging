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

    @PostMapping("/api/reservations")
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {

        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                reservation.getStation().getId(),
                reservation.getStartTime(),
                reservation.getEndTime()
        );

        if (!overlapping.isEmpty()) {
            // log do konzole
            System.out.println("Reservation conflict: overlaps with existing reservation(s)");
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Station is already reserved in this time range");
        }

        Reservation saved = reservationRepository.save(reservation);
        return ResponseEntity.ok(saved);
    }

}
