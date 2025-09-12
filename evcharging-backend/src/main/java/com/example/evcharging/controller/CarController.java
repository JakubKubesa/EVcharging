package com.example.evcharging.controller;

import com.example.evcharging.model.Car;
import com.example.evcharging.model.User;
import com.example.evcharging.repository.CarRepository;
import com.example.evcharging.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import com.example.evcharging.dto.CarRequest;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:3000")
public class CarController {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CarController(CarRepository carRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    // přidání auta k uživateli
    @PostMapping("/add/{userId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public Car addCar(@PathVariable Long userId, @RequestBody CarRequest carRequest) {
        System.out.println("Received car request: " + carRequest.getSpz() + ", "
                + carRequest.getBatteryCapacityKwh() + ", " + carRequest.getModel());
        System.out.println("For user ID: " + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // vytvoření Car i s modelem
        Car car = new Car(
                carRequest.getSpz(),
                carRequest.getBatteryCapacityKwh(),
                carRequest.getModel()
        );
        car.setUser(user);

        Car savedCar = carRepository.save(car);
        System.out.println("Saved car with ID: " + savedCar.getId());

        return savedCar;
    }

    // získání všech aut jednoho uživatele
    @GetMapping("/user/{userId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<Car> getCarsForUser(@PathVariable Long userId) {
        return carRepository.findByUserId(userId);
    }

    // smazání auta
    @DeleteMapping("/{carId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public void deleteCar(@PathVariable Long carId) {
        carRepository.deleteById(carId);
    }
}
