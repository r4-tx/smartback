package com.smartstock.repository;

import java.util.Optional;
import java.util.UUID;

import com.smartstock.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findByCode(String code);
}
