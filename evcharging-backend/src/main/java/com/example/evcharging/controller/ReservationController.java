package com.example.evcharging.controller;

import com.example.evcharging.model.Reservation;
import com.example.evcharging.repository.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                reservation.getStation().getId(),
                reservation.getStartTime(),
                reservation.getEndTime()
        );

        if (!overlapping.isEmpty()) {
            System.out.println("Reservation conflict: overlaps with existing reservation(s)");
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Station is already reserved in this time range");
        }

        Reservation saved = reservationRepository.save(reservation);
        return ResponseEntity.ok(saved);
    }
}
