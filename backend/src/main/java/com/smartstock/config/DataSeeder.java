package com.smartstock.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.smartstock.entity.AppUser;
import com.smartstock.entity.Client;
import com.smartstock.entity.Product;
import com.smartstock.repository.AppUserRepository;
import com.smartstock.repository.ClientRepository;
import com.smartstock.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            ClientRepository clientRepository,
            ProductRepository productRepository,
            AppUserRepository appUserRepository
    ) {
        return args -> {
            appUserRepository.findByEmailIgnoreCase("admin@smartstock.com").orElseGet(() -> {
                AppUser user = new AppUser();
                user.setId(UUID.fromString("99999999-9999-9999-9999-999999999999"));
                user.setName("Admin Smartstock");
                user.setEmail("admin@smartstock.com");
                user.setPassword("123456");
                user.setStatus("Ativo");
                user.setCreatedAt(LocalDateTime.now());
                return appUserRepository.save(user);
            });

            if (clientRepository.count() == 0) {
                Client client = new Client();
                client.setId(UUID.fromString("11111111-1111-1111-1111-111111111111"));
                client.setName("MEIRE SOARES MENDONCA MORAIS LTDA");
                client.setCpfCnpj("12.345.678/0001-90");
                client.setPhone("(31) 9999-8888");
                client.setEmail("meire@empresa.com");
                client.setCity("Belo Horizonte - MG");
                client.setStatus("Ativo");
                client.setCreatedAt(LocalDateTime.now());
                clientRepository.save(client);
            }

            if (productRepository.count() == 0) {
                Product product1 = new Product();
                product1.setName("BOTA FEM. DE USO COMUM C/ SOLA SINT. CABEDAL TEXTI");
                product1.setType("Simples");
                product1.setCode("507183");
                product1.setRef("27551209");
                product1.setStock(1);
                product1.setUnit("PAR");
                product1.setPrice(new BigDecimal("312.00"));
                product1.setStatus("Ativo");
                product1.setCreatedAt(LocalDateTime.now());
                productRepository.save(product1);

                Product product2 = new Product();
                product2.setName("CHUTEIRA SOCIETY BRASIL 70 PRO Y-1 PT-DR-BC T 44");
                product2.setType("Simples");
                product2.setCode("507176");
                product2.setRef("242317904144");
                product2.setStock(1);
                product2.setUnit("PARES");
                product2.setPrice(new BigDecimal("410.00"));
                product2.setStatus("Ativo");
                product2.setCreatedAt(LocalDateTime.now());
                productRepository.save(product2);
            }
        };
    }
}
