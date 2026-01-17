package com.tech.visit_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tech.visit_management.entity.SystemSettings;
import com.tech.visit_management.service.SystemSettingsService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
public class SystemSettingsController {

    private final SystemSettingsService service;

    @GetMapping
    public ResponseEntity<SystemSettings> getSettings() {
        return ResponseEntity.ok(service.getSettings());
    }

    @PutMapping
    public ResponseEntity<SystemSettings> updateSettings(@RequestBody SystemSettings settings) {
        return ResponseEntity.ok(service.updateSettings(settings));
    }
}
