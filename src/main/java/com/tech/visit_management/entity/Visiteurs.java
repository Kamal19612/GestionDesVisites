package com.tech.visit_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Entité représentant un visiteur (extension de l'utilisateur).
 */
@Entity
@Table(name = "VISITEURS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visiteurs {

    /**
     * Identifiant unique du visiteur.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "visiteurs_seq_gen")
    @SequenceGenerator(name = "visiteurs_seq_gen", sequenceName = "visiteurs_seq", allocationSize = 1)
    private Long id;

    /**
     * L'utilisateur associé à ce profil visiteur.
     */
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private Users user;

    /**
     * Type de visiteur (ex: EXTERNE, PARTENAIRE, etc.) Ici stocké en String
     * comme simple attribut, ou via un Enum si spécifié.
     */
    private String type;

    /**
     * Lien ou référence vers le document scanné du visiteur.
     */
    private String scanDocument;

    /**
     * Liste des rendez-vous associés à ce visiteur.
     */
    @OneToMany(mappedBy = "visiteur", cascade = CascadeType.ALL)
    private List<RendezVous> rendezVousList;
}
