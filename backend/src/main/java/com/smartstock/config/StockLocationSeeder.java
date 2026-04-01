package com.smartstock.config;

import java.time.LocalDateTime;
import java.util.UUID;

import com.smartstock.entity.StockLocation;
import com.smartstock.repository.StockLocationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StockLocationSeeder {

    @Bean
    CommandLineRunner seedStockLocations(StockLocationRepository stockLocationRepository) {
        return args -> {
            if (stockLocationRepository.count() > 0) {
                return;
            }

            StockLocation l1 = new StockLocation();
            l1.setId(UUID.fromString("88888888-8888-8888-8888-888888888888"));
            l1.setName("Deposito Principal");
            l1.setAddress("Rua das Flores, 100 - Centro");
            l1.setProducts(28450);
            l1.setStatus("Ativo");
            l1.setCreatedAt(LocalDateTime.now());
            stockLocationRepository.save(l1);

            StockLocation l2 = new StockLocation();
            l2.setId(UUID.fromString("99999999-9999-9999-9999-999999999999"));
            l2.setName("Loja Fisica");
            l2.setAddress("Av. Brasil, 500 - Comercial");
            l2.setProducts(8760);
            l2.setStatus("Ativo");
            l2.setCreatedAt(LocalDateTime.now());
            stockLocationRepository.save(l2);

            StockLocation l3 = new StockLocation();
            l3.setId(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));
            l3.setName("Estoque Reserva");
            l3.setAddress("Rua dos Industriais, 30");
            l3.setProducts(1100);
            l3.setStatus("Ativo");
            l3.setCreatedAt(LocalDateTime.now());
            stockLocationRepository.save(l3);
        };
    }
}
