package com.shopease.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Data Transfer Object for creating or updating a Product.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Product title is required")
    private String title;

    private String description;

    @NotNull(message = "Product price is required")
    @PositiveOrZero(message = "Product price must be positive or zero")
    private BigDecimal price;

    @NotNull(message = "Product stock is required")
    @PositiveOrZero(message = "Product stock must be positive or zero")
    private Integer stock;

    /**
     * Product image URLs stored as a JSON array string or a comma-separated list.
     */
    private String images;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
