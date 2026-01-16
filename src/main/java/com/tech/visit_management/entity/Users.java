package com.tech.visit_management.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.tech.visit_management.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité représentant un utilisateur du système.
 */
@Entity
@Table(name = "USERS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {

    /**
     * Identifiant unique de l'utilisateur.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq_gen")
    @SequenceGenerator(name = "users_seq_gen", sequenceName = "users_seq", allocationSize = 1)
    private Long id;

    /**
     * Nom de l'utilisateur.
     */
    @Column(nullable = false)
    private String nom;

    /**
     * Prénom de l'utilisateur.
     */
    @Column(nullable = false)
    private String prenom;

    /**
     * Adresse email de l'utilisateur, doit être unique.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * Mot de passe de l'utilisateur.
     */
    @Column(nullable = false)
    private String motDePasse;

    /**
     * Rôle de l'utilisateur dans le système.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * Indique si le compte utilisateur est actif.
     */
    @Column(nullable = false)
    @Builder.Default
    private boolean actif = true;

    /**
     * Date et heure de création de l'enregistrement.
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Relation vers le visiteur associé (si le rôle est VISITEUR).
     * Bidirectionnel optionnel, mais utile pour l'accès complet.
     */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Visiteurs visiteur;

    /**
     * Liste des visites gérées par cet utilisateur (si c'est un AGENT ou un
     * SECRETAIRE).
     */
    @OneToMany(mappedBy = "agent")
    private List<Visites> visitesGerees;
}
