package com.tech.visit_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tech.visit_management.entity.Visiteurs;

public interface VisiteursRepository extends JpaRepository<Visiteurs, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT v FROM Visiteurs v WHERE lower(v.user.nom) LIKE lower(concat('%', :query, '%')) OR lower(v.user.prenom) LIKE lower(concat('%', :query, '%')) OR lower(v.user.email) LIKE lower(concat('%', :query, '%'))")
    java.util.List<Visiteurs> search(@org.springframework.web.bind.annotation.RequestParam("query") String query);
}
