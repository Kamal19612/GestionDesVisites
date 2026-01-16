package com.tech.visit_management.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tech.visit_management.dto.UserDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.entity.Visiteurs;
import com.tech.visit_management.enums.Role;
import com.tech.visit_management.mapper.UserMapper;
import com.tech.visit_management.repository.VisiteursRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final VisiteursRepository visiteursRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto registerVisitor(UserDto userDto) {
        // Enforce role VISITEUR
        userDto.setRole(Role.VISITEUR);
        // Encoder le mot de passe avant création
        userDto.setMotDePasse(passwordEncoder.encode(userDto.getMotDePasse()));

        // Création de l'utilisateur (UserService gère la validation et sauvegarde)
        Users user = userService.createUser(userDto, Role.VISITEUR); // Role creator autogénéré ou null si public

        // Création du profil Visiteur associé
        Visiteurs visiteur = Visiteurs.builder()
                .user(user)
                // .type("EXTERNE") // Par défaut
                .build();

        visiteursRepository.save(visiteur);

        return userMapper.toDto(user);
    }

}
