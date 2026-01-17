package com.tech.visit_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.tech.visit_management.entity.Users;
import com.tech.visit_management.enums.Role;
import com.tech.visit_management.repository.UsersRepository;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
public class GestionDesVisitesApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionDesVisitesApplication.class, args);
    }

    @Bean
    public CommandLineRunner createDefaultAdmin(@Autowired UsersRepository userRepository,
            @Autowired PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "admin@example.com";
            if (userRepository.findByEmail(email).isEmpty()) {
                Users admin = Users.builder()
                        .nom("User")
                        .prenom("Admin")
                        .email(email)
                        .motDePasse(passwordEncoder.encode("Password123!"))
                        .role(Role.ADMIN)
                        .actif(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Default admin created: email=" + email + " password=Password123!");
            }
        };
    }

    @Bean
    public CommandLineRunner createDefaultSecretary(@Autowired UsersRepository userRepository,
            @Autowired PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "secretaire@example.com";
            if (userRepository.findByEmail(email).isEmpty()) {
                Users secretaire = Users.builder()
                        .nom("User")
                        .prenom("Secretary")
                        .email(email)
                        .motDePasse(passwordEncoder.encode("Password123!"))
                        .role(Role.SECRETAIRE)
                        .actif(true)
                        .build();
                userRepository.save(secretaire);
                System.out.println("Default secretary created: email=" + email + " password=Password123!");
            }
        };
    }

    @Bean
    public CommandLineRunner createDefaultAgent(@Autowired UsersRepository userRepository,
            @Autowired PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "agent@example.com";
            if (userRepository.findByEmail(email).isEmpty()) {
                Users agent = Users.builder()
                        .nom("User")
                        .prenom("Agent")
                        .email(email)
                        .motDePasse(passwordEncoder.encode("Password123!"))
                        .role(Role.AGENT)
                        .actif(true)
                        .build();
                userRepository.save(agent);
                System.out.println("Default agent created: email=" + email + " password=Password123!");
            }
        };
    }

    @Bean
    public CommandLineRunner createDefaultEmployee(@Autowired UsersRepository userRepository,
            @Autowired PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "employe@example.com";
            if (userRepository.findByEmail(email).isEmpty()) {
                Users employe = Users.builder()
                        .nom("User")
                        .prenom("Employee")
                        .email(email)
                        .motDePasse(passwordEncoder.encode("Password123!"))
                        .role(Role.EMPLOYE)
                        .actif(true)
                        .build();
                userRepository.save(employe);
                System.out.println("Default employee created: email=" + email + " password=Password123!");
            }
        };
    }

    @Bean
    public CommandLineRunner createDefaultVisitor(@Autowired UsersRepository userRepository,
            @Autowired PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "user@example.com";
            if (userRepository.findByEmail(email).isEmpty()) {
                Users visiteur = Users.builder()
                        .nom("User")
                        .prenom("Default")
                        .email(email)
                        .motDePasse(passwordEncoder.encode("Password123!"))
                        .role(Role.VISITEUR)
                        .actif(true)
                        .build();
                userRepository.save(visiteur);
                System.out.println("Default user created: email=" + email + " password=Password123!");
            }
        };
    }
}
