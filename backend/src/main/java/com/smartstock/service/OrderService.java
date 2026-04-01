package com.smartstock.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.smartstock.dto.request.CreateOrderItemRequest;
import com.smartstock.dto.request.CreateOrderRequest;
import com.smartstock.entity.Client;
import com.smartstock.entity.Delivery;
import com.smartstock.entity.Order;
import com.smartstock.entity.OrderItem;
import com.smartstock.entity.Product;
import com.smartstock.entity.StockMovement;
import com.smartstock.repository.ClientRepository;
import com.smartstock.repository.DeliveryRepository;
import com.smartstock.repository.OrderRepository;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.StockMovementRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final DeliveryRepository deliveryRepository;

    public OrderService(
            OrderRepository orderRepository,
            ClientRepository clientRepository,
            ProductRepository productRepository,
            StockMovementRepository stockMovementRepository,
            DeliveryRepository deliveryRepository
    ) {
        this.orderRepository = orderRepository;
        this.clientRepository = clientRepository;
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.deliveryRepository = deliveryRepository;
    }

    public List<Order> list() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Order get(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido nao encontrado"));
    }

    @Transactional
    public Order create(CreateOrderRequest request) {
        Client client = clientRepository.findById(request.clientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente nao encontrado"));

        if (request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pedido precisa ter itens");
        }

        long nextOrderNumber = orderRepository.count() + 1;

        Order order = new Order();
        order.setClientId(client.getId());
        order.setNumber("G" + nextOrderNumber);
        order.setStatus(request.status() == null || request.status().isBlank() ? "Orcamento" : request.status());
        order.setDate(LocalDate.now());
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderItemRequest itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado"));

            int updatedStock = Math.max(0, product.getStock() - itemRequest.quantity());
            product.setStock(updatedStock);
            productRepository.save(product);

            BigDecimal subtotal = itemRequest.unitPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.quantity()))
                    .subtract(itemRequest.discount());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(product.getId());
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(itemRequest.unitPrice());
            item.setDiscount(itemRequest.discount());
            item.setSubtotal(subtotal);
            items.add(item);
            total = total.add(subtotal);

            StockMovement movement = new StockMovement();
            movement.setProductId(product.getId());
            movement.setType("Saida");
            movement.setQuantity(itemRequest.quantity());
            movement.setOrigin("Pedido #" + order.getNumber());
            movement.setStockAfter(updatedStock);
            movement.setDate(LocalDateTime.now());
            stockMovementRepository.save(movement);
        }

        order.setItems(items);
        order.setTotal(total);
        Order savedOrder = orderRepository.save(order);

        Delivery delivery = new Delivery();
        delivery.setOrderId(savedOrder.getId());
        delivery.setClientId(client.getId());
        delivery.setCity(client.getCity() == null || client.getCity().isBlank() ? "Cidade nao informada" : client.getCity());
        delivery.setStatus("Pendente");
        delivery.setScheduledDate(LocalDate.now());
        delivery.setCreatedAt(LocalDateTime.now());
        deliveryRepository.save(delivery);

        return savedOrder;
    }

    @Transactional
    public Order updateStatus(UUID id, String status) {
        Order order = get(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
