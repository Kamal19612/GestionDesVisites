package com.tech.visit_management.mapper;

import org.springframework.stereotype.Component;

import com.tech.visit_management.dto.VisiteDto;
import com.tech.visit_management.entity.Visites;

@Component
public class VisiteMapper {

    public VisiteDto toDto(Visites visite) {
        if (visite == null) {
            return null;
        }
        return VisiteDto.builder()
                .id(visite.getId())
                .rendezVousId(visite.getRendezVous() != null ? visite.getRendezVous().getId() : null)
                .date(visite.getDate())
                .heureArrivee(visite.getHeureArrivee())
                .heureSortie(visite.getHeureSortie())
                .statut(visite.getStatut())
                .agentId(visite.getAgent() != null ? visite.getAgent().getId() : null)
                .agentNom(visite.getAgent() != null ? visite.getAgent().getNom() + " " + visite.getAgent().getPrenom() : "")
                .build();
    }
}
