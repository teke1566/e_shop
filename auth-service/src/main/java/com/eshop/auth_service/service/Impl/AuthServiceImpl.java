package com.eshop.auth_service.service.Impl;


import com.eshop.auth_service.entity.Role;
import com.eshop.auth_service.entity.User;
import com.eshop.auth_service.payload.AuthResponse;
import com.eshop.auth_service.payload.LoginDto;
import com.eshop.auth_service.payload.RegisterDto;
import com.eshop.auth_service.repository.RoleRepository;
import com.eshop.auth_service.repository.UserRepository;
import com.eshop.auth_service.security.JwtTokenProvider;
import com.eshop.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;


    @Override
    public String register(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User();
        user.setName(registerDto.getName());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        // Check if admin role is requested (optional)
        Set<Role> roles = new HashSet<>();
        String requestedRole = registerDto.getRole(); // we’ll add this field below
        Role role = null;
        if (requestedRole != null && requestedRole.equalsIgnoreCase("ROLE_ADMIN")) {
            role = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Admin role not set."));
        } else {
            role = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("User role not set."));
        }
        roles.add(role);
        user.setRoles(roles);
        userRepository.save(user);

        return "User registered successfully with role: " + role.getName();
    }

    @Override
    public AuthResponse login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()
                ));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        // Extract role from authenticated user
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_USER");

        return new AuthResponse(token, role);
    }


}