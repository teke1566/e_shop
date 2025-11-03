package com.eshop.order_service.external.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "PAYMENT-SERVICE", path = "/api/payments")
public interface PaymentClient {

    @PostMapping("/do-payment")
    Long doPayment(@RequestBody PaymentRequestForPaymentService paymentRequest);
}