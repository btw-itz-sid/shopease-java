package com.shopease.service;

import com.shopease.dto.CartItemResponse;

import java.util.List;

/**
 * Service interface for Shopping Cart operations.
 */
public interface CartService {

    List<CartItemResponse> getCart(String userEmail);

    CartItemResponse addItem(String userEmail, Long productId, int quantity);

    CartItemResponse updateQuantity(String userEmail, Long productId, int quantity);

    void removeItem(String userEmail, Long productId);

    void clearCart(String userEmail);
}
