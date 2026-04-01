package com.smartstock.controller;

import java.util.List;
import java.util.UUID;

import com.smartstock.dto.request.UpdateStatusRequest;
import com.smartstock.entity.Delivery;
import com.smartstock.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public List<Delivery> list() {
        return deliveryService.list();
    }

    @PutMapping("/{id}/status")
    public Delivery updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateStatusRequest request) {
        return deliveryService.updateStatus(id, request.status());
    }
}
