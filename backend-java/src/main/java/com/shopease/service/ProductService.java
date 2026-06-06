package com.shopease.service;

import com.shopease.dto.ProductRequest;
import com.shopease.dto.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service interface for Product operations.
 */
public interface ProductService {

    List<ProductResponse> getProducts(
            String search,
            String categorySlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int page,
            int limit
    );

    ProductResponse getProductBySlug(String slug);

    ProductResponse createProduct(ProductRequest request, String sellerEmail);

    ProductResponse updateProduct(String slug, ProductRequest request, String userEmail);

    void deleteProduct(String slug, String userEmail);
}
