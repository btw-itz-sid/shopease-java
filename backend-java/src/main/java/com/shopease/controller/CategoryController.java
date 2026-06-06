package com.shopease.controller;

import com.shopease.dto.CategoryRequest;
import com.shopease.dto.CategoryResponse;
import com.shopease.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller exposing Category endpoints.
 * Mounts at /categories (servlet context prefixes /api/categories).
 */
@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Get all categories.
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", categories.size());
        response.put("data", categories);

        return ResponseEntity.ok(response);
    }

    /**
     * Get category by slug.
     * GET /api/categories/{slug}
     */
    @GetMapping("/{slug}")
    public ResponseEntity<?> getCategoryBySlug(@PathVariable String slug) {
        CategoryResponse category = categoryService.getCategoryBySlug(slug);
        if (category == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Category not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", category);

        return ResponseEntity.ok(response);
    }

    /**
     * Create a new category (Admin only).
     * POST /api/categories
     */
    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryRequest request) {
        try {
            CategoryResponse created = categoryService.createCategory(request);

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
}
