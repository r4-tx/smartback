package com.smartstock.repository;

import java.util.Optional;

import com.smartstock.entity.StockLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockLocationRepository extends JpaRepository<StockLocation, Long> {
    Optional<StockLocation> findByNameIgnoreCase(String name);
}
