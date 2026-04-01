package com.smartstock.repository;

import java.util.Optional;
import java.util.UUID;

import com.smartstock.entity.StockLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockLocationRepository extends JpaRepository<StockLocation, UUID> {
    Optional<StockLocation> findByNameIgnoreCase(String name);
}
