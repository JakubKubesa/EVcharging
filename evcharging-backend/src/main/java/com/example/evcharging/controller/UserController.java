package com.example.evcharging.controller;

import com.example.evcharging.model.User;
import com.example.evcharging.repository.UserRepository;
import com.example.evcharging.repository.CarRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;
    private final CarRepository carRepository;

    public UserController(UserRepository userRepository, CarRepository carRepository) {
        this.userRepository = userRepository;
        this.carRepository = carRepository;
    }

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteUser(@PathVariable Long id, @RequestParam Long requesterId) {
        if (id.equals(requesterId)) {
            throw new RuntimeException("Cannot delete yourself");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Cannot delete another admin");
        }

        // delete user cars
        carRepository.deleteAllByUser(user);

        // delete user
        userRepository.delete(user);
    }

}
