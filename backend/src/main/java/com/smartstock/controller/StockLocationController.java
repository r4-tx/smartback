package com.smartstock.controller;

import java.util.List;

import com.smartstock.dto.request.CreateStockLocationRequest;
import com.smartstock.entity.StockLocation;
import com.smartstock.service.StockLocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock-locations")
public class StockLocationController {

    private final StockLocationService stockLocationService;

    public StockLocationController(StockLocationService stockLocationService) {
        this.stockLocationService = stockLocationService;
    }

    @GetMapping
    public List<StockLocation> list() {
        return stockLocationService.list();
    }

    @GetMapping("/{id}")
    public StockLocation get(@PathVariable Long id) {
        return stockLocationService.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StockLocation create(@Valid @RequestBody CreateStockLocationRequest request) {
        return stockLocationService.create(request);
    }

    @PutMapping("/{id}")
    public StockLocation update(@PathVariable Long id, @Valid @RequestBody CreateStockLocationRequest request) {
        return stockLocationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        stockLocationService.delete(id);
    }
}
