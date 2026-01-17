package com.tech.visit_management.service;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tech.visit_management.entity.RendezVous;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.entity.Visites;
import com.tech.visit_management.enums.StatutVisite;
import com.tech.visit_management.enums.TypeNotification;
import com.tech.visit_management.repository.VisitesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VisiteService {

    private final VisitesRepository visitesRepository;
    private final NotificationService notificationService;
    private final com.tech.visit_management.repository.RendezVousRepository rendezVousRepository;

    @Transactional
    public Visites demarrerVisite(Long rdvId) {
        RendezVous rdv = rendezVousRepository.findById(rdvId)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));

        Visites visite = rdv.getVisite();
        if (visite == null) {
            // Cas où la visite n'aurait pas été créée (ex: migration ?)
            throw new IllegalStateException("Aucune visite associée à ce rendez-vous.");
        }

        return enregistrerArrivee(visite);
    }

    // Correction de l'approche: VisiteService est appelé par RendezVousService pour créer la visite associée ?
    // Ou l'inverse ?
    // Règle: "Une visite DIRECTE peut être créée et démarrée par un AGENT"
    // Règle: " validation de rendez-vous" -> Notification.
    @Transactional
    public Visites createVisiteForRendezVous(RendezVous rdv, Users agent) {
        Visites visite = Visites.builder()
                .rendezVous(rdv)
                .date(rdv.getDate())
                .statut(StatutVisite.PLANIFIE)
                .agent(agent)
                .build();

        if (rdv.getType().name().equals("DIRECT")) {
            visite.setStatut(StatutVisite.EN_COURS);
            visite.setHeureArrivee(LocalTime.now());
        }

        return visitesRepository.save(visite);
    }

    @Transactional
    public Visites enregistrerArrivee(Visites visite) {
        visite.setHeureArrivee(LocalTime.now());
        visite.setStatut(StatutVisite.EN_COURS);
        visite = visitesRepository.save(visite);

        notificationService.envoyerNotification(
                visite.getRendezVous().getVisiteur().getUser(),
                "Votre visite a commencé.",
                TypeNotification.EMAIL,
                visite
        );
        return visite;
    }

    @Transactional
    public Visites enregistrerSortie(Long visiteId) {
        Visites visite = visitesRepository.findById(visiteId)
                .orElseThrow(() -> new RuntimeException("Visite non trouvée"));

        visite.setHeureSortie(LocalTime.now());
        visite.setStatut(StatutVisite.TERMINE);
        visite = visitesRepository.save(visite);

        notificationService.envoyerNotification(
                visite.getRendezVous().getVisiteur().getUser(),
                "Votre visite est terminée.",
                TypeNotification.EMAIL,
                visite
        );
        return visite;
    }

    public java.util.List<Visites> getVisitesActives() {
        return visitesRepository.findAll().stream()
                .filter(v -> v.getStatut() == StatutVisite.EN_COURS)
                .toList();
    }

    public Visites getVisiteEntityById(Long id) {
        return visitesRepository.findById(id).orElseThrow(() -> new RuntimeException("Visite non trouvée"));
    }

    public java.util.List<Visites> getAllVisitesHistorique() {
        return visitesRepository.findAll();
    }

    public java.util.List<Visites> getVisitesByDate(LocalDate date) {
        return visitesRepository.findByDate(date);
    }
}
