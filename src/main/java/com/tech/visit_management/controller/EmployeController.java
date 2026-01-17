package com.tech.visit_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.dto.RendezVousDto;
import com.tech.visit_management.mapper.RendezVousMapper;
import com.tech.visit_management.service.RendezVousService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/employe")
@RequiredArgsConstructor
public class EmployeController {

    private final RendezVousService rendezVousService;
    private final RendezVousMapper rendezVousMapper;

    @GetMapping("/rendezvous/aujourdhui")
    public ResponseEntity<List<RendezVousDto>> getRendezVousDuJour() {
        return ResponseEntity.ok(rendezVousService.getRendezVousDuJourPourEmploye()
                .stream()
                .map(rendezVousMapper::toDto)
                .toList());
    }

    @GetMapping("/rendezvous/a-venir")
    public ResponseEntity<List<RendezVousDto>> getRendezVousAVenir() {
        return ResponseEntity.ok(rendezVousService.getRendezVousAVenirPourEmploye()
                .stream()
                .map(rendezVousMapper::toDto)
                .toList());
    }

    @GetMapping("/rendezvous/{id}")
    public ResponseEntity<RendezVousDto> getRendezVous(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return ResponseEntity.ok(rendezVousService.getRendezVousById(id));
    }

    @GetMapping("/rendezvous/historique")
    public ResponseEntity<List<RendezVousDto>> getHistorique() {
        return ResponseEntity.ok(rendezVousService.getRendezVousHistoriquePourEmploye().stream()
                .map(rendezVousMapper::toDto)
                .toList());
    }

    @GetMapping("/statistiques")
    public ResponseEntity<?> getMesStatistiques() {
        return ResponseEntity.ok(rendezVousService.getStatistiquesEmploye());
    }
}
