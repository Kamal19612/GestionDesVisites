package com.tech.visit_management.controller;

import java.util.HashMap;
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
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.mapper.UserMapper;
import com.tech.visit_management.security.JwtService;
import com.tech.visit_management.service.AuthService;
import com.tech.visit_management.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(authService.registerVisitor(userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        log.info("Tentative de connexion pour : {}", email);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            log.info("Authentification réussie pour {}", email);

            String token = jwtService.generateToken(authentication);

            Users user = userService.findByEmail(email).orElseThrow();
            UserDto userDto = userMapper.toDto(user);
            userDto.setMotDePasse(null); // Ne pas renvoyer le hash du mot de passe

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userDto);

            return ResponseEntity.ok(response);
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.error("Echec authentification pour {}: {}", email, e.getMessage());
            throw e;
        }
    }

}
