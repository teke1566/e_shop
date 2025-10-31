package com.eshop.payment_service.repository;

import com.eshop.payment_service.entity.TransactionDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<TransactionDetail, Long> {
}
