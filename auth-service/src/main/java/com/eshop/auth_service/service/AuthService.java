package com.eshop.auth_service.service;


import com.eshop.auth_service.payload.LoginDto;
import com.eshop.auth_service.payload.RegisterDto;

public interface AuthService {
    String login(LoginDto loginDto);
    String register(RegisterDto registerDto);
}

