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
}
