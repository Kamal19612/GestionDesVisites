package com.tech.visit_management.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tech.visit_management.dto.UserDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.enums.Role;
import com.tech.visit_management.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto registerVisitor(UserDto userDto) {
        // Enforce role VISITEUR
        userDto.setRole(Role.VISITEUR);
        // Encoder le mot de passe avant création
        userDto.setMotDePasse(passwordEncoder.encode(userDto.getMotDePasse()));

        // Création de l'utilisateur (UserService gère maintenant la création automatique du profil Visiteurs)
        Users user = userService.createUser(userDto, Role.VISITEUR);

        return userMapper.toDto(user);
    }

}
