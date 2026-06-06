package com.shopease.service.impl;

import com.shopease.dto.CartItemResponse;
import com.shopease.model.CartItem;
import com.shopease.model.Product;
import com.shopease.model.User;
import com.shopease.repository.CartItemRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import com.shopease.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for Shopping Cart operations.
 */
@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CartServiceImpl(CartItemRepository cartItemRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return cartItemRepository.findByUserId(user.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CartItemResponse addItem(String userEmail, Long productId, int quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        // Check if item already exists in user's cart
        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(user.getId(), productId);

        CartItem cartItem;
        if (existing.isPresent()) {
            cartItem = existing.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .build();
        }

        CartItem saved = cartItemRepository.save(cartItem);
        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public CartItemResponse updateQuantity(String userEmail, Long productId, int quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        cartItem.setQuantity(quantity);
        CartItem saved = cartItemRepository.save(cartItem);
        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public void removeItem(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .ifPresent(cartItemRepository::delete);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        cartItemRepository.deleteByUserId(user.getId());
    }

    private CartItemResponse convertToResponse(CartItem cartItem) {
        if (cartItem == null) return null;
        Product product = cartItem.getProduct();

        String firstImage = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            try {
                String raw = product.getImages();
                if (raw.startsWith("[")) {
                    String stripped = raw.substring(1, raw.length() - 1);
                    String[] items = stripped.split(",");
                    if (items.length > 0) {
                        firstImage = items[0].replace("\"", "").replace("'", "").trim();
                    }
                } else {
                    firstImage = raw;
                }
            } catch (Exception e) {
                firstImage = product.getImages();
            }
        }

        return CartItemResponse.builder()
                .id(cartItem.getId())
                .productId(product.getId())
                .productTitle(product.getTitle())
                .productPrice(product.getPrice())
                .productStock(product.getStock())
                .productImage(firstImage)
                .quantity(cartItem.getQuantity())
                .build();
    }
}
