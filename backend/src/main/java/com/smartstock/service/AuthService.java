package com.smartstock.service;

import com.smartstock.dto.request.LoginRequest;
import com.smartstock.dto.response.LoginResponse;
import com.smartstock.entity.AppUser;
import com.smartstock.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;

    public AuthService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public LoginResponse login(LoginRequest request) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha invalidos"));

        if (!"Ativo".equalsIgnoreCase(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario inativo");
        }

        // Para demo academica: senha em texto puro.
        // Em produção, usar hash (BCrypt/Argon2) e nunca armazenar senha aberta.
        if (!user.getPassword().equals(request.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha invalidos");
        }

        return new LoginResponse(user.getName(), user.getEmail());
    }
}
