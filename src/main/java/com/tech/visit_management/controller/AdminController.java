package com.tech.visit_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.dto.UserDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.enums.Role;
import com.tech.visit_management.mapper.UserMapper;
import com.tech.visit_management.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        // Encodage du mot de passe
        userDto.setMotDePasse(passwordEncoder.encode(userDto.getMotDePasse()));

        // Création avec rôle ADMIN pour permettre la création de tous les types de comptes
        Users createdUser = userService.createUser(userDto, Role.ADMIN);

        return ResponseEntity.ok(userMapper.toDto(createdUser));
    }
}
