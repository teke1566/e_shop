package com.eshop.category.service.Impl;

import com.eshop.category.entity.Category;
import com.eshop.category.exception.CategoryServiceException;
import com.eshop.category.payload.CategoryRequest;
import com.eshop.category.payload.CategoryResponse;
import com.eshop.category.payload.SubCategoryResponse;
import com.eshop.category.repository.CategoryRepository;
import com.eshop.category.service.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // ----------------- Helper Mappers -----------------

    private CategoryResponse toResponse(Category c) {
        CategoryResponse r = new CategoryResponse();
        r.setId(c.getId());
        r.setName(c.getName());
        r.setDescription(c.getDescription());
        r.setActive(c.getActive());
        r.setFeatured(c.getFeatured());
        r.setImageUrl(c.getImageUrl());
        r.setSlug(c.getSlug());
        r.setMetaTitle(c.getMetaTitle());
        r.setMetaDescription(c.getMetaDescription());
        r.setParentId(c.getParent() != null ? c.getParent().getId() : null);
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());

        // Map subcategories if loaded
        if (c.getChildren() != null && !c.getChildren().isEmpty()) {
            List<SubCategoryResponse> subs = c.getChildren().stream()
                    .map(child -> {
                        SubCategoryResponse sub = new SubCategoryResponse();
                        sub.setId(child.getId());
                        sub.setName(child.getName());
                        sub.setImageUrl(child.getImageUrl());
                        sub.setActive(child.getActive());
                        return sub;
                    })
                    .collect(Collectors.toList());
            r.setChildren(subs);
        }

        return r;
    }

    private void copy(CategoryRequest req, Category c) {
        c.setName(req.getName().trim());
        c.setDescription(req.getDescription());
        c.setActive(req.getActive() != null ? req.getActive() : Boolean.TRUE);
        c.setFeatured(req.getFeatured() != null ? req.getFeatured() : Boolean.FALSE);
        c.setImageUrl(req.getImageUrl());
        c.setSlug(req.getSlug() != null ? req.getSlug() : generateSlug(req.getName()));
        c.setMetaTitle(req.getMetaTitle());
        c.setMetaDescription(req.getMetaDescription());

        // Handle parent if provided
        if (req.getParentId() != null) {
            Category parent = categoryRepository.findById(req.getParentId())
                    .orElseThrow(() -> new CategoryServiceException("Parent category not found: " + req.getParentId()));
            c.setParent(parent);
        } else {
            c.setParent(null);
        }
    }

    private String generateSlug(String name) {
        return name == null ? null :
                name.trim().toLowerCase()
                        .replaceAll("[^a-z0-9\\s-]", "")
                        .replaceAll("\\s+", "-");
    }

    // ----------------- CRUD Operations -----------------

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new CategoryServiceException("Category name already exists: " + request.getName());
        }

        Category category = new Category();
        copy(request, category);

        try {
            Category saved = categoryRepository.save(category);
            return toResponse(saved);
        } catch (DataIntegrityViolationException e) {
            throw new CategoryServiceException("Category name already exists: " + request.getName(), e);
        }
    }

    @Override
    public CategoryResponse getCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryServiceException("Category not found: " + id));
        return toResponse(category);
    }

    @Override
    public Page<CategoryResponse> listCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryServiceException("Category not found: " + id));

        // Name conflict check
        if (!category.getName().equalsIgnoreCase(request.getName()) &&
                categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new CategoryServiceException("Category name already exists: " + request.getName());
        }

        copy(request, category);

        try {
            Category saved = categoryRepository.save(category);
            return toResponse(saved);
        } catch (DataIntegrityViolationException e) {
            throw new CategoryServiceException("Failed to update category: " + request.getName(), e);
        }
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryServiceException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // ----------------- Extended Methods -----------------

    @Override
    public List<CategoryResponse> listActiveCategories() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> listFeaturedCategories() {
        return categoryRepository.findByFeaturedTrueAndActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> listSubcategories(Long parentId) {
        Category parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new CategoryServiceException("Parent category not found: " + parentId));

        return parent.getChildren()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
