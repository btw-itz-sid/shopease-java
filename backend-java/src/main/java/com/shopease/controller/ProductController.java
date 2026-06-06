package com.shopease.controller;

import com.shopease.dto.ProductRequest;
import com.shopease.dto.ProductResponse;
import com.shopease.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller exposing Product endpoints.
 * Mounts at /products (servlet context prefixes /api/products).
 */
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Get products matching filters.
     * GET /api/products
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cat,
            @RequestParam(name = "min_price", required = false) BigDecimal minPrice,
            @RequestParam(name = "max_price", required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit
    ) {
        List<ProductResponse> products = productService.getProducts(search, cat, minPrice, maxPrice, sort, page, limit);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", products.size());
        response.put("data", products);

        return ResponseEntity.ok(response);
    }

    /**
     * Get product by slug.
     * GET /api/products/{slug}
     */
    @GetMapping("/{slug}")
    public ResponseEntity<?> getProductBySlug(@PathVariable String slug) {
        try {
            ProductResponse product = productService.getProductBySlug(slug);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", product);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Create a new product (Seller or Admin only).
     * POST /api/products
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            ProductResponse created = productService.createProduct(request, email);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", created);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Update an existing product.
     * PUT /api/products/{slug}
     */
    @PutMapping("/{slug}")
    public ResponseEntity<?> updateProduct(
            @PathVariable String slug,
            @Valid @RequestBody ProductRequest request
    ) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            ProductResponse updated = productService.updateProduct(slug, request, email);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updated);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            // Map auth errors to 403, and invalid queries to 400
            HttpStatus status = e.getMessage().contains("authorized") ? HttpStatus.FORBIDDEN : HttpStatus.BAD_REQUEST;
            if (e.getMessage().contains("not found")) {
                status = HttpStatus.NOT_FOUND;
            }
            return ResponseEntity.status(status).body(errorResponse);
        }
    }

    /**
     * Delete a product.
     * DELETE /api/products/{slug}
     */
    @DeleteMapping("/{slug}")
    public ResponseEntity<?> deleteProduct(@PathVariable String slug) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            productService.deleteProduct(slug, email);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new HashMap<>());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            HttpStatus status = e.getMessage().contains("authorized") ? HttpStatus.FORBIDDEN : HttpStatus.BAD_REQUEST;
            if (e.getMessage().contains("not found")) {
                status = HttpStatus.NOT_FOUND;
            }
            return ResponseEntity.status(status).body(errorResponse);
        }
    }
}
