package com.tech.visit_management.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tech.visit_management.dto.VisiteDto;
import com.tech.visit_management.mapper.VisiteMapper;
import com.tech.visit_management.repository.VisitesRepository;

import lombok.RequiredArgsConstructor;
import lombok.Builder;
import lombok.Data;

@RestController
@RequestMapping("/api/v1/statistiques")
@RequiredArgsConstructor
public class StatistiqueController {

    private final VisitesRepository visitesRepository;
    private final VisiteMapper visiteMapper;

    @GetMapping("/detailed-reports")
    public ResponseEntity<List<VisiteDto>> getDetailedReports(@RequestParam(required = false) String range) {
        // For now, return all visits sorted by date desc
        // In a real app, we would handle date range filtering
        List<VisiteDto> visits = visitesRepository.findAll().stream()
                .sorted((v1, v2) -> v2.getDate().compareTo(v1.getDate()))
                .map(visiteMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(visits);
    }

    @GetMapping("/par-departement")
    public ResponseEntity<List<DepartmentStat>> getByDepartment() {
        // Group by department from VisiteDto (mapped from RendezVous)
        Map<String, Long> stats = visitesRepository.findAll().stream()
                .map(visiteMapper::toDto)
                .map(v -> v.getDepartement() != null ? v.getDepartement() : "Non spécifié")
                .collect(Collectors.groupingBy(d -> d, Collectors.counting()));

        List<DepartmentStat> result = stats.entrySet().stream()
                .map(e -> DepartmentStat.builder().department(e.getKey()).count(e.getValue()).build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/duree-moyenne")
    public ResponseEntity<DurationStats> getAverageDuration() {
        List<VisiteDto> visits = visitesRepository.findAll().stream()
                .map(visiteMapper::toDto)
                .filter(v -> v.getHeureArrivee() != null && v.getHeureSortie() != null)
                .collect(Collectors.toList());

        if (visits.isEmpty()) {
            return ResponseEntity.ok(DurationStats.builder()
                    .averageMinutes(0)
                    .minMinutes(0)
                    .maxMinutes(0)
                    .totalVisitsConsidered(0)
                    .build());
        }

        List<Long> durations = visits.stream()
                .map(v -> java.time.Duration.between(v.getHeureArrivee(), v.getHeureSortie()).toMinutes())
                .collect(Collectors.toList());

        double avg = durations.stream().mapToLong(Long::longValue).average().orElse(0);
        long min = durations.stream().mapToLong(Long::longValue).min().orElse(0);
        long max = durations.stream().mapToLong(Long::longValue).max().orElse(0);

        return ResponseEntity.ok(DurationStats.builder()
                .averageMinutes((long) avg)
                .minMinutes(min)
                .maxMinutes(max)
                .totalVisitsConsidered(visits.size())
                .build());
    }

    @Data
    @Builder
    public static class DurationStats {

        private long averageMinutes;
        private long minMinutes;
        private long maxMinutes;
        private long totalVisitsConsidered;
    }

    @Data
    @Builder
    public static class DepartmentStat {

        private String department;
        private Long count;
    }
}
