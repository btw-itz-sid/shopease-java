package com.shopease.service;

import com.shopease.dto.CategoryRequest;
import com.shopease.dto.CategoryResponse;

import java.util.List;

/**
 * Service interface for Category operations.
 */
public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryBySlug(String slug);

    CategoryResponse createCategory(CategoryRequest request);
}
