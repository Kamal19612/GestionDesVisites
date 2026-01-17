package com.tech.visit_management.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDto {

    private long totalUsers;
    private long totalVisitsToday;
    private long activeVisits;
    private long pendingAppointments;
    private java.util.List<VisiteDto> recentActivity;
}
