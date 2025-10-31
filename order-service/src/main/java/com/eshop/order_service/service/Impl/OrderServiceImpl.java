package com.eshop.order_service.service.Impl;

import com.eshop.order_service.entity.Order;
import com.eshop.order_service.exception.CustomException;
import com.eshop.order_service.external.client.PaymentClient;
import com.eshop.order_service.external.client.PaymentRequestForPaymentService;
import com.eshop.order_service.external.client.ProductService;
import com.eshop.order_service.payload.OrderRequest;
import com.eshop.order_service.repository.OrderRepository;
import com.eshop.order_service.service.OrderService;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final PaymentClient paymentClient;

    public OrderServiceImpl(OrderRepository orderRepository, ProductService productService, PaymentClient paymentClient) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.paymentClient = paymentClient;
    }

    @Override
    public Long placeOrder(OrderRequest orderRequest) {
        // 1. save the order details to the database and status as CREATED
        // 2. call the product service to reduce the inventory
        // 3. call the payment service to make the payment if success update the order status to PLACE
        // 4. if payment fails update the order status to PAYMENT_FAILED

        // Step 1: Save order details to the database with status as CREATED
        //reduce or block the quantity by calling product service

            // 1. Create the order record first with status CREATED
            Order order = new Order();
            order.setAmount(orderRequest.getAmount());
            order.setProductId(orderRequest.getProductId());
            order.setQuantity(orderRequest.getQuantity());
            order.setOrderDate(Instant.now());
            order.setOrderStatus("CREATED");

            order = orderRepository.save(order); // now we have orderId in DB

            try {
                // 2. Ask product-service to reserve/decrease stock
                productService.reduceQuantity(
                        orderRequest.getProductId(),
                        orderRequest.getQuantity()
                );

                PaymentRequestForPaymentService paymentReq = new PaymentRequestForPaymentService();
                paymentReq.setOrderId(order.getOrderId());
                paymentReq.setAmount(orderRequest.getAmount());
                // TODO: later you can pass these from OrderRequest
                paymentReq.setPaymentMethod("CREDIT_CARD");
                paymentReq.setReferenceNumber("REF-" + order.getOrderId());

                Long transactionId = paymentClient.doPayment(paymentReq);

                // 4. Mark order as PLACED (success)
                order.setOrderStatus("PLACED");
                // If you later add a transactionId column to Order, set it here:
                // order.setTransactionId(transactionId);

                orderRepository.save(order);

                // Return the ID back to controller
                return order.getOrderId();

            } catch (Exception ex) {

                // 5. Something failed: stock call or payment call blew up
                //    Record failure in DB so you have traceability
                order.setOrderStatus("PAYMENT_FAILED");
                orderRepository.save(order);

                // 6. Throw CustomException so GlobalExceptionHandler builds the proper response
                throw new CustomException(
                        "Failed to place order " + order.getOrderId() + ": " + ex.getMessage(),
                        "ORDER_PLACEMENT_FAILED",
                        502 // using 502 Bad Gateway because a downstream service failed
                );
            }
    }
    }

