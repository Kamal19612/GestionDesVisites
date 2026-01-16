package com.tech.visit_management.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.dto.UserDto;
import com.tech.visit_management.security.JwtService;
import com.tech.visit_management.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(authService.registerVisitor(userDto));
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        log.info("Tentative de connexion pour : {}", email);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            log.info("Authentification réussie pour {}", email);

            String token = jwtService.generateToken(authentication);
            log.debug("Token généré avec succès");
            return Map.of("token", token);
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.error("Echec authentification pour {}: {}", email, e.getMessage());
            throw e;
        }
    }

}
