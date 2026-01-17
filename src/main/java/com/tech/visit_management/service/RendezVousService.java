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
import com.tech.visit_management.repository.UsersRepository;
import com.tech.visit_management.repository.VisiteursRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final VisiteursRepository visiteursRepository;
    private final UsersRepository usersRepository;
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

        // Mise à jour du téléphone si fourni
        if (rdvDto.getWhatsapp() != null && !rdvDto.getWhatsapp().trim().isEmpty()) {
            userVisiteur.setTelephone(rdvDto.getWhatsapp());
            userVisiteur = usersRepository.save(userVisiteur);
        }

        Users finalUser = userVisiteur; // For lambda
        Visiteurs visiteur = visiteursRepository.findAll().stream()
                .filter(v -> v.getUser().getId().equals(finalUser.getId()))
                .findFirst()
                .orElseGet(() -> {
                    // Auto-recovery: Créer le profil s'il manque
                    Visiteurs newVisiteur = Visiteurs.builder()
                            .user(finalUser)
                            .build();
                    return visiteursRepository.save(newVisiteur);
                });

        if (rdvDto.getPieceIdentite() != null && !rdvDto.getPieceIdentite().isEmpty()) {
            visiteur.setNumeroPieceIdentite(rdvDto.getPieceIdentite());
            visiteur = visiteursRepository.save(visiteur);
        }

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

        Visiteurs visiteur;

        // Case 1: Visiteur ID is provided (Known visitor)
        if (rdvDto.getVisiteurId() != null) {
            visiteur = visiteursRepository.findById(rdvDto.getVisiteurId())
                    .orElseThrow(() -> new RuntimeException("Visiteur introuvable"));
        } // Case 2: No ID, but Email provided (Check existence or Create)
        else if (rdvDto.getEmail() != null && !rdvDto.getEmail().isEmpty()) {
            final String email = rdvDto.getEmail();
            Users user = usersRepository.findByEmail(email).orElseGet(() -> {
                // Create new User
                // Split Name
                String fullName = rdvDto.getVisitorName() != null ? rdvDto.getVisitorName() : "Visiteur";
                String[] parts = fullName.split(" ", 2);
                String prenom = parts[0];
                String nom = parts.length > 1 ? parts[1] : "-";

                Users newUser = Users.builder()
                        .nom(nom)
                        .prenom(prenom)
                        .email(email)
                        .telephone(rdvDto.getWhatsapp())
                        .motDePasse(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("123456")) // Default password
                        .role(Role.VISITEUR)
                        .build();
                return usersRepository.save(newUser);
            });

            // Ensure Visiteur profile exists
            Users finalUser = user;
            visiteur = visiteursRepository.findAll().stream()
                    .filter(v -> v.getUser().getId().equals(finalUser.getId()))
                    .findFirst()
                    .orElseGet(() -> {
                        Visiteurs newV = Visiteurs.builder().user(finalUser).build();
                        return visiteursRepository.save(newV);
                    });
        } // Case 3: Anonymous or No Email (Create generic/placeholder User if possible, OR fail)
        // For strict compliance, we require at least a name to create a dummy user? 
        // Let's create a dummy user based on timestamp to avoid collision if email is empty
        else {
            String dummyEmail = "visitor_" + System.currentTimeMillis() + "@walkin.com";

            String fullName = rdvDto.getVisitorName() != null ? rdvDto.getVisitorName() : "Inconnu";
            String[] parts = fullName.split(" ", 2);
            String prenom = parts[0];
            String nom = parts.length > 1 ? parts[1] : "-";

            Users newUser = Users.builder()
                    .nom(nom)
                    .prenom(prenom)
                    .email(dummyEmail)
                    .telephone(rdvDto.getWhatsapp())
                    .motDePasse(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("123456"))
                    .role(Role.VISITEUR)
                    .build();
            newUser = usersRepository.save(newUser);
            visiteur = Visiteurs.builder().user(newUser).build();
            visiteur = visiteursRepository.save(visiteur);

        }

        if (rdvDto.getPieceIdentite() != null && !rdvDto.getPieceIdentite().isEmpty()) {
            visiteur.setNumeroPieceIdentite(rdvDto.getPieceIdentite());
            visiteur = visiteursRepository.save(visiteur);
        }

        RendezVous rdv = rendezVousMapper.toEntity(rdvDto, visiteur);
        rdv.setType(TypeRendezVous.DIRECT);
        rdv.setStatut(StatutRendezVous.VALIDE);
        rdv.setCode(UUID.randomUUID().toString().substring(0, 8)); // Code
        // Ensure critical fields are set if DTO missed them
        if (rdv.getDate() == null) {
            rdv.setDate(LocalDate.now());
        }
        if (rdv.getHeure() == null) {
            rdv.setHeure(java.time.LocalTime.now());
        }

        rdv = rendezVousRepository.save(rdv);

        // Création immédiate de la visite (EN_COURS)
        Visites visite = visiteService.createVisiteForRendezVous(rdv, agent);

        // Notification (Opt)
        if (visiteur.getUser().getEmail() != null && !visiteur.getUser().getEmail().contains("@walkin.com")) {
            try {
                notificationService.envoyerNotification(
                        visiteur.getUser(),
                        "Bienvenue. Votre visite commence.",
                        TypeNotification.EMAIL,
                        visite
                );
            } catch (Exception e) {
                // Ignore notification errors for walk-ins
            }
        }

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

    /**
     * Tâche planifiée : Archive les rendez-vous validés mais non honorés (date
     * passée). S'exécute tous les jours à minuit.
     */
    @org.springframework.scheduling.annotation.Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void archiveExpiredAppointments() {
        List<RendezVous> expired = rendezVousRepository.findAll().stream()
                .filter(r -> r.getStatut() == StatutRendezVous.VALIDE && r.getDate().isBefore(LocalDate.now()))
                .toList();

        expired.forEach(r -> {
            r.setStatut(StatutRendezVous.ARCHIVE);
            rendezVousRepository.save(r);
        });

        if (!expired.isEmpty()) {
            System.out.println("Auto-Archiving: " + expired.size() + " expired appointments processed.");
        }
    }
}
