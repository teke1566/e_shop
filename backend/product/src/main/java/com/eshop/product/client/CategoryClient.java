package com.eshop.product.client;


import com.eshop.product.payload.CategoryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "CATEGORY-SERVICE", path = "/api/categories")
public interface CategoryClient {

    @GetMapping("/{id}")
    CategoryResponse getCategoryById(@PathVariable("id") Long id);
}
