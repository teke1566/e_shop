package com.eshop.payment_service.controller;

import com.eshop.payment_service.payload.PaymentRequest;
import com.eshop.payment_service.payload.PaymentResponse;
import com.eshop.payment_service.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/payments")
@RestController
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    @GetMapping("/{transactionId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long transactionId){
        PaymentResponse paymentResponse = paymentService.getPaymentDetails(transactionId);
        return ResponseEntity.ok(paymentResponse);
    }

    @PostMapping("/do-payment")
    public ResponseEntity<Long> doPayment(@RequestBody PaymentRequest paymentRequest){
        Long transactionId = paymentService.doPayment(paymentRequest);
        return ResponseEntity.ok(transactionId);
    }
}
