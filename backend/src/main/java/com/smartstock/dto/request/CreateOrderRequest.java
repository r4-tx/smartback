package com.smartstock.dto.request;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotNull UUID clientId,
        @NotNull @Size(min = 1) List<CreateOrderItemRequest> items,
        String status
) {
}
