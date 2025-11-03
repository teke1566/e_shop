package com.eshop.order_service.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.eshop.order_service.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {

}
