package com.tech.visit_management.mapper;

import org.springframework.stereotype.Component;

import com.tech.visit_management.dto.RendezVousDto;
import com.tech.visit_management.entity.RendezVous;
import com.tech.visit_management.entity.Visiteurs;

@Component
public class RendezVousMapper {
    // Mapper for RendezVous entity to DTO

    public RendezVousDto toDto(RendezVous rdv) {
        if (rdv == null) {
            return null;
        }
        return RendezVousDto.builder()
                .id(rdv.getId())
                .visiteurId(rdv.getVisiteur() != null ? rdv.getVisiteur().getId() : null)
                .visitorName(rdv.getVisiteur() != null && rdv.getVisiteur().getUser() != null
                        ? rdv.getVisiteur().getUser().getNom() + " " + rdv.getVisiteur().getUser().getPrenom() : "")
                .email(rdv.getVisiteur() != null && rdv.getVisiteur().getUser() != null ? rdv.getVisiteur().getUser().getEmail() : "")
                .whatsapp(rdv.getVisiteur() != null && rdv.getVisiteur().getUser() != null ? rdv.getVisiteur().getUser().getTelephone() : "")
                .date(rdv.getDate())
                .heure(rdv.getHeure())
                .motif(rdv.getMotif())
                .personneARencontrer(rdv.getPersonneARencontrer())
                .departement(rdv.getDepartement())
                .type(rdv.getType())
                .statut(rdv.getStatut())
                .code(rdv.getCode())
                .build();
    }

    public RendezVous toEntity(RendezVousDto dto, Visiteurs visiteur) {
        if (dto == null) {
            return null;
        }
        return RendezVous.builder()
                .id(dto.getId())
                .visiteur(visiteur)
                .date(dto.getDate())
                .heure(dto.getHeure())
                .motif(dto.getMotif())
                .personneARencontrer(dto.getPersonneARencontrer())
                .departement(dto.getDepartement())
                .type(dto.getType())
                .statut(dto.getStatut())
                .code(dto.getCode())
                .build();
    }
}
