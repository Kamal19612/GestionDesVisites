package com.tech.visit_management.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tech.visit_management.entity.SystemSettings;
import com.tech.visit_management.repository.SystemSettingsRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SystemSettingsService {

    private final SystemSettingsRepository repository;

    public SystemSettings getSettings() {
        return repository.findAll().stream().findFirst().orElseGet(() -> {
            // Default settings
            return repository.save(SystemSettings.builder()
                    .organizationName("My Organization")
                    .timezone("GMT+01:00")
                    .twoFactorEnabled(false)
                    .sessionTimeoutEnabled(true)
                    .sessionTimeoutMinutes(240) // 4 hours
                    .welcomeTitle("L'accueil de vos")
                    .welcomeSubtitle("visiteurs réinventé")
                    .welcomeDescription("Optimisez la gestion de vos flux, renforcez la sécurité de vos locaux et offrez une expérience premium dès l'entrée de vos bâtiments.")
                    .copyrightText("© " + java.time.Year.now().getValue() + " NativIA — VisitePulse. Tous droits réservés.")
                    .supportContact("contact@visitepulse.com")
                    .helpCenterUrl("https://help.visitepulse.com")
                    .build());
        });
    }

    @Transactional
    public SystemSettings updateSettings(SystemSettings newSettings) {
        SystemSettings current = getSettings();
        if (newSettings.getOrganizationName() != null) {
            current.setOrganizationName(newSettings.getOrganizationName());
        }
        if (newSettings.getTimezone() != null) {
            current.setTimezone(newSettings.getTimezone());
        }
        current.setTwoFactorEnabled(newSettings.isTwoFactorEnabled());
        current.setSessionTimeoutEnabled(newSettings.isSessionTimeoutEnabled());
        if (newSettings.getSessionTimeoutMinutes() != null) {
            current.setSessionTimeoutMinutes(newSettings.getSessionTimeoutMinutes());
        }
        if (newSettings.getWelcomeTitle() != null) {
            current.setWelcomeTitle(newSettings.getWelcomeTitle());
        }
        if (newSettings.getWelcomeSubtitle() != null) {
            current.setWelcomeSubtitle(newSettings.getWelcomeSubtitle());
        }
        if (newSettings.getWelcomeDescription() != null) {
            current.setWelcomeDescription(newSettings.getWelcomeDescription());
        }
        if (newSettings.getCopyrightText() != null) {
            current.setCopyrightText(newSettings.getCopyrightText());
        }
        if (newSettings.getSupportContact() != null) {
            current.setSupportContact(newSettings.getSupportContact());
        }
        if (newSettings.getHelpCenterUrl() != null) {
            current.setHelpCenterUrl(newSettings.getHelpCenterUrl());
        }

        return repository.save(current);
    }
}
