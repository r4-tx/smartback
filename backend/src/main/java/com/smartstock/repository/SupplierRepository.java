package com.smartstock.repository;

import java.util.Optional;
import java.util.UUID;

import com.smartstock.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {

    Optional<Supplier> findByCpfCnpj(String cpfCnpj);
}
