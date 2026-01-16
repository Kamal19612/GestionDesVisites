package com.tech.visit_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tech.visit_management.entity.Visiteurs;

public interface VisiteursRepository extends JpaRepository<Visiteurs, Long> {
}
