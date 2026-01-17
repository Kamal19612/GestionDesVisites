package com.tech.visit_management.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.hibernate.annotations.CreationTimestamp;

import com.tech.visit_management.enums.StatutRendezVous;
import com.tech.visit_management.enums.TypeRendezVous;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
     * L'employé qui reçoit le visiteur.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employe_id")
    private Users employe;

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
     * Nom de la personne à rencontrer.
     */
    private String personneARencontrer;

    /**
     * Département de la personne à rencontrer.
     */
    private String departement;

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
