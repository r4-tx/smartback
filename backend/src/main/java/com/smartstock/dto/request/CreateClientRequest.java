package com.smartstock.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateClientRequest(
        @NotBlank String name,
        @NotBlank String cpfCnpj,
        String phone,
        String email,
        String city
) {
}
