package com.shopease.controller;

import com.shopease.dto.CategoryRequest;
import com.shopease.dto.ProductRequest;
import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.model.Role;
import com.shopease.model.User;
import com.shopease.repository.CategoryRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import com.shopease.security.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class CatalogIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User adminUser;
    private User sellerUser;
    private User buyerUser;
    private Category savedCategory;
    private Product savedProduct;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Create test users
        adminUser = User.builder()
                .name("Admin Alice")
                .email("admin@shopease.com")
                .passwordHash("hashedpassword")
                .role(Role.ADMIN)
                .build();
        userRepository.save(adminUser);

        sellerUser = User.builder()
                .name("Seller Sam")
                .email("seller@shopease.com")
                .passwordHash("hashedpassword")
                .role(Role.SELLER)
                .build();
        userRepository.save(sellerUser);

        buyerUser = User.builder()
                .name("Buyer Bob")
                .email("buyer@shopease.com")
                .passwordHash("hashedpassword")
                .role(Role.BUYER)
                .build();
        userRepository.save(buyerUser);

        // 2. Create test category
        Category category = Category.builder()
                .name("Electronics")
                .slug("electronics")
                .description("All electronics")
                .isActive(true)
                .build();
        savedCategory = categoryRepository.save(category);

        // 3. Create test product
        Product product = Product.builder()
                .title("Aether Headphones")
                .slug("aether-headphones-12345")
                .description("Noise canceling wireless headphones")
                .price(BigDecimal.valueOf(299.99))
                .stock(50)
                .images("[\"http://example.com/image.jpg\"]")
                .category(savedCategory)
                .seller(sellerUser)
                .rating(BigDecimal.valueOf(4.5))
                .ratingCount(10)
                .isActive(true)
                .build();
        savedProduct = productRepository.save(product);
    }

    @Test
    void getCategories_Success() throws Exception {
        mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.count", is(1)))
                .andExpect(jsonPath("$.data[0].name", is("Electronics")))
                .andExpect(jsonPath("$.data[0].slug", is("electronics")));
    }

    @Test
    void getCategoryBySlug_Success() throws Exception {
        mockMvc.perform(get("/categories/electronics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", is("Electronics")));
    }

    @Test
    void getCategoryBySlug_NotFound() throws Exception {
        mockMvc.perform(get("/categories/nonexistent"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    void createCategory_AsAdmin_Success() throws Exception {
        String token = jwtUtils.generateToken(adminUser.getEmail(), adminUser.getRole().name());

        CategoryRequest request = CategoryRequest.builder()
                .name("Home Appliances")
                .description("Cool home stuff")
                .parentId(null)
                .build();

        mockMvc.perform(post("/categories")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", is("Home Appliances")))
                .andExpect(jsonPath("$.data.slug", is("home-appliances")));
    }

    @Test
    void createCategory_AsSeller_Forbidden() throws Exception {
        String token = jwtUtils.generateToken(sellerUser.getEmail(), sellerUser.getRole().name());

        CategoryRequest request = CategoryRequest.builder()
                .name("Home Appliances")
                .build();

        mockMvc.perform(post("/categories")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void getProducts_SuccessAndFilter() throws Exception {
        // Query products with search keyword and category slug
        mockMvc.perform(get("/products")
                        .param("search", "headphones")
                        .param("cat", "electronics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.count", is(1)))
                .andExpect(jsonPath("$.data[0].title", containsString("Headphones")));

        // Query with filters that don't match
        mockMvc.perform(get("/products")
                        .param("search", "laptop"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.count", is(0)));
    }

    @Test
    void getProductBySlug_Success() throws Exception {
        mockMvc.perform(get("/products/" + savedProduct.getSlug()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Aether Headphones")));
    }

    @Test
    void createProduct_AsSeller_Success() throws Exception {
        String token = jwtUtils.generateToken(sellerUser.getEmail(), sellerUser.getRole().name());

        ProductRequest request = ProductRequest.builder()
                .title("Aether Speaker")
                .description("Bluetooth speaker")
                .price(BigDecimal.valueOf(99.99))
                .stock(100)
                .categoryId(savedCategory.getId())
                .images("[\"http://example.com/speaker.jpg\"]")
                .build();

        mockMvc.perform(post("/products")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Aether Speaker")))
                .andExpect(jsonPath("$.data.slug", containsString("aether-speaker")));
    }

    @Test
    void updateProduct_AsOwner_Success() throws Exception {
        String token = jwtUtils.generateToken(sellerUser.getEmail(), sellerUser.getRole().name());

        ProductRequest request = ProductRequest.builder()
                .title("Aether Headphones Pro")
                .description("Updated description")
                .price(BigDecimal.valueOf(349.99))
                .stock(40)
                .categoryId(savedCategory.getId())
                .build();

        mockMvc.perform(put("/products/" + savedProduct.getSlug())
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Aether Headphones Pro")))
                .andExpect(jsonPath("$.data.price", is(349.99)));
    }

    @Test
    void updateProduct_AsNonOwnerSeller_Forbidden() throws Exception {
        // Create another seller user
        User otherSeller = User.builder()
                .name("Seller Bob")
                .email("bob@shopease.com")
                .passwordHash("password")
                .role(Role.SELLER)
                .build();
        userRepository.save(otherSeller);

        String token = jwtUtils.generateToken(otherSeller.getEmail(), otherSeller.getRole().name());

        ProductRequest request = ProductRequest.builder()
                .title("Aether Headphones Pro")
                .description("Attempted update")
                .price(BigDecimal.valueOf(349.99))
                .stock(40)
                .categoryId(savedCategory.getId())
                .build();

        mockMvc.perform(put("/products/" + savedProduct.getSlug())
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteProduct_AsOwner_Success() throws Exception {
        String token = jwtUtils.generateToken(sellerUser.getEmail(), sellerUser.getRole().name());

        mockMvc.perform(delete("/products/" + savedProduct.getSlug())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Verify product is actually deleted
        mockMvc.perform(get("/products/" + savedProduct.getSlug()))
                .andExpect(status().isNotFound());
    }
}
