package com.tech.visit_management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisiteurDto {

    private Long id;
    private UserDto user; // Composition: contient les infos de base (nom, email, etc.)
    private String type;
    private String scanDocument;
}
