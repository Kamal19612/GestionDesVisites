package com.tech.visit_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.dto.UserDto;
import com.tech.visit_management.entity.Users;
import com.tech.visit_management.enums.Role;
import com.tech.visit_management.mapper.UserMapper;
import com.tech.visit_management.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final com.tech.visit_management.repository.UsersRepository usersRepository;
    private final com.tech.visit_management.repository.VisitesRepository visitesRepository;
    private final com.tech.visit_management.repository.RendezVousRepository rendezVousRepository;
    private final com.tech.visit_management.mapper.VisiteMapper visiteMapper;

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        // Encodage du mot de passe
        userDto.setMotDePasse(passwordEncoder.encode(userDto.getMotDePasse()));

        // Création avec rôle ADMIN pour permettre la création de tous les types de comptes
        Users createdUser = userService.createUser(userDto, Role.ADMIN);

        return ResponseEntity.ok(userMapper.toDto(createdUser));
    }

    @org.springframework.web.bind.annotation.GetMapping("/users")
    public ResponseEntity<org.springframework.data.domain.Page<UserDto>> getAllUsers(org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(usersRepository.findAll(pageable)
                .map(userMapper::toDto));
    }

    @org.springframework.web.bind.annotation.GetMapping("/stats")
    public ResponseEntity<com.tech.visit_management.dto.AdminStatsDto> getStats() {
        long totalUsers = usersRepository.count();
        long activeVisits = visitesRepository.findAll().stream()
                .filter(v -> v.getStatut() == com.tech.visit_management.enums.StatutVisite.EN_COURS)
                .count(); // Better to use countBy...
        long visitsToday = visitesRepository.findAll().stream()
                .filter(v -> v.getDate().equals(java.time.LocalDate.now()))
                .count();
        long pending = rendezVousRepository.findByStatut(com.tech.visit_management.enums.StatutRendezVous.EN_ATTENTE).size();

        java.util.List<com.tech.visit_management.dto.VisiteDto> recent = visitesRepository.findTop5ByOrderByDateDescHeureArriveeDesc()
                .stream()
                .map(visiteMapper::toDto)
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(com.tech.visit_management.dto.AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .activeVisits(activeVisits)
                .totalVisitsToday(visitsToday)
                .pendingAppointments(pending)
                .recentActivity(recent)
                .build());
    }

    @org.springframework.web.bind.annotation.GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUser(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return usersRepository.findById(id)
                .map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Note: Update and Delete might need proper service methods in UserService to ensure consistency, 
    // but for now utilizing Repository directly or creating Service methods is okay.
    // Given time constraints, I'll assume we can use repository for simple ops or check UserService.
    // UserService has createUser but not updateUser generic.
    // Let's add simple Delete. Update is more complex (password etc).
    @org.springframework.web.bind.annotation.PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@org.springframework.web.bind.annotation.PathVariable Long id, @RequestBody UserDto userDto) {
        // Idéalement on utilise le Service pour tout
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@org.springframework.web.bind.annotation.PathVariable Long id) {
        usersRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
