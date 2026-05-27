package com.smartstock.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateStockMovementRequest(
        @NotNull Long productId,
        @NotBlank String type,
        @NotNull @Positive Integer quantity,
        String origin
) {
}
