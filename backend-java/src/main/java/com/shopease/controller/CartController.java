package com.shopease.controller;

import com.shopease.dto.CartItemResponse;
import com.shopease.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller exposing Shopping Cart endpoints.
 * All endpoints require an authenticated user (JWT).
 * Mounts at /cart (servlet context prefixes /api/cart).
 */
@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ---------------------------------------------------------------
    // Helper
    // ---------------------------------------------------------------

    private String currentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    // ---------------------------------------------------------------
    // GET /api/cart  — retrieve current user's cart
    // ---------------------------------------------------------------

    /**
     * Returns the list of cart items for the authenticated user.
     * GET /api/cart
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart() {
        List<CartItemResponse> items = cartService.getCart(currentUserEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", items.size());
        response.put("data", items);

        return ResponseEntity.ok(response);
    }

    // ---------------------------------------------------------------
    // POST /api/cart  — add an item (or increment if already exists)
    // ---------------------------------------------------------------

    /**
     * Adds a product to the cart. If the product is already present,
     * the quantity is incremented.
     * POST /api/cart
     * Body: { "productId": 1, "quantity": 2 }
     */
    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody Map<String, Object> body) {
        try {
            Long productId = Long.valueOf(body.get("productId").toString());
            int quantity = Integer.parseInt(body.getOrDefault("quantity", 1).toString());

            CartItemResponse item = cartService.addItem(currentUserEmail(), productId, quantity);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", item);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ---------------------------------------------------------------
    // PUT /api/cart/{productId}  — set exact quantity for an item
    // ---------------------------------------------------------------

    /**
     * Updates the quantity of a specific product in the cart.
     * PUT /api/cart/{productId}
     * Body: { "quantity": 3 }
     */
    @PutMapping("/{productId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> body
    ) {
        try {
            int quantity = Integer.parseInt(body.get("quantity").toString());
            CartItemResponse item = cartService.updateQuantity(currentUserEmail(), productId, quantity);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", item);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            String msg = e.getMessage();
            HttpStatus status = msg.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
            return errorResponse(msg, status);
        }
    }

    // ---------------------------------------------------------------
    // DELETE /api/cart/{productId}  — remove a single item
    // ---------------------------------------------------------------

    /**
     * Removes a specific product from the cart.
     * DELETE /api/cart/{productId}
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeItem(@PathVariable Long productId) {
        try {
            cartService.removeItem(currentUserEmail(), productId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new HashMap<>());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return errorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // ---------------------------------------------------------------
    // DELETE /api/cart  — clear entire cart
    // ---------------------------------------------------------------

    /**
     * Removes all items from the authenticated user's cart.
     * DELETE /api/cart
     */
    @DeleteMapping
    public ResponseEntity<?> clearCart() {
        try {
            cartService.clearCart(currentUserEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new HashMap<>());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ---------------------------------------------------------------
    // Shared error helper
    // ---------------------------------------------------------------

    private ResponseEntity<Map<String, Object>> errorResponse(String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
