package com.shopease.config;

import com.shopease.model.*;
import com.shopease.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        // 1. Seed Users
        User admin = User.builder()
                .name("Super Admin")
                .email("admin@shopease.com")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        User seller = User.builder()
                .name("Rajan Store")
                .email("seller@shopease.com")
                .passwordHash(passwordEncoder.encode("Seller@123"))
                .role(Role.SELLER)
                .build();
        userRepository.save(seller);

        User buyer = User.builder()
                .name("Priya Sharma")
                .email("buyer@shopease.com")
                .passwordHash(passwordEncoder.encode("Buyer@123"))
                .role(Role.BUYER)
                .build();
        userRepository.save(buyer);

        // 2. Seed Categories
        Category electronics = Category.builder()
                .name("Electronics")
                .slug("electronics")
                .description("Gadgets, phones, laptops")
                .isActive(true)
                .build();
        categoryRepository.save(electronics);

        Category clothing = Category.builder()
                .name("Clothing")
                .slug("clothing")
                .description("Men, women and kids fashion")
                .isActive(true)
                .build();
        categoryRepository.save(clothing);

        Category food = Category.builder()
                .name("Food & Grocery")
                .slug("food-grocery")
                .description("Fresh and packaged food")
                .isActive(true)
                .build();
        categoryRepository.save(food);

        Category home = Category.builder()
                .name("Home & Kitchen")
                .slug("home-kitchen")
                .description("Furniture and appliances")
                .isActive(true)
                .build();
        categoryRepository.save(home);

        // 3. Seed Products
        Product laptop = Product.builder()
                .title("Premium Ultrabook Laptop")
                .slug("premium-ultrabook-laptop")
                .description("High performance ultrabook with 16GB RAM and 512GB SSD.")
                .price(new BigDecimal("79999.00"))
                .stock(15)
                .rating(new BigDecimal("4.50"))
                .ratingCount(12)
                .seller(seller)
                .category(electronics)
                .images("[\"https://images.unsplash.com/photo-1496181130204-7552cc14b1e0?w=500\"]")
                .isActive(true)
                .build();
        productRepository.save(laptop);

        Product smartphone = Product.builder()
                .title("SmartPhone Pro Max")
                .slug("smartphone-pro-max")
                .description("Latest generation smartphone with OLED display and 108MP camera.")
                .price(new BigDecimal("59999.00"))
                .stock(20)
                .rating(new BigDecimal("4.70"))
                .ratingCount(25)
                .seller(seller)
                .category(electronics)
                .images("[\"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500\"]")
                .isActive(true)
                .build();
        productRepository.save(smartphone);

        Product tshirt = Product.builder()
                .title("Classic Cotton T-Shirt")
                .slug("classic-cotton-t-shirt")
                .description("100% organic cotton comfortable daily wear t-shirt.")
                .price(new BigDecimal("999.00"))
                .stock(100)
                .rating(new BigDecimal("4.20"))
                .ratingCount(40)
                .seller(seller)
                .category(clothing)
                .images("[\"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500\"]")
                .isActive(true)
                .build();
        productRepository.save(tshirt);
    }
}
