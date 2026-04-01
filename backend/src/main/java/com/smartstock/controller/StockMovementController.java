package com.smartstock.controller;

import java.util.List;

import com.smartstock.dto.request.CreateStockMovementRequest;
import com.smartstock.entity.StockMovement;
import com.smartstock.service.StockMovementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock-movements")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping
    public List<StockMovement> list() {
        return stockMovementService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StockMovement create(@Valid @RequestBody CreateStockMovementRequest request) {
        return stockMovementService.create(request);
    }
}
