package com.eshop.payment_service.service.Impl;

import com.eshop.payment_service.entity.TransactionDetail;
import com.eshop.payment_service.payload.PaymentRequest;
import com.eshop.payment_service.payload.PaymentResponse;
import com.eshop.payment_service.repository.PaymentRepository;
import com.eshop.payment_service.service.PaymentService;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }


    @Override
    public Long doPayment(PaymentRequest paymentRequest) {
        TransactionDetail transactionDetail = new TransactionDetail();
        transactionDetail.setOrderId(paymentRequest.getOrderId());
        transactionDetail.setAmount(paymentRequest.getAmount());
        transactionDetail.setPaymentDate(Instant.now());
        transactionDetail.setPaymentMode(paymentRequest.getPaymentMethod().name());
        transactionDetail.setReferenceNumber(paymentRequest.getReferenceNumber());
        transactionDetail.setPaymentStatus("SUCCESS");

        transactionDetail = paymentRepository.save(transactionDetail);
        return transactionDetail.getId();
    }

    @Override
    public PaymentResponse getPaymentDetails(Long transactionId) {
        TransactionDetail tx = paymentRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + transactionId));

        PaymentResponse response = new PaymentResponse();
        response.setTransactionId(tx.getId());
        response.setOrderId(tx.getOrderId());
        response.setAmount(tx.getAmount());
        response.setStatus(tx.getPaymentStatus());
        response.setPaymentDate(tx.getPaymentDate());
        response.setPaymentMode(tx.getPaymentMode());
        response.setReferenceNumber(tx.getReferenceNumber());

        return response;
    }
}
