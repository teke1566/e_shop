package com.eshop.product.controller;

import com.eshop.product.entity.Product;
import com.eshop.product.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/products")
public class ProductUploadController {

    private static final String UPLOAD_DIR = "uploads/products/";
    private final ProductRepository productRepository;

    public ProductUploadController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping("/add-with-images")
    public ResponseEntity<?> addProductWithImages(
            @RequestParam("name") String name,
            @RequestParam("price") Long price,
            @RequestParam("quantity") Long quantity,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        try {
            List<String> imageUrls = new ArrayList<>();

            // Ensure upload folder exists
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        Path filePath = Paths.get(UPLOAD_DIR, fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                        // URL goes through API-Gateway (9191) but is served from product-service (9002)
                        String imageUrl = "http://localhost:9191/uploads/products/" + fileName;
                        imageUrls.add(imageUrl);
                    }
                }
            }

            Product product = new Product();
            product.setProductName(name);
            product.setPrice(price);
            product.setQuantity(quantity);
            product.setCategoryId(categoryId);
            product.setImageUrls(imageUrls);

            productRepository.save(product);

            return ResponseEntity.ok(Map.of(
                    "message", "Product created successfully!",
                    "product", product
            ));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
