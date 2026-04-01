package com.smartstock.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateStockLocationRequest(
        @NotBlank String name,
        @NotBlank String address,
        @NotNull @Min(0) Integer products) {
}
