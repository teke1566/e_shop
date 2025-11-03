package com.eshop.order_service.payload;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderRequest {

    // Accept numeric or strings like "Free", "$5.99"
    @JsonDeserialize(using = com.eshop.order_service.jackson.MoneyDeserializer.class)
    private BigDecimal shipping;

    @JsonAlias({"cartItems", "cart"})
    private List<Item> items;

    private PaymentMethod paymentMethod;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        @JsonAlias({ "id", "product_id" })
        private Long productId;

        @JsonAlias({ "name", "title", "productName" })
        private String productName;

        @JsonAlias({ "image", "image_url", "imageUrl" })
        private String imageUrl;

        @JsonAlias({ "price", "unit_price" })
        private java.math.BigDecimal unitPrice;

        @JsonAlias({ "qty", "count" })
        private Long quantity;
    }
}
