package com.eshop.order_service.service.Impl;

import com.eshop.order_service.entity.Order;
import com.eshop.order_service.exception.CustomException;
import com.eshop.order_service.external.client.PaymentClient;
import com.eshop.order_service.external.client.PaymentRequestForPaymentService;
import com.eshop.order_service.external.client.ProductService;
import com.eshop.order_service.payload.OrderRequest;
import com.eshop.order_service.payload.OrderResponse;
import com.eshop.order_service.payload.ReduceQuantityRequest;
import com.eshop.order_service.repository.OrderRepository;
import com.eshop.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final PaymentClient paymentClient;

    @Override
    @Transactional
    public Long placeOrder(OrderRequest req) {
        // ---- Validate ----
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new CustomException("Order must contain at least one item", "EMPTY_ORDER", 400);
        }

        // ---- Compute totals (BigDecimal safe math) ----
        BigDecimal itemsTotal = BigDecimal.ZERO;
        long totalQty = 0L;

        for (OrderRequest.Item it : req.getItems()) {
            if (it.getProductId() == null) {
                throw new CustomException("productId is required", "INVALID_ITEM", 400);
            }
            if (it.getQuantity() == null || it.getQuantity() <= 0) {
                throw new CustomException("quantity must be > 0", "INVALID_ITEM", 400);
            }
            if (it.getUnitPrice() == null) {
                throw new CustomException("unitPrice is required", "INVALID_ITEM", 400);
            }

            BigDecimal line = it.getUnitPrice().multiply(BigDecimal.valueOf(it.getQuantity()));
            itemsTotal = itemsTotal.add(line);
            totalQty += it.getQuantity();
        }

        BigDecimal shipping = BigDecimal.ZERO;
        if (req.getShipping() != null) {
            shipping = req.getShipping();
        }

        BigDecimal grandTotal = itemsTotal.add(shipping).setScale(2, RoundingMode.HALF_UP);

        // ---- Persist order (single-row schema) ----
        var first = req.getItems().get(0);
        Order order = new Order();
        order.setProductId(first.getProductId());  // summary field (first product)
        order.setQuantity(totalQty);               // sum of all quantities
        order.setOrderDate(Instant.now());
        order.setOrderStatus("CREATED");

        // MONEY CONVENTION (choose ONE):
        // (A) Whole dollars in Long (keeps your current behavior)
        order.setAmount(grandTotal.setScale(0, RoundingMode.HALF_UP).longValue());

        // (B) If you want exact cents, switch to:
        // order.setAmount(grandTotal.movePointRight(2).longValueExact());

        order = orderRepository.save(order);
        Long orderId = order.getOrderId();
        log.info("Order {} created. Amount={}, ItemsTotal={}, Shipping={}", orderId, order.getAmount(), itemsTotal, shipping);

        try {
            // ---- Reduce stock for each item ----
            for (OrderRequest.Item it : req.getItems()) {
                ReduceQuantityRequest rq = new ReduceQuantityRequest(it.getProductId(), it.getQuantity());
                ResponseEntity<Void> resp = productService.reduceQuantity(rq);
                if (resp.getStatusCode().isError()) {
                    throw new IllegalStateException("Stock reduce failed for productId=" + it.getProductId());
                }
            }

            // ---- Charge payment once for the grand total ----
            PaymentRequestForPaymentService pay = new PaymentRequestForPaymentService();
            pay.setOrderId(orderId);
            pay.setAmount(order.getAmount()); // matches your Long amount convention
            // If you kept PaymentMethod in OrderRequest, you can pass it; else default:
            pay.setPaymentMethod(
                    req.getPaymentMethod() != null ? req.getPaymentMethod().name() : "CREDIT_CARD"
            );
            pay.setReferenceNumber("REF-" + orderId);

            Long paymentId = paymentClient.doPayment(pay);
            log.info("Payment {} completed for order {}", paymentId, orderId);

            // ---- Success ----
            order.setOrderStatus("PLACED");
            orderRepository.save(order);
            return orderId;

        } catch (Exception ex) {
            log.error("Order {} failed: {}", orderId, ex.getMessage(), ex);
            order.setOrderStatus("FAILED");
            orderRepository.save(order);
            throw new CustomException(
                    "Failed to place order " + orderId + ": " + ex.getMessage(),
                    "ORDER_PLACEMENT_FAILED",
                    502
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long orderId) {
        Order o = orderRepository.findById(orderId).orElseThrow(
                () -> new CustomException("Order " + orderId + " not found", "ORDER_NOT_FOUND", 404)
        );

        // derive a single 'line' from your summary row
        long qty = o.getQuantity() == null ? 0L : o.getQuantity();
        long total = o.getAmount() == null ? 0L : o.getAmount();
        long unitPrice = (qty > 0) ? Math.round((double) total / (double) qty) : total;

        var line = OrderResponse.OrderLine.builder()
                .productId(o.getProductId())
                .quantity(o.getQuantity())
                .unitPrice(unitPrice)
                .build();

        return OrderResponse.builder()
                .orderId(o.getOrderId())
                .totalAmount(total)
                .status(o.getOrderStatus())
                .orderDate(o.getOrderDate())
                .items(List.of(line))
                .build();
    }
}
