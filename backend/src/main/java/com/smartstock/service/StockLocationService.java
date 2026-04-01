package com.smartstock.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.smartstock.dto.request.CreateStockLocationRequest;
import com.smartstock.entity.StockLocation;
import com.smartstock.repository.StockLocationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StockLocationService {

    private final StockLocationRepository stockLocationRepository;

    public StockLocationService(StockLocationRepository stockLocationRepository) {
        this.stockLocationRepository = stockLocationRepository;
    }

    public List<StockLocation> list() {
        return stockLocationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public StockLocation get(UUID id) {
        return stockLocationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Local de estoque nao encontrado"));
    }

    @Transactional
    public StockLocation create(CreateStockLocationRequest request) {
        stockLocationRepository.findByNameIgnoreCase(request.name()).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Local de estoque ja cadastrado");
        });

        StockLocation stockLocation = new StockLocation();
        stockLocation.setName(request.name());
        stockLocation.setAddress(request.address());
        stockLocation.setProducts(request.products());
        stockLocation.setStatus("Ativo");
        stockLocation.setCreatedAt(LocalDateTime.now());
        return stockLocationRepository.save(stockLocation);
    }

    @Transactional
    public StockLocation update(UUID id, CreateStockLocationRequest request) {
        StockLocation stockLocation = get(id);
        stockLocation.setName(request.name());
        stockLocation.setAddress(request.address());
        stockLocation.setProducts(request.products());
        return stockLocationRepository.save(stockLocation);
    }

    public void delete(UUID id) {
        if (!stockLocationRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Local de estoque nao encontrado");
        }
        stockLocationRepository.deleteById(id);
    }
}
