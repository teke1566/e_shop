package com.eshop.auth_service.service.Impl;


import com.eshop.auth_service.entity.Role;
import com.eshop.auth_service.entity.User;
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
    public String login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()
                ));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);
        return token;
    }

    @Override
    public String register(RegisterDto registerDto) {
        // add check for username exist in database
        if(userRepository.existsByUsername(registerDto.getUsername())){
            throw new RuntimeException("Username is already taken!" );
        }

        // add check for email exist in database
        if(userRepository.existsByEmail(registerDto.getEmail())){
            throw new RuntimeException("Email is already taken!" );
        }

        // new user object
        User user = new User();
        user.setName(registerDto.getName());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        // assign a role to the user
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("User Role not set."));
        roles.add(userRole);
        user.setRoles(roles);

        // save the user into database
        userRepository.save(user);
        return "User registered successfully";
    }
}
