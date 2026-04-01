package com.smartstock.controller;

import com.smartstock.service.ClientService;
import com.smartstock.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ClientService clientService;

    public DashboardController(DashboardService dashboardService, ClientService clientService) {
        this.dashboardService = dashboardService;
        this.clientService = clientService;
    }

    @GetMapping("/summary")
    public DashboardService.DashboardSummary summary() {
        return dashboardService.summary(clientService.list().size());
    }
}
