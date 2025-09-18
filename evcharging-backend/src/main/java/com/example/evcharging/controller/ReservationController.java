package com.example.evcharging.controller;

import com.example.evcharging.model.Reservation;
import com.example.evcharging.repository.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getReservations(@RequestParam(required = false) Long userId) {
        List<Reservation> reservations = (userId != null)
                ? reservationRepository.findByUserId(userId)
                : reservationRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Reservation r : reservations) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("userId", r.getUser().getId());

            Map<String, Object> stationMap = new HashMap<>();
            stationMap.put("id", r.getStation().getId());
            stationMap.put("name", r.getStation().getName());
            map.put("station", stationMap);

            map.put("startTime", r.getStartTime());
            map.put("endTime", r.getEndTime());
            map.put("status", r.getStatus().name());
            result.add(map);
        }
        return result;
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
