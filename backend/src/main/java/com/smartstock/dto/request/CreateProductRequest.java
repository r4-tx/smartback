package com.smartstock.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record CreateProductRequest(
        @NotBlank String name,
        String type,
        @NotBlank String code,
        String ref,
        @NotNull @PositiveOrZero Integer stock,
        String unit,
        @NotNull @PositiveOrZero BigDecimal price
) {
}
