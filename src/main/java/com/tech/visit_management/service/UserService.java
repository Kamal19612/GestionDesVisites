package com.tech.visit_management.service;

import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tech.visit_management.dto.UserDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.enums.Role;
import com.tech.visit_management.mapper.UserMapper;
import com.tech.visit_management.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UsersRepository usersRepository;
    private final com.tech.visit_management.repository.VisiteursRepository visiteursRepository;
    private final UserMapper userMapper;

    @Transactional
    public Users createUser(UserDto userDto, Role creatorRole) {
        // Validation des droits : seul un ADMIN peut créer les rôles autres que VISITEUR
        if (userDto.getRole() != Role.VISITEUR) {
            if (creatorRole != Role.ADMIN) {
                throw new AccessDeniedException("Seul un administrateur peut créer des comptes non-visiteurs.");
            }
        }

        Users user = userMapper.toEntity(userDto);
        // Ici on pourrait encoder le mot de passe si on avait le PasswordEncoder
        // user.setMotDePasse(passwordEncoder.encode(userDto.getMotDePasse()));
        user = usersRepository.save(user);

        // Si le rôle est VISITEUR, créer automatiquement le profil Visiteurs
        if (user.getRole() == Role.VISITEUR) {
            com.tech.visit_management.entity.Visiteurs visiteur = com.tech.visit_management.entity.Visiteurs.builder()
                    .user(user)
                    .build();
            visiteursRepository.save(visiteur);
        }

        return user;
    }

    public Optional<Users> findByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    public com.tech.visit_management.dto.VisiteurProfileDto getVisiteurProfile(String email) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getRole() != Role.VISITEUR) {
            throw new AccessDeniedException("Ce profil ne correspond pas à un visiteur.");
        }

        com.tech.visit_management.entity.Visiteurs visiteur = visiteursRepository.findAll().stream()
                .filter(v -> v.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElse(null);

        return com.tech.visit_management.dto.VisiteurProfileDto.builder()
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .telephone(user.getTelephone())
                .entreprise(visiteur != null ? visiteur.getEntreprise() : null)
                .plaqueImmatriculation(visiteur != null ? visiteur.getPlaqueImmatriculation() : null)
                .build();
    }

    @Transactional
    public com.tech.visit_management.dto.VisiteurProfileDto updateVisiteurProfile(String email, com.tech.visit_management.dto.VisiteurProfileDto dto) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Update User info
        if (dto.getNom() != null) {
            user.setNom(dto.getNom());
        }
        if (dto.getPrenom() != null) {
            user.setPrenom(dto.getPrenom());
        }
        // Email update might required re-verification, skipping for now or handle carefully
        if (dto.getTelephone() != null) {
            user.setTelephone(dto.getTelephone());
        }

        user = usersRepository.save(user);

        final Long userId = user.getId();
        com.tech.visit_management.entity.Visiteurs visiteur = visiteursRepository.findAll().stream()
                .filter(v -> v.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Détails visiteur introuvables"));

        if (dto.getEntreprise() != null) {
            visiteur.setEntreprise(dto.getEntreprise());
        }
        if (dto.getPlaqueImmatriculation() != null) {
            visiteur.setPlaqueImmatriculation(dto.getPlaqueImmatriculation());
        }

        visiteursRepository.save(visiteur);

        return getVisiteurProfile(email);
    }

    public java.util.List<com.tech.visit_management.dto.VisiteurProfileDto> searchVisiteurs(String query) {
        return visiteursRepository.search(query).stream()
                .map(v -> com.tech.visit_management.dto.VisiteurProfileDto.builder()
                .nom(v.getUser().getNom())
                .prenom(v.getUser().getPrenom())
                .email(v.getUser().getEmail())
                .telephone(v.getUser().getTelephone())
                .entreprise(v.getEntreprise())
                .plaqueImmatriculation(v.getPlaqueImmatriculation())
                .build())
                .toList();
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (userDto.getNom() != null) {
            user.setNom(userDto.getNom());
        }
        if (userDto.getPrenom() != null) {
            user.setPrenom(userDto.getPrenom());
        }
        if (userDto.getEmail() != null) {
            user.setEmail(userDto.getEmail());
        }
        if (userDto.getTelephone() != null) {
            user.setTelephone(userDto.getTelephone());
        }
        // Password handling should be done in Controller with Encoder, or passed here encoded.
        // For simplicity, we assume Controller handles encoding if present, or we skip if null.
        if (userDto.getMotDePasse() != null && !userDto.getMotDePasse().isEmpty()) {
            user.setMotDePasse(userDto.getMotDePasse());
        }
        if (userDto.getRole() != null) {
            user.setRole(userDto.getRole());
        }

        return userMapper.toDto(usersRepository.save(user));
    }

    public java.util.List<UserDto> findAllVisiteurs() {
        return usersRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.VISITEUR)
                .map(userMapper::toDto)
                .toList();
    }

    public java.util.List<UserDto> findAllEmployes() {
        return usersRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.EMPLOYE || u.getRole() == Role.SECRETAIRE || u.getRole() == Role.AGENT || u.getRole() == Role.ADMIN)
                .map(userMapper::toDto)
                .toList();
    }

}
