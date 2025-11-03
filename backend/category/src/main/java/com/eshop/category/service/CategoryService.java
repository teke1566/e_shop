package com.eshop.category.service;

import com.eshop.category.payload.CategoryRequest;
import com.eshop.category.payload.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {

    // Basic CRUD
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse getCategory(Long id);
    Page<CategoryResponse> listCategories(Pageable pageable);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);

    // Optional extended features
    List<CategoryResponse> listActiveCategories();
    List<CategoryResponse> listFeaturedCategories();
    List<CategoryResponse> listSubcategories(Long parentId);
}
