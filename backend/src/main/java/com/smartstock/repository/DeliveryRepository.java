package com.smartstock.repository;

import java.util.UUID;

import com.smartstock.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
}
