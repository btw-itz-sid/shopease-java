package com.shopease.service.impl;

import com.shopease.dto.ProductRequest;
import com.shopease.dto.ProductResponse;
import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.model.Role;
import com.shopease.model.User;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import com.shopease.service.ProductService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service implementation for Product operations.
 */
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(
            String search,
            String categorySlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int page,
            int limit
    ) {
        StringBuilder jpql = new StringBuilder("SELECT p FROM Product p WHERE p.isActive = true");
        Map<String, Object> params = new HashMap<>();

        if (search != null && !search.trim().isEmpty()) {
            jpql.append(" AND (lower(p.title) LIKE :search OR lower(p.description) LIKE :search)");
            params.put("search", "%" + search.toLowerCase().trim() + "%");
        }
        if (categorySlug != null && !categorySlug.trim().isEmpty()) {
            jpql.append(" AND p.category.slug = :categorySlug");
            params.put("categorySlug", categorySlug);
        }
        if (minPrice != null) {
            jpql.append(" AND p.price >= :minPrice");
            params.put("minPrice", minPrice);
        }
        if (maxPrice != null) {
            jpql.append(" AND p.price <= :maxPrice");
            params.put("maxPrice", maxPrice);
        }

        // Sorting
        if ("price_asc".equalsIgnoreCase(sort)) {
            jpql.append(" ORDER BY p.price ASC");
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            jpql.append(" ORDER BY p.price DESC");
        } else if ("rating".equalsIgnoreCase(sort)) {
            jpql.append(" ORDER BY p.rating DESC");
        } else {
            jpql.append(" ORDER BY p.createdAt DESC"); // default newest
        }

        TypedQuery<Product> query = entityManager.createQuery(jpql.toString(), Product.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        // Pagination
        int startPosition = (page - 1) * limit;
        query.setFirstResult(startPosition);
        query.setMaxResults(limit);

        return query.getResultList().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getSlug().equalsIgnoreCase(slug))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return convertToResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request, String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Seller user not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        String suffix = UUID.randomUUID().toString().substring(0, 5);
        String slug = slugify(request.getTitle()) + "-" + suffix;

        Product product = Product.builder()
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .images(request.getImages())
                .category(category)
                .seller(seller)
                .rating(BigDecimal.ZERO)
                .ratingCount(0)
                .isActive(true)
                .build();

        Product saved = productRepository.save(product);
        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(String slug, ProductRequest request, String userEmail) {
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getSlug().equalsIgnoreCase(slug))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check authorization: must be the owning seller or an admin
        if (!product.getSeller().getEmail().equalsIgnoreCase(userEmail) && user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Not authorized to update this product");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Update fields
        if (!product.getTitle().equalsIgnoreCase(request.getTitle())) {
            String suffix = UUID.randomUUID().toString().substring(0, 5);
            product.setSlug(slugify(request.getTitle()) + "-" + suffix);
            product.setTitle(request.getTitle());
        }

        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImages(request.getImages());
        product.setCategory(category);

        Product updated = productRepository.save(product);
        return convertToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteProduct(String slug, String userEmail) {
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getSlug().equalsIgnoreCase(slug))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check authorization: must be the owning seller or an admin
        if (!product.getSeller().getEmail().equalsIgnoreCase(userEmail) && user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Not authorized to delete this product");
        }

        productRepository.delete(product);
    }

    private ProductResponse convertToResponse(Product product) {
        if (product == null) return null;
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .images(product.getImages())
                .rating(product.getRating())
                .ratingCount(product.getRatingCount())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .sellerId(product.getSeller() != null ? product.getSeller().getId() : null)
                .sellerName(product.getSeller() != null ? product.getSeller().getName() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .build();
    }

    private String slugify(String input) {
        if (input == null) return "";
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
