package com.tech.visit_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tech.visit_management.entity.Notifications;

public interface NotificationsRepository extends JpaRepository<Notifications, Long> {
}
