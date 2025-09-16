package com.example.evcharging.controller;

import com.example.evcharging.model.Reservation;
import com.example.evcharging.repository.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationRepository.findById(id);
        return reservation
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Reservation not found"));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        if (!reservationRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Reservation not found");
        }
        reservationRepository.deleteById(id);
        return ResponseEntity.ok("Reservation deleted successfully");
    }
}
