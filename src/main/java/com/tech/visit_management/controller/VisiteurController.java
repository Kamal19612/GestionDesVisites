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

    @GetMapping("/rendezvous/{id}")
    public ResponseEntity<RendezVousDto> getRendezVous(@org.springframework.web.bind.annotation.PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(rendezVousService.getRendezVousById(id, user));
    }

    @org.springframework.web.bind.annotation.PutMapping("/rendezvous/{id}")
    public ResponseEntity<RendezVousDto> modifierRendezVous(@org.springframework.web.bind.annotation.PathVariable Long id, @RequestBody RendezVousDto rdvDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(rendezVousService.updateRendezVous(id, rdvDto, user));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/rendezvous/{id}")
    public ResponseEntity<Void> supprimerRendezVous(@org.springframework.web.bind.annotation.PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Users user = userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        rendezVousService.deleteRendezVous(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<com.tech.visit_management.dto.VisiteurProfileDto> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.getVisiteurProfile(auth.getName()));
    }

    @org.springframework.web.bind.annotation.PutMapping("/profile")
    public ResponseEntity<com.tech.visit_management.dto.VisiteurProfileDto> updateProfile(@RequestBody com.tech.visit_management.dto.VisiteurProfileDto profileDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.updateVisiteurProfile(auth.getName(), profileDto));
    }

    @GetMapping("/search")
    public ResponseEntity<List<com.tech.visit_management.dto.VisiteurProfileDto>> searchVisiteurs(@org.springframework.web.bind.annotation.RequestParam("q") String query) {
        // Idéalement sécurisé pour AGENT/SECRETAIRE/ADMIN
        return ResponseEntity.ok(userService.searchVisiteurs(query));
    }
}
