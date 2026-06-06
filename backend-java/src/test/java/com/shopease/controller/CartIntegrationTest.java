package com.shopease.controller;

import com.shopease.model.Category;
import com.shopease.model.Product;
import com.shopease.model.Role;
import com.shopease.model.User;
import com.shopease.repository.CartItemRepository;
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
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the CartController.
 * Covers: get cart, add item, update quantity, remove item, clear cart,
 * and unauthenticated access rejection.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class CartIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User buyerUser;
    private User otherBuyer;
    private Product savedProduct;
    private String buyerToken;
    private String otherBuyerToken;

    @BeforeEach
    void setUp() {
        cartItemRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        // Create buyer users
        buyerUser = User.builder()
                .name("Buyer Bob")
                .email("buyer@shopease.com")
                .passwordHash("hashedpassword")
                .role(Role.BUYER)
                .build();
        userRepository.save(buyerUser);

        otherBuyer = User.builder()
                .name("Buyer Alice")
                .email("alice@shopease.com")
                .passwordHash("hashedpassword")
                .role(Role.BUYER)
                .build();
        userRepository.save(otherBuyer);

        // Create a seller to own the product
        User seller = User.builder()
                .name("Seller Sam")
                .email("seller@shopease.com")
                .passwordHash("hashedpassword")
                .role(Role.SELLER)
                .build();
        userRepository.save(seller);

        // Create category + product
        Category category = Category.builder()
                .name("Electronics")
                .slug("electronics")
                .description("All electronics")
                .isActive(true)
                .build();
        categoryRepository.save(category);

        Product product = Product.builder()
                .title("Aether Headphones")
                .slug("aether-headphones-99999")
                .description("Noise canceling headphones")
                .price(BigDecimal.valueOf(299.99))
                .stock(50)
                .images("[\"http://example.com/image.jpg\"]")
                .category(category)
                .seller(seller)
                .rating(BigDecimal.valueOf(4.5))
                .ratingCount(10)
                .isActive(true)
                .build();
        savedProduct = productRepository.save(product);

        // Generate JWT tokens
        buyerToken = jwtUtils.generateToken(buyerUser.getEmail(), buyerUser.getRole().name());
        otherBuyerToken = jwtUtils.generateToken(otherBuyer.getEmail(), otherBuyer.getRole().name());
    }

    // ---------------------------------------------------------------
    // GET /cart — retrieve cart
    // ---------------------------------------------------------------

    @Test
    void getCart_EmptyCart_ReturnsEmptyList() throws Exception {
        mockMvc.perform(get("/cart")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.count", is(0)))
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @Test
    void getCart_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(get("/cart"))
                .andExpect(status().isUnauthorized());
    }

    // ---------------------------------------------------------------
    // POST /cart — add item
    // ---------------------------------------------------------------

    @Test
    void addItem_ValidProduct_ReturnsCreatedItem() throws Exception {
        Map<String, Object> body = Map.of(
                "productId", savedProduct.getId(),
                "quantity", 2
        );

        mockMvc.perform(post("/cart")
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.productId", is(savedProduct.getId().intValue())))
                .andExpect(jsonPath("$.data.productTitle", is("Aether Headphones")))
                .andExpect(jsonPath("$.data.quantity", is(2)));
    }

    @Test
    void addItem_SameProductTwice_IncrementsQuantity() throws Exception {
        Map<String, Object> body = Map.of("productId", savedProduct.getId(), "quantity", 1);

        // Add once
        mockMvc.perform(post("/cart")
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.quantity", is(1)));

        // Add again — quantity should accumulate to 2
        mockMvc.perform(post("/cart")
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.quantity", is(2)));
    }

    @Test
    void addItem_InvalidProductId_ReturnsBadRequest() throws Exception {
        Map<String, Object> body = Map.of("productId", 999999L, "quantity", 1);

        mockMvc.perform(post("/cart")
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void addItem_ZeroQuantity_ReturnsBadRequest() throws Exception {
        Map<String, Object> body = Map.of("productId", savedProduct.getId(), "quantity", 0);

        mockMvc.perform(post("/cart")
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Quantity")));
    }

    @Test
    void addItem_Unauthenticated_Returns401() throws Exception {
        Map<String, Object> body = Map.of("productId", savedProduct.getId(), "quantity", 1);

        mockMvc.perform(post("/cart")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized());
    }

    // ---------------------------------------------------------------
    // PUT /cart/{productId} — update quantity
    // ---------------------------------------------------------------

    @Test
    void updateQuantity_ExistingItem_ReturnsUpdated() throws Exception {
        // First add the item
        mockMvc.perform(post("/cart")
                .header("Authorization", "Bearer " + buyerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("productId", savedProduct.getId(), "quantity", 1))));

        // Now update to 5
        Map<String, Object> body = Map.of("quantity", 5);

        mockMvc.perform(put("/cart/" + savedProduct.getId())
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.quantity", is(5)));
    }

    @Test
    void updateQuantity_NonExistentItem_ReturnsNotFound() throws Exception {
        Map<String, Object> body = Map.of("quantity", 3);

        mockMvc.perform(put("/cart/" + savedProduct.getId())
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void updateQuantity_ZeroQuantity_ReturnsBadRequest() throws Exception {
        // Add item first
        mockMvc.perform(post("/cart")
                .header("Authorization", "Bearer " + buyerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("productId", savedProduct.getId(), "quantity", 1))));

        Map<String, Object> body = Map.of("quantity", 0);

        mockMvc.perform(put("/cart/" + savedProduct.getId())
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    // ---------------------------------------------------------------
    // DELETE /cart/{productId} — remove single item
    // ---------------------------------------------------------------

    @Test
    void removeItem_ExistingItem_RemovesSuccessfully() throws Exception {
        // Add item first
        mockMvc.perform(post("/cart")
                .header("Authorization", "Bearer " + buyerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("productId", savedProduct.getId(), "quantity", 2))));

        // Remove it
        mockMvc.perform(delete("/cart/" + savedProduct.getId())
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Verify cart is now empty
        mockMvc.perform(get("/cart")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count", is(0)));
    }

    @Test
    void removeItem_DoesNotAffectOtherUserCart() throws Exception {
        // Buyer adds item
        mockMvc.perform(post("/cart")
                .header("Authorization", "Bearer " + buyerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("productId", savedProduct.getId(), "quantity", 1))));

        // OtherBuyer tries to remove from buyer's cart — but it's their own empty cart
        mockMvc.perform(delete("/cart/" + savedProduct.getId())
                        .header("Authorization", "Bearer " + otherBuyerToken))
                .andExpect(status().isOk()); // silently does nothing (item not in their cart)

        // Buyer's cart should still have the item
        mockMvc.perform(get("/cart")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count", is(1)));
    }

    // ---------------------------------------------------------------
    // DELETE /cart — clear entire cart
    // ---------------------------------------------------------------

    @Test
    void clearCart_WithItems_ClearsSuccessfully() throws Exception {
        // Add item first
        mockMvc.perform(post("/cart")
                .header("Authorization", "Bearer " + buyerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("productId", savedProduct.getId(), "quantity", 3))));

        // Clear cart
        mockMvc.perform(delete("/cart")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Verify cart is empty
        mockMvc.perform(get("/cart")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count", is(0)));
    }

    @Test
    void clearCart_EmptyCart_SucceedsGracefully() throws Exception {
        mockMvc.perform(delete("/cart")
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    void clearCart_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(delete("/cart"))
                .andExpect(status().isUnauthorized());
    }

    // ---------------------------------------------------------------
    // Cart isolation: users cannot see each other's carts
    // ---------------------------------------------------------------

    @Test
    void getCart_UsersHaveIsolatedCarts() throws Exception {
        // Buyer adds an item
        mockMvc.perform(post("/cart")
                .header("Authorization", "Bearer " + buyerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("productId", savedProduct.getId(), "quantity", 1))));

        // OtherBuyer's cart should still be empty
        mockMvc.perform(get("/cart")
                        .header("Authorization", "Bearer " + otherBuyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count", is(0)));
    }
}
