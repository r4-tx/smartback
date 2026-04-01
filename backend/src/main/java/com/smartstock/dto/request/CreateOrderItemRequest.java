package com.smartstock.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record CreateOrderItemRequest(
        @NotNull UUID productId,
        @NotNull @Positive Integer quantity,
        @NotNull @PositiveOrZero BigDecimal unitPrice,
        @NotNull @PositiveOrZero BigDecimal discount
) {
}
