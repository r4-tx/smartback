package com.smartstock.repository;

import java.util.UUID;

import com.smartstock.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
}
