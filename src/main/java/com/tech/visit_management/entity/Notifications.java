package com.tech.visit_management.entity;

import java.time.LocalDateTime;

import com.tech.visit_management.enums.TypeNotification;

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
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité représentant une notification envoyée.
 */
@Entity
@Table(name = "NOTIFICATIONS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notifications {

    /**
     * Identifiant unique de la notification.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notif_seq_gen")
    @SequenceGenerator(name = "notif_seq_gen", sequenceName = "notif_seq", allocationSize = 1)
    private Long id;

    /**
     * L'utilisateur destinataire de la notification.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users utilisateur;

    /**
     * La visite concernée par cette notification.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visite_id")
    private Visites visite;

    /**
     * Type de notification (EMAIL, SMS).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotification type;

    /**
     * Contenu du message envoyé.
     */
    @Column(nullable = false)
    private String message;

    /**
     * Statut de l'envoi (ex: ENVOYE, ECHEC).
     */
    private String statut;

    /**
     * Date et heure d'envoi.
     */
    private LocalDateTime dateEnvoi;
}
