package com.smartstock.repository;

import java.util.Optional;
import java.util.UUID;

import com.smartstock.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByEmailIgnoreCase(String email);
}
