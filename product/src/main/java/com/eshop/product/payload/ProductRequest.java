package com.eshop.product.payload;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private String name;
    private Long price;
    private Long quantity;
    private Long categoryId;
    private List<String> imageUrls;
    private String description;
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Long getCategoryId() {
        return categoryId;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }
}
