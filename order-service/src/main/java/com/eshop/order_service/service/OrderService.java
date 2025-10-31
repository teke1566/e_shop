package com.eshop.order_service.service;

import com.eshop.order_service.payload.OrderRequest;

public interface OrderService {
    Long placeOrder(OrderRequest orderRequest);

}
