package com.tech.visit_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.entity.SystemSettings;
import com.tech.visit_management.service.SystemSettingsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public/settings")
@RequiredArgsConstructor
public class PublicSettingsController {

    private final SystemSettingsService service;

    @GetMapping
    public ResponseEntity<SystemSettings> getPublicSettings() {
        return ResponseEntity.ok(service.getSettings());
    }
}
