package com.tech.visit_management.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tech.visit_management.dto.RendezVousDto;
import com.tech.visit_management.entity.RendezVous;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.entity.Visites;
import com.tech.visit_management.entity.Visiteurs;
import com.tech.visit_management.enums.Role;
import com.tech.visit_management.enums.StatutRendezVous;
import com.tech.visit_management.enums.TypeNotification;
import com.tech.visit_management.enums.TypeRendezVous;
import com.tech.visit_management.mapper.RendezVousMapper;
import com.tech.visit_management.repository.RendezVousRepository;
import com.tech.visit_management.repository.VisiteursRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final VisiteursRepository visiteursRepository;
    private final VisiteService visiteService;
    private final NotificationService notificationService;
    private final RendezVousMapper rendezVousMapper;

    /**
     * Crée un rendez-vous planifié (par un visiteur).
     */
    @Transactional
    public RendezVousDto createRendezVousPlanifie(RendezVousDto rdvDto, Users userVisiteur) {
        // Vérifier que l'utilisateur est bien un visiteur
        if (userVisiteur.getRole() != Role.VISITEUR) {
            throw new AccessDeniedException("Seul un visiteur peut demander un rendez-vous planifié.");
        }

        Visiteurs visiteur = visiteursRepository.findAll().stream()
                .filter(v -> v.getUser().getId().equals(userVisiteur.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Profil visiteur introuvable pour cet utilisateur"));

        RendezVous rdv = rendezVousMapper.toEntity(rdvDto, visiteur);
        rdv.setType(TypeRendezVous.PLANIFIE);
        rdv.setStatut(StatutRendezVous.EN_ATTENTE);
        rdv.setCode(UUID.randomUUID().toString().substring(0, 8)); // Code simple

        rdv = rendezVousRepository.save(rdv);
        return rendezVousMapper.toDto(rdv);
    }

    /**
     * Valide un rendez-vous (par une secrétaire).
     */
    @Transactional
    public RendezVousDto validerRendezVous(Long rdvId, Users secretaire) {
        if (secretaire.getRole() != Role.SECRETAIRE) {
            throw new AccessDeniedException("Seule une secrétaire peut valider un rendez-vous.");
        }

        RendezVous rdv = rendezVousRepository.findById(rdvId)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));

        if (rdv.getStatut() != StatutRendezVous.EN_ATTENTE) {
            throw new IllegalStateException("Le rendez-vous n'est pas en attente.");
        }

        rdv.setStatut(StatutRendezVous.VALIDE);
        rdv = rendezVousRepository.save(rdv);

        // Création de la visite associée (statut PLANIFIE)
        Visites visite = visiteService.createVisiteForRendezVous(rdv, null);

        // Notification au visiteur
        notificationService.envoyerNotification(
                rdv.getVisiteur().getUser(),
                "Votre rendez-vous a été validé. Code : " + rdv.getCode(),
                TypeNotification.EMAIL,
                visite
        );

        return rendezVousMapper.toDto(rdv);
    }

    /**
     * Refuse un rendez-vous (par une secrétaire).
     */
    @Transactional
    public RendezVousDto refuserRendezVous(Long rdvId, Users secretaire) {
        if (secretaire.getRole() != Role.SECRETAIRE) {
            throw new AccessDeniedException("Seule une secrétaire peut refuser un rendez-vous.");
        }

        RendezVous rdv = rendezVousRepository.findById(rdvId)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));

        rdv.setStatut(StatutRendezVous.REFUSE);
        rdv = rendezVousRepository.save(rdv);

        // Notification
        notificationService.envoyerNotification(
                rdv.getVisiteur().getUser(),
                "Votre demande de rendez-vous a été refusée.",
                TypeNotification.EMAIL,
                null
        );

        return rendezVousMapper.toDto(rdv);
    }

    /**
     * Crée un rendez-vous direct (par un agent de sécurité).
     */
    @Transactional
    public RendezVousDto createRendezVousDirect(RendezVousDto rdvDto, Users agent) {
        if (agent.getRole() != Role.AGENT) {
            throw new AccessDeniedException("Seul un agent peut créer un rendez-vous direct.");
        }

        // On suppose que le visiteur existe déjà ou est créé à la volée (flux complexe, simplifié ici)
        // Ici on prend l'ID du visiteur du DTO
        Visiteurs visiteur = visiteursRepository.findById(rdvDto.getVisiteurId())
                .orElseThrow(() -> new RuntimeException("Visiteur introuvable"));

        RendezVous rdv = rendezVousMapper.toEntity(rdvDto, visiteur);
        rdv.setType(TypeRendezVous.DIRECT);
        rdv.setStatut(StatutRendezVous.VALIDE);
        rdv.setCode(UUID.randomUUID().toString()); // Code généré

        rdv = rendezVousRepository.save(rdv);

        // Création immédiate de la visite (EN_COURS)
        Visites visite = visiteService.createVisiteForRendezVous(rdv, agent);

        // Notification
        notificationService.envoyerNotification(
                visiteur.getUser(),
                "Bienvenue. Votre visite commence.",
                TypeNotification.SMS, // Exemple
                visite
        );

        return rendezVousMapper.toDto(rdv);
    }

    /**
     * Récupère la liste des rendez-vous validés du jour pour un employé.
     */
    public List<RendezVous> getRendezVousDuJourPourEmploye() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_EMPLOYE") || a.getAuthority().equals("EMPLOYE"))) {
            throw new AccessDeniedException("Accès refusé.");
        }
        return rendezVousRepository.findByStatutAndDate(StatutRendezVous.VALIDE, LocalDate.now());
    }

    public List<RendezVousDto> getRendezVousEnAttente() {
        return rendezVousRepository.findByStatut(StatutRendezVous.EN_ATTENTE).stream()
                .map(rendezVousMapper::toDto)
                .toList();
    }

    public List<RendezVousDto> getRendezVousPourVisiteurConnecte() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return rendezVousRepository.findByVisiteur_User_Email(email).stream()
                .map(rendezVousMapper::toDto)
                .toList();
    }
}
