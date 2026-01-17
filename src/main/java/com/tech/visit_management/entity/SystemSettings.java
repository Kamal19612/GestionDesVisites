package com.tech.visit_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SYSTEM_SETTINGS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "organization_name")
    private String organizationName;

    private String timezone;

    @Column(name = "two_factor_enabled")
    private boolean twoFactorEnabled;

    @Column(name = "session_timeout_enabled")
    private boolean sessionTimeoutEnabled;

    @Column(name = "session_timeout_minutes")
    private Integer sessionTimeoutMinutes;

    @Column(name = "welcome_title")
    private String welcomeTitle;

    @Column(name = "welcome_subtitle")
    private String welcomeSubtitle;

    @Column(name = "welcome_description", length = 1000)
    private String welcomeDescription;

    @Column(name = "copyright_text")
    private String copyrightText;

    @Column(name = "support_contact")
    private String supportContact; // Email or Link

    @Column(name = "help_center_url")
    private String helpCenterUrl;
}
