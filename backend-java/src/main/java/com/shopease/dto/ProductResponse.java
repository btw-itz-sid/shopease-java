package com.shopease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object representing a sanitized product response, containing flattened category and seller fields.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String images;
    private BigDecimal rating;
    private Integer ratingCount;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private SellerDto seller;
    private CategoryDto category;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerDto {
        private Long id;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDto {
        private Long id;
        private String name;
        private String slug;
    }
}
