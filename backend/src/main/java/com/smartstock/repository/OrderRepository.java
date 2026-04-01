package com.smartstock.repository;

import java.util.UUID;

import com.smartstock.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}
