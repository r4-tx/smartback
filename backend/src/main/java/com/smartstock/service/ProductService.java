package com.smartstock.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.smartstock.dto.request.CreateProductRequest;
import com.smartstock.entity.Product;
import com.smartstock.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> list() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Product get(UUID id) {
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
        product.setPrice(request.price() == null ? BigDecimal.ZERO : request.price());
        product.setStatus("Ativo");
        product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Transactional
    public Product update(UUID id, CreateProductRequest request) {
        Product product = get(id);
        product.setName(request.name());
        product.setType(request.type() == null || request.type().isBlank() ? "Simples" : request.type());
        product.setCode(request.code());
        product.setRef(request.ref());
        product.setStock(request.stock());
        product.setUnit(request.unit() == null || request.unit().isBlank() ? "UN" : request.unit());
        product.setPrice(request.price() == null ? BigDecimal.ZERO : request.price());
        return productRepository.save(product);
    }

    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado");
        }
        productRepository.deleteById(id);
    }
}
