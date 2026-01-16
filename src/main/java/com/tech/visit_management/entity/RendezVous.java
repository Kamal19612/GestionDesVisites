package com.tech.visit_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import com.tech.visit_management.enums.TypeRendezVous;
import com.tech.visit_management.enums.StatutRendezVous;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

/**
 * Entité représentant une demande de rendez-vous.
 */
@Entity
@Table(name = "RENDEZ_VOUS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVous {

    /**
     * Identifiant unique du rendez-vous.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rdv_seq_gen")
    @SequenceGenerator(name = "rdv_seq_gen", sequenceName = "rdv_seq", allocationSize = 1)
    private Long id;

    /**
     * Le visiteur ayant demandé le rendez-vous.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visiteur_id", nullable = false)
    private Visiteurs visiteur;

    /**
     * Date prévue du rendez-vous.
     */
    @Column(nullable = false)
    private LocalDate date;

    /**
     * Heure prévue du rendez-vous.
     */
    @Column(name = "heure", nullable = false)
    private LocalTime heure;

    /**
     * Motif du rendez-vous.
     */
    private String motif;

    /**
     * Type de rendez-vous (DIRECT, PLANIFIE).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeRendezVous type;

    /**
     * Statut actuel du rendez-vous (EN_ATTENTE, VALIDE, REFUSE).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutRendezVous statut;

    /**
     * Code unique pour ce rendez-vous (utilisé pour validation/QR).
     */
    @Column(unique = true)
    private String code;

    /**
     * Date de création de la demande.
     */
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /**
     * La visite associée à ce rendez-vous (une fois validé ou réalisé).
     */
    @OneToOne(mappedBy = "rendezVous", cascade = CascadeType.ALL)
    private Visites visite;
}
