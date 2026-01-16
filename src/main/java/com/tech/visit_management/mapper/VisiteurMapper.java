package com.tech.visit_management.mapper;

import org.springframework.stereotype.Component;

import com.tech.visit_management.dto.VisiteurDto;
import com.tech.visit_management.entity.Visiteurs;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VisiteurMapper {

    private final UserMapper userMapper;

    public VisiteurDto toDto(Visiteurs visiteur) {
        if (visiteur == null) {
            return null;
        }
        return VisiteurDto.builder()
                .id(visiteur.getId())
                .user(userMapper.toDto(visiteur.getUser()))
                .type(visiteur.getType())
                .scanDocument(visiteur.getScanDocument())
                .build();
    }

    public Visiteurs toEntity(VisiteurDto dto) {
        if (dto == null) {
            return null;
        }
        return Visiteurs.builder()
                .id(dto.getId())
                .user(userMapper.toEntity(dto.getUser()))
                .type(dto.getType())
                .scanDocument(dto.getScanDocument())
                .build();
    }
}
