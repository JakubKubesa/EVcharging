package com.example.evcharging.controller;

import com.example.evcharging.model.User;
import com.example.evcharging.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Registration
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setRole(User.Role.USER);
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    // Login
    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {
        User existingUser = userRepository.findByEmail(loginRequest.getEmail());
        if (existingUser != null &&
                passwordEncoder.matches(loginRequest.getPasswordHash(), existingUser.getPasswordHash())) {
            return existingUser;
        }
        throw new RuntimeException("Invalid credentials");
    }
}
