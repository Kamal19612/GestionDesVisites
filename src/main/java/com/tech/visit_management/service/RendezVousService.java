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
                .orElseGet(() -> {
                    // Auto-recovery: Créer le profil s'il manque
                    Visiteurs newVisiteur = Visiteurs.builder()
                            .user(userVisiteur)
                            .build();
                    return visiteursRepository.save(newVisiteur);
                });

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
    public RendezVousDto validerRendezVous(Long rdvId, Users user) {
        if (user.getRole() != Role.SECRETAIRE && user.getRole() != Role.ADMIN && user.getRole() != Role.AGENT) {
            throw new AccessDeniedException("Vous n'avez pas les droits pour valider un rendez-vous.");
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
    public RendezVousDto refuserRendezVous(Long rdvId, Users user) {
        if (user.getRole() != Role.SECRETAIRE && user.getRole() != Role.ADMIN && user.getRole() != Role.AGENT) {
            throw new AccessDeniedException("Vous n'avez pas les droits pour refuser un rendez-vous.");
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
        if (authentication == null) {
            throw new AccessDeniedException("Non authentifié");
        }

        // Find employee by email
        // Note: We need to inject UserService or Repository to find ID.
        // Assuming we can lookup by email from authentication name.
        // But for cleaner logic, let's assume we find the user first.
        // Since I don't have UserService injected here yet, I should add it or use repo.
        return rendezVousRepository.findAll().stream() // Inefficient, better use Repository Query
                .filter(r -> r.getStatut() == StatutRendezVous.VALIDE
                && r.getDate().equals(LocalDate.now())
                && r.getEmploye() != null
                && r.getEmploye().getEmail().equals(authentication.getName()))
                .toList();
    }

    public List<RendezVous> getRendezVousAVenirPourEmploye() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new AccessDeniedException("Non authentifié");
        }

        return rendezVousRepository.findAll().stream()
                .filter(r -> r.getStatut() == StatutRendezVous.VALIDE
                && r.getDate().isAfter(LocalDate.now())
                && r.getEmploye() != null
                && r.getEmploye().getEmail().equals(authentication.getName()))
                .toList();
    }

    public List<RendezVousDto> getRendezVousEnAttente() {
        return rendezVousRepository.findByStatut(StatutRendezVous.EN_ATTENTE).stream()
                .map(rendezVousMapper::toDto)
                .toList();
    }

    /**
     * Modifie un rendez-vous (par un visiteur).
     */
    @Transactional
    public RendezVousDto updateRendezVous(Long id, RendezVousDto dto, Users userVisiteur) {
        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));

        // Vérifier que c'est bien le créateur
        if (!rdv.getVisiteur().getUser().getId().equals(userVisiteur.getId())) {
            throw new AccessDeniedException("Vous ne pouvez modifier que vos propres rendez-vous.");
        }

        // Vérifier le statut
        if (rdv.getStatut() != StatutRendezVous.EN_ATTENTE) {
            throw new IllegalStateException("Seuls les rendez-vous en attente peuvent être modifiés.");
        }

        // Mise à jour des champs
        if (dto.getDate() != null) {
            rdv.setDate(dto.getDate());
        }
        if (dto.getHeure() != null) {
            rdv.setHeure(dto.getHeure());
        }
        if (dto.getMotif() != null) {
            rdv.setMotif(dto.getMotif());
        }
        if (dto.getPersonneARencontrer() != null) {
            rdv.setPersonneARencontrer(dto.getPersonneARencontrer());
        }
        if (dto.getDepartement() != null) {
            rdv.setDepartement(dto.getDepartement());
        }

        rdv = rendezVousRepository.save(rdv);
        return rendezVousMapper.toDto(rdv);
    }

    /**
     * Supprime (annule) un rendez-vous (par un visiteur).
     */
    @Transactional
    public void deleteRendezVous(Long id, Users userVisiteur) {
        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));

        if (!rdv.getVisiteur().getUser().getId().equals(userVisiteur.getId())) {
            throw new AccessDeniedException("Vous ne pouvez supprimer que vos propres rendez-vous.");
        }

        if (rdv.getStatut() != StatutRendezVous.EN_ATTENTE) {
            throw new IllegalStateException("Impossible de supprimer un rendez-vous déjà traité ou passé.");
        }

        rendezVousRepository.delete(rdv);
    }

    public RendezVousDto getRendezVousById(Long id, Users userVisiteur) {
        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));

        if (!rdv.getVisiteur().getUser().getId().equals(userVisiteur.getId())) {
            throw new AccessDeniedException("Accès refusé.");
        }
        return rendezVousMapper.toDto(rdv);
    }

    public List<RendezVousDto> getRendezVousPourVisiteurConnecte() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return rendezVousRepository.findByVisiteur_User_Email(email).stream()
                .map(rendezVousMapper::toDto)
                .toList();
    }

    public List<RendezVousDto> getAllRendezVous() {
        return rendezVousRepository.findAll().stream()
                .map(rendezVousMapper::toDto)
                .toList();
    }

    public List<RendezVous> getRendezVousHistoriquePourEmploye() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Assuming email lookup works
        return rendezVousRepository.findAll().stream()
                .filter(r -> r.getEmploye() != null
                && r.getEmploye().getEmail().equals(authentication.getName())
                && r.getDate().isBefore(LocalDate.now()))
                .toList();
    }

    public java.util.Map<String, Object> getStatistiquesEmploye() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<RendezVous> all = rendezVousRepository.findAll().stream()
                .filter(r -> r.getEmploye() != null && r.getEmploye().getEmail().equals(authentication.getName()))
                .toList();

        long total = all.size();
        long pending = all.stream().filter(r -> r.getStatut() == StatutRendezVous.EN_ATTENTE).count();
        long validated = all.stream().filter(r -> r.getStatut() == StatutRendezVous.VALIDE).count();

        return java.util.Map.of(
                "total", total,
                "pending", pending,
                "validated", validated
        );
    }

    // Generic getter used by Secretaire / Admin (Secured in Controller)
    public RendezVousDto getRendezVousById(Long id) {
        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
        return rendezVousMapper.toDto(rdv);
    }

    // For Secretary: All appointments today
    public List<RendezVousDto> getTousLesRendezVousAujourdhui() {
        return rendezVousRepository.findAll().stream()
                .filter(r -> r.getStatut() == StatutRendezVous.VALIDE
                && r.getDate().equals(LocalDate.now()))
                .map(rendezVousMapper::toDto)
                .toList();
    }

    public RendezVousDto getRendezVousByCode(String code) {
        RendezVous rdv = rendezVousRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Code invalide ou expiré : " + code));
        return rendezVousMapper.toDto(rdv);
    }
}
