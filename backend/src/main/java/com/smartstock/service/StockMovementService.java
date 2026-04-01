package com.smartstock.service;

import java.time.LocalDateTime;
import java.util.List;

import com.smartstock.dto.request.CreateStockMovementRequest;
import com.smartstock.entity.Product;
import com.smartstock.entity.StockMovement;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.StockMovementRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;

    public StockMovementService(StockMovementRepository stockMovementRepository, ProductRepository productRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.productRepository = productRepository;
    }

    public List<StockMovement> list() {
        return stockMovementRepository.findAll(Sort.by(Sort.Direction.DESC, "date"));
    }

    @Transactional
    public StockMovement create(CreateStockMovementRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado"));

        int updatedStock = "Entrada".equalsIgnoreCase(request.type())
                ? product.getStock() + request.quantity()
                : Math.max(0, product.getStock() - request.quantity());

        product.setStock(updatedStock);
        productRepository.save(product);

        StockMovement movement = new StockMovement();
        movement.setProductId(product.getId());
        movement.setType("Entrada".equalsIgnoreCase(request.type()) ? "Entrada" : "Saida");
        movement.setQuantity(request.quantity());
        movement.setOrigin(request.origin() == null || request.origin().isBlank() ? "Ajuste manual" : request.origin());
        movement.setStockAfter(updatedStock);
        movement.setDate(LocalDateTime.now());
        return stockMovementRepository.save(movement);
    }
}
