package com.eshop.payment_service.service;

import com.eshop.payment_service.payload.PaymentRequest;
import com.eshop.payment_service.payload.PaymentResponse;

public interface PaymentService {
    Long doPayment(PaymentRequest paymentRequest);
    PaymentResponse getPaymentDetails(Long transactionId);


}
