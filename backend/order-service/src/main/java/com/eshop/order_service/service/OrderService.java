package com.eshop.order_service.service;

import com.eshop.order_service.payload.OrderRequest;
import com.eshop.order_service.payload.OrderResponse;

public interface OrderService {
    Long placeOrder(OrderRequest orderRequest);
    OrderResponse getOrder(Long orderId);


}
