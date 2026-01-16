package com.tech.visit_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.dto.RendezVousDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.service.RendezVousService;
import com.tech.visit_management.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/secretaire")
@RequiredArgsConstructor
public class SecretaireController {

    private final RendezVousService rendezVousService;
    private final UserService userService;

    @GetMapping("/rendezvous/en-attente")
    public ResponseEntity<List<RendezVousDto>> listerRendezVousEnAttente() {
        return ResponseEntity.ok(rendezVousService.getRendezVousEnAttente());
    }

    @PutMapping("/rendezvous/{id}/valider")
    public ResponseEntity<RendezVousDto> validerRendezVous(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users secretaire = userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Secrétaire non trouvée"));

        return ResponseEntity.ok(rendezVousService.validerRendezVous(id, secretaire));
    }

    @PutMapping("/rendezvous/{id}/refuser")
    public ResponseEntity<RendezVousDto> refuserRendezVous(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users secretaire = userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Secrétaire non trouvée"));

        return ResponseEntity.ok(rendezVousService.refuserRendezVous(id, secretaire));
    }
}
