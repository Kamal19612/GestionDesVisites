package com.tech.visit_management.dto;

import com.tech.visit_management.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private Role role;
    private boolean actif;
}
