package com.tech.visit_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.dto.RendezVousDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.service.RendezVousService;
import com.tech.visit_management.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/visiteur")
@RequiredArgsConstructor
public class VisiteurController {

    private final RendezVousService rendezVousService;
    private final UserService userService;

    @PostMapping("/rendezvous")
    public ResponseEntity<RendezVousDto> demanderRendezVous(@RequestBody RendezVousDto rdvDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(rendezVousService.createRendezVousPlanifie(rdvDto, user));
    }

    @GetMapping("/rendezvous")
    public ResponseEntity<List<RendezVousDto>> listerMesRendezVous() {
        return ResponseEntity.ok(rendezVousService.getRendezVousPourVisiteurConnecte());
    }
}
