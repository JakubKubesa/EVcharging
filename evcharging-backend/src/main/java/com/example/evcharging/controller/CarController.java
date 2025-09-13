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

    // add car to user
    @PostMapping("/add/{userId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public Car addCar(@PathVariable Long userId, @RequestBody CarRequest carRequest) {
        System.out.println("Received car request: " + carRequest.getSpz() + ", "
                + carRequest.getBatteryCapacityKwh() + ", " + carRequest.getModel());
        System.out.println("For user ID: " + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    // get car by id
    @GetMapping("/{carId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public Car getCarById(@PathVariable Long carId) {
        return carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));
    }


    // get all cars from the user
    @GetMapping("/user/{userId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<Car> getCarsForUser(@PathVariable Long userId) {
        return carRepository.findByUserId(userId);
    }

    // delete car
    @DeleteMapping("/{carId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public void deleteCar(@PathVariable Long carId) {
        carRepository.deleteById(carId);
    }
}
