package com.example.evcharging.repository;

import com.example.evcharging.model.Car;
import com.example.evcharging.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByUserId(Long userId);
    void deleteAllByUser(User user);
}
