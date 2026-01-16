package com.tech.visit_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tech.visit_management.entity.Visites;
import com.tech.visit_management.enums.StatutVisite;

public interface VisitesRepository extends JpaRepository<Visites, Long> {

    List<Visites> findByStatut(StatutVisite statut);

    List<Visites> findByDate(LocalDate date);
}
