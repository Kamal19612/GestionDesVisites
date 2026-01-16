package com.tech.visit_management.service;

import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tech.visit_management.dto.UserDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.enums.Role;
import com.tech.visit_management.mapper.UserMapper;
import com.tech.visit_management.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UsersRepository usersRepository;
    private final UserMapper userMapper;

    @Transactional
    public Users createUser(UserDto userDto, Role creatorRole) {
        // Validation des droits : seul un ADMIN peut créer les rôles autres que VISITEUR
        if (userDto.getRole() != Role.VISITEUR) {
            if (creatorRole != Role.ADMIN) {
                throw new AccessDeniedException("Seul un administrateur peut créer des comptes non-visiteurs.");
            }
        }

        Users user = userMapper.toEntity(userDto);
        // Ici on pourrait encoder le mot de passe si on avait le PasswordEncoder
        // user.setMotDePasse(passwordEncoder.encode(userDto.getMotDePasse()));
        return usersRepository.save(user);
    }

    public Optional<Users> findByEmail(String email) {
        return usersRepository.findByEmail(email);
    }
}
