package com.smartstock.service;

import java.math.BigDecimal;
import java.util.List;

import com.smartstock.entity.Order;
import com.smartstock.entity.Product;
import com.smartstock.repository.OrderRepository;
import com.smartstock.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    public record DashboardSummary(
            long ordersCount,
            long pendingOrders,
            BigDecimal totalRevenue,
            long totalStock,
            long clientsCount,
            long productsCount
    ) {
    }

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public DashboardSummary summary(long clientsCount) {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();

        long pendingOrders = orders.stream()
                .filter(order -> "Pendente".equalsIgnoreCase(order.getStatus()) || "Orcamento".equalsIgnoreCase(order.getStatus()))
                .count();

        BigDecimal totalRevenue = orders.stream()
                .filter(order -> "Faturado".equalsIgnoreCase(order.getStatus()) || "Entregue".equalsIgnoreCase(order.getStatus()))
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalStock = products.stream()
                .map(Product::getStock)
                .mapToLong(value -> value == null ? 0L : value)
                .sum();

        return new DashboardSummary(
                orders.size(),
                pendingOrders,
                totalRevenue,
                totalStock,
                clientsCount,
                products.size()
        );
    }
}
