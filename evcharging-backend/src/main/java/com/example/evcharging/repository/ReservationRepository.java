package com.example.evcharging.repository;

import com.example.evcharging.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r.station.id FROM Reservation r " +
            "WHERE :startTime BETWEEN r.startTime AND r.endTime")
    List<Long> findStationIdsWithReservationsAt(@Param("startTime") LocalDateTime startTime);

    @Query("SELECT r FROM Reservation r " +
            "WHERE r.station.id = :stationId " +
            "AND :startTime < r.endTime " +
            "AND :endTime > r.startTime")
    List<Reservation> findOverlappingReservations(
            @Param("stationId") Long stationId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId")
    List<Reservation> findByUserId(@Param("userId") Long userId);


    @Query("SELECT r FROM Reservation r WHERE r.station.id = :stationId")
    List<Reservation> findByStationId(@Param("stationId") Long stationId);

}
