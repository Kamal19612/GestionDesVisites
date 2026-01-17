package com.tech.visit_management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisiteurProfileDto {

    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String entreprise;
    private String plaqueImmatriculation;
}
