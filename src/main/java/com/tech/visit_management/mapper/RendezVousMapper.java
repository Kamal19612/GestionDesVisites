package com.tech.visit_management.mapper;

import org.springframework.stereotype.Component;

import com.tech.visit_management.dto.RendezVousDto;
import com.tech.visit_management.entity.RendezVous;
import com.tech.visit_management.entity.Visiteurs;

@Component
public class RendezVousMapper {

    public RendezVousDto toDto(RendezVous rdv) {
        if (rdv == null) {
            return null;
        }
        return RendezVousDto.builder()
                .id(rdv.getId())
                .visiteurId(rdv.getVisiteur() != null ? rdv.getVisiteur().getId() : null)
                .visiteurNom(rdv.getVisiteur() != null && rdv.getVisiteur().getUser() != null
                        ? rdv.getVisiteur().getUser().getNom() + " " + rdv.getVisiteur().getUser().getPrenom() : "")
                .date(rdv.getDate())
                .heure(rdv.getHeure())
                .motif(rdv.getMotif())
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
                .type(dto.getType())
                .statut(dto.getStatut())
                .code(dto.getCode())
                .build();
    }
}
