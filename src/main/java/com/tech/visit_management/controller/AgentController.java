package com.tech.visit_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.dto.RendezVousDto;
import com.tech.visit_management.dto.VisiteDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.mapper.VisiteMapper;
import com.tech.visit_management.service.RendezVousService;
import com.tech.visit_management.service.UserService;
import com.tech.visit_management.service.VisiteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/agent")
@RequiredArgsConstructor
public class AgentController {

    private final RendezVousService rendezVousService;
    private final VisiteService visiteService;
    private final UserService userService;
    private final VisiteMapper visiteMapper;

    @PostMapping("/rendezvous/direct")
    public ResponseEntity<RendezVousDto> createRendezVousDirect(@RequestBody RendezVousDto rdvDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users agent = userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Agent non trouvé"));

        return ResponseEntity.ok(rendezVousService.createRendezVousDirect(rdvDto, agent));
    }

    @PostMapping("/visites/{id}/arrivee")
    public ResponseEntity<VisiteDto> enregistrerArrivee(@PathVariable Long id) { // id RendezVous ou id Visite ? Supposons ID RendezVous pour démarrer
        // Note: VisiteService demarrerVisite prend un ID de rendez-vous
        return ResponseEntity.ok(visiteMapper.toDto(visiteService.demarrerVisite(id)));
    }

    @PostMapping("/visites/{id}/sortie")
    public ResponseEntity<VisiteDto> enregistrerSortie(@PathVariable Long id) { // ID Visite ici
        return ResponseEntity.ok(visiteMapper.toDto(visiteService.enregistrerSortie(id)));
    }
}
