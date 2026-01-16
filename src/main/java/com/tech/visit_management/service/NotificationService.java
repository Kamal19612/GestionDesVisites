package com.tech.visit_management.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tech.visit_management.entity.Notifications;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.entity.Visites;
import com.tech.visit_management.enums.TypeNotification;
import com.tech.visit_management.repository.NotificationsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationsRepository notificationsRepository;

    @Transactional
    public void envoyerNotification(Users user, String message, TypeNotification type, Visites visite) {
        Notifications notification = Notifications.builder()
                .utilisateur(user)
                .message(message)
                .type(type)
                .visite(visite)
                .statut("ENVOYE")
                .dateEnvoi(LocalDateTime.now())
                .build();
        notificationsRepository.save(notification);
    }
}
