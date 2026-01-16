package com.tech.visit_management.mapper;

import org.springframework.stereotype.Component;

import com.tech.visit_management.dto.UserDto;
import com.tech.visit_management.entity.Users;

@Component
public class UserMapper {

    public UserDto toDto(Users user) {
        if (user == null) {
            return null;
        }
        return UserDto.builder()
                .id(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .role(user.getRole())
                .actif(user.isActif())
                .build();
    }

    public Users toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }
        return Users.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .motDePasse(dto.getMotDePasse())
                .role(dto.getRole())
                .actif(dto.isActif())
                .build();
    }
}
