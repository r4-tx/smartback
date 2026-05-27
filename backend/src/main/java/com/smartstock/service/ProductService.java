package com.smartstock.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import com.smartstock.dto.request.CreateProductRequest;
import com.smartstock.entity.Product;
import com.smartstock.entity.StockLocation;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.StockLocationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final StockLocationRepository stockLocationRepository;

    public ProductService(ProductRepository productRepository, StockLocationRepository stockLocationRepository) {
        this.productRepository = productRepository;
        this.stockLocationRepository = stockLocationRepository;
    }

    public List<Product> list() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Product get(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado"));
    }

    @Transactional
    public Product create(CreateProductRequest request) {
        productRepository.findByCode(request.code()).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Codigo ja cadastrado");
        });

        Product product = new Product();
        product.setName(request.name());
        product.setType(request.type() == null || request.type().isBlank() ? "Simples" : request.type());
        product.setCode(request.code());
        product.setRef(request.ref());
        product.setStock(request.stock());
        product.setUnit(request.unit() == null || request.unit().isBlank() ? "UN" : request.unit());
        if (request.stockLocationId() != null && !stockLocationRepository.existsById(request.stockLocationId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Local de estoque nao encontrado");
        }
        product.setStockLocationId(request.stockLocationId());
        product.setPrice(request.price() == null ? BigDecimal.ZERO : request.price());
        product.setStatus("Ativo");
        product.setCreatedAt(LocalDateTime.now());
        Product saved = productRepository.save(product);
        if (saved.getStockLocationId() != null) {
            adjustStockLocationProducts(saved.getStockLocationId(), saved.getStock());
        }
        return saved;
    }

    @Transactional
    public Product update(Long id, CreateProductRequest request) {
        Product product = get(id);
        Long previousLocationId = product.getStockLocationId();
        int previousStock = product.getStock() == null ? 0 : product.getStock();

        product.setName(request.name());
        product.setType(request.type() == null || request.type().isBlank() ? "Simples" : request.type());
        product.setCode(request.code());
        product.setRef(request.ref());
        product.setStock(request.stock());
        product.setUnit(request.unit() == null || request.unit().isBlank() ? "UN" : request.unit());
        if (request.stockLocationId() != null && !stockLocationRepository.existsById(request.stockLocationId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Local de estoque nao encontrado");
        }
        product.setStockLocationId(request.stockLocationId());
        product.setPrice(request.price() == null ? BigDecimal.ZERO : request.price());
        Product saved = productRepository.save(product);

        Long newLocationId = saved.getStockLocationId();
        int newStock = saved.getStock() == null ? 0 : saved.getStock();

        if (Objects.equals(previousLocationId, newLocationId)) {
            if (newLocationId != null) {
                adjustStockLocationProducts(newLocationId, newStock - previousStock);
            }
        } else {
            if (previousLocationId != null) {
                adjustStockLocationProducts(previousLocationId, -previousStock);
            }
            if (newLocationId != null) {
                adjustStockLocationProducts(newLocationId, newStock);
            }
        }

        return saved;
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado"));
        if (product.getStockLocationId() != null) {
            adjustStockLocationProducts(product.getStockLocationId(), -(product.getStock() == null ? 0 : product.getStock()));
        }
        productRepository.delete(product);
    }

    private void adjustStockLocationProducts(Long stockLocationId, int delta) {
        if (delta == 0) return;
        StockLocation location = stockLocationRepository.findById(stockLocationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Local de estoque nao encontrado"));
        int current = location.getProducts() == null ? 0 : location.getProducts();
        int updated = Math.max(0, current + delta);
        location.setProducts(updated);
        stockLocationRepository.save(location);
    }
}
