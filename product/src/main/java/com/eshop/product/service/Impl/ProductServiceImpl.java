package com.eshop.product.service.Impl;

import com.eshop.product.client.CategoryClient;
import com.eshop.product.entity.Product;
import com.eshop.product.exception.ProductServiceException;
import com.eshop.product.payload.CategoryResponse;
import com.eshop.product.payload.ProductRequest;
import com.eshop.product.payload.ProductResponse;
import com.eshop.product.repository.ProductRepository;
import com.eshop.product.service.ProductService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryClient categoryClient;

    public ProductServiceImpl(ProductRepository productRepository, CategoryClient categoryClient) {
        this.productRepository = productRepository;
        this.categoryClient = categoryClient;
    }

    // -------------------------------------------------------------
    // 1) Create / Add Product
    // -------------------------------------------------------------
    @Override
    public ProductResponse addProduct(ProductRequest productRequest) {
        Product product = new Product();
        product.setProductName(productRequest.getName());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        product.setCategoryId(productRequest.getCategoryId());

        // NEW: description
        product.setDescription(productRequest.getDescription());

        // Optional images (from form upload or manual list) — sanitize a bit
        if (productRequest.getImageUrls() != null) {
            List<String> cleaned = productRequest.getImageUrls().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());
            product.setImageUrls(cleaned);
        }

        productRepository.save(product);
        return mapToResponse(product);
    }

    // -------------------------------------------------------------
    // 2) Get All Products
    // -------------------------------------------------------------
    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------
    // 3) Get Product by ID
    // -------------------------------------------------------------
    @Override
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ProductServiceException("Product not found", "NOT_FOUND"));
        return mapToResponse(product);
    }

    // -------------------------------------------------------------
    // 4) Get Products by Category ID
    // -------------------------------------------------------------
    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------
    // 5) Reduce Quantity
    // -------------------------------------------------------------
    @Override
    public void reduceQuantity(Long productId, Long quantity) {
        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new ProductServiceException("Product not found with id: " + productId, "PRODUCT_NOT_FOUND"));

        if (product.getQuantity() < quantity) {
            throw new ProductServiceException("Insufficient quantity for product id: " + productId, "INSUFFICIENT_QUANTITY");
        }

        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }

    // -------------------------------------------------------------
    // Utility: map Entity → Response DTO
    // -------------------------------------------------------------
    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        BeanUtils.copyProperties(product, response); // copies productName, price, quantity, imageUrls, description, etc.

        // If your ProductResponse uses different field names than Product,
        // you can set them explicitly here as well. Example:
        // response.setDescription(product.getDescription());

        try {
            if (product.getCategoryId() != null) {
                CategoryResponse category = categoryClient.getCategoryById(product.getCategoryId());
                response.setCategoryName(category.getName());
                response.setCategoryImageUrl(category.getImageUrl());
            }
        } catch (Exception e) {
            response.setCategoryName("Unknown");
            response.setCategoryImageUrl(null);
        }

        return response;
    }
}
