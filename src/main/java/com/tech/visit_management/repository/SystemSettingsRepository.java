package com.tech.visit_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tech.visit_management.entity.SystemSettings;

public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {
}
