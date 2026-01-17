package com.tech.visit_management.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.tech.visit_management.enums.StatutRendezVous;
import com.tech.visit_management.enums.TypeRendezVous;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousDto {

    private Long id;
    private Long visiteurId;
    private String visitorName; // Renamed from visiteurNom
    private String email;
    private String whatsapp;
    private LocalDate date;
    private LocalTime heure;
    private String motif;
    private String personneARencontrer;
    private String departement;
    private TypeRendezVous type;
    private StatutRendezVous statut;
    private String code;
}
