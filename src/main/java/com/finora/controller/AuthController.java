package com.finora.controller;

import com.finora.dto.request.LoginRequest;
import com.finora.dto.request.RegisterRequest;
import com.finora.dto.response.AuthResponse;
import com.finora.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // JWT is stateless, so we cannot easily invalidate it on the server side without a blacklist.
        // We instruct the client to remove the token.
        return ResponseEntity.ok("Logged out successfully. Please remove your token on the client side.");
    }
}
