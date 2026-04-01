package com.smartstock.repository;

import java.util.Optional;
import java.util.UUID;

import com.smartstock.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, UUID> {

    Optional<Client> findByCpfCnpj(String cpfCnpj);
}
