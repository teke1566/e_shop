package com.eshop.category.controller;

import com.eshop.category.payload.CategoryRequest;
import com.eshop.category.payload.CategoryResponse;
import com.eshop.category.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // ---------- CRUD ---------- //

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategory(id));
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(categoryService.listCategories(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- EXTENDED ENDPOINTS ---------- //

    /**
     * Get all active categories (useful for dropdowns or homepage menus)
     */
    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponse>> listActiveCategories() {
        return ResponseEntity.ok(categoryService.listActiveCategories());
    }

    /**
     * Get all featured categories (for homepage promotions)
     */
    @GetMapping("/featured")
    public ResponseEntity<List<CategoryResponse>> listFeaturedCategories() {
        return ResponseEntity.ok(categoryService.listFeaturedCategories());
    }

    /**
     * Get all subcategories under a specific parent category
     */
    @GetMapping("/subcategories/{parentId}")
    public ResponseEntity<List<CategoryResponse>> listSubcategories(@PathVariable Long parentId) {
        return ResponseEntity.ok(categoryService.listSubcategories(parentId));
    }
}
