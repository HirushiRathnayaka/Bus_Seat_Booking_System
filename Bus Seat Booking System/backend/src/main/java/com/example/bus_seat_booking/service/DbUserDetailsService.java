package com.example.bus_seat_booking.service;

import com.example.bus_seat_booking.model.User;
import com.example.bus_seat_booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DbUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {

        String key = (input == null) ? "" : input.trim();

        Optional<User> opt = userRepository.findByUsernameIgnoreCase(key);
        if (opt.isEmpty()) opt = userRepository.findByEmailIgnoreCase(key);

        User u = opt.orElseThrow(() -> new UsernameNotFoundException("User not found: " + key));

        String role = (u.getRole() == null || u.getRole().isBlank())
                ? "USER"
                : u.getRole().toUpperCase();

        if (role.startsWith("ROLE_")) role = role.substring(5);

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }
}
