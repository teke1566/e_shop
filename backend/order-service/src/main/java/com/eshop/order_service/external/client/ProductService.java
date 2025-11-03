package com.eshop.order_service.external.client;

import com.eshop.order_service.payload.ReduceQuantityRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "PRODUCT-SERVICE", path = "/api/products")
public interface ProductService {

    @PutMapping("/reduce-quantity")
    ResponseEntity<Void> reduceQuantity(@RequestBody ReduceQuantityRequest request);
}
