package com.tech.visit_management.dto;

import java.time.LocalDateTime;

import com.tech.visit_management.enums.TypeNotification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private Long id;
    private Long userId;
    private Long visiteId;
    private TypeNotification type;
    private String message;
    private String statut;
    private LocalDateTime dateEnvoi;
}
