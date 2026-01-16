package com.tech.visit_management.mapper;

import org.springframework.stereotype.Component;

import com.tech.visit_management.dto.NotificationDto;
import com.tech.visit_management.entity.Notifications;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notifications notif) {
        if (notif == null) {
            return null;
        }
        return NotificationDto.builder()
                .id(notif.getId())
                .userId(notif.getUtilisateur() != null ? notif.getUtilisateur().getId() : null)
                .visiteId(notif.getVisite() != null ? notif.getVisite().getId() : null)
                .type(notif.getType())
                .message(notif.getMessage())
                .statut(notif.getStatut())
                .dateEnvoi(notif.getDateEnvoi())
                .build();
    }
}
