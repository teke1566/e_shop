package com.eshop.product.service;

import com.eshop.product.payload.ProductRequest;
import com.eshop.product.payload.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse addProduct(ProductRequest productRequest);
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(Long productId);
    List<ProductResponse> getProductsByCategory(Long categoryId);



    // most important
    void reduceQuantity(Long productId, Long quantity);
}
