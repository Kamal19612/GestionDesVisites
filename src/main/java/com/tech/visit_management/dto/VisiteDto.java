package com.tech.visit_management.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.tech.visit_management.enums.StatutVisite;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisiteDto {

    private Long id;
    private Long rendezVousId;
    private LocalDate date;
    private LocalTime heureArrivee;
    private LocalTime heureSortie;
    private StatutVisite statut;
    private Long agentId;
    private String agentNom; // Pour affichage
    private String visitorName;
    private String visitorPhone;
    private String visitorEmail;
    private String hostName; // Personne à rencontrer
    private String motif;
    private String departement;
}
