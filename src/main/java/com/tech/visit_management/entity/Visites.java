package com.tech.visit_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.tech.visit_management.enums.StatutVisite;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Entité représentant une visite effective (liée à un rendez-vous).
 */
@Entity
@Table(name = "VISITES")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visites {

    /**
     * Identifiant unique de la visite.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "visites_seq_gen")
    @SequenceGenerator(name = "visites_seq_gen", sequenceName = "visites_seq", allocationSize = 1)
    private Long id;

    /**
     * Le rendez-vous associé à cette visite.
     */
    @OneToOne
    @JoinColumn(name = "rendez_vous_id", referencedColumnName = "id", nullable = false)
    private RendezVous rendezVous;

    /**
     * Date effective de la visite.
     */
    @Column(nullable = false)
    private LocalDate date;

    /**
     * Heure d'arrivée effective du visiteur.
     */
    private LocalTime heureArrivee;

    /**
     * Heure de sortie effective du visiteur.
     */
    private LocalTime heureSortie;

    /**
     * Statut de la visite (PLANIFIE, EN_COURS, TERMINE, ANNULE).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutVisite statut;

    /**
     * L'agent ayant géré ou enregistré cette visite (Check-in/Check-out).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private Users agent;

    /**
     * Notifications liées à cette visite.
     */
    @OneToMany(mappedBy = "visite", cascade = CascadeType.ALL)
    private List<Notifications> notifications;
}
