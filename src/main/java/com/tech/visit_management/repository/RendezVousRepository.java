package com.tech.visit_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tech.visit_management.entity.RendezVous;
import com.tech.visit_management.enums.StatutRendezVous;

public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {

    List<RendezVous> findByStatut(StatutRendezVous statut);

    List<RendezVous> findByVisiteurId(Long visiteurId);

    List<RendezVous> findByStatutAndDate(StatutRendezVous statut, LocalDate date);

    List<RendezVous> findByVisiteur_User_Email(String email);
}
