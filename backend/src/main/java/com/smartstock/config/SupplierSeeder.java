package com.smartstock.config;

import java.time.LocalDateTime;
import java.util.UUID;

import com.smartstock.entity.Supplier;
import com.smartstock.repository.SupplierRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SupplierSeeder {

    @Bean
    CommandLineRunner seedSuppliers(SupplierRepository supplierRepository) {
        return args -> {
            if (supplierRepository.count() > 0) {
                return;
            }

            Supplier s1 = new Supplier();
            s1.setId(UUID.fromString("44444444-4444-4444-4444-444444444444"));
            s1.setName("MEIRE SOARES MENDONCA MORAIS LTDA");
            s1.setCpfCnpj("12.345.678/0001-90");
            s1.setPhone("(31) 9999-8888");
            s1.setEmail("meire@empresa.com");
            s1.setCity("Belo Horizonte - MG");
            s1.setStatus("Ativo");
            s1.setCreatedAt(LocalDateTime.now());
            supplierRepository.save(s1);

            Supplier s2 = new Supplier();
            s2.setId(UUID.fromString("55555555-5555-5555-5555-555555555555"));
            s2.setName("DISTRIBUIDORA NORTE SUL LTDA");
            s2.setCpfCnpj("22.333.444/0001-55");
            s2.setPhone("(41) 9444-3333");
            s2.setEmail("vendas@nortesul.com");
            s2.setCity("Curitiba - PR");
            s2.setStatus("Ativo");
            s2.setCreatedAt(LocalDateTime.now());
            supplierRepository.save(s2);

            Supplier s3 = new Supplier();
            s3.setId(UUID.fromString("66666666-6666-6666-6666-666666666666"));
            s3.setName("CALCADOS BRASIL LTDA");
            s3.setCpfCnpj("33.444.555/0001-66");
            s3.setPhone("(11) 3333-2222");
            s3.setEmail("contato@calcbrasil.com");
            s3.setCity("Franca - SP");
            s3.setStatus("Ativo");
            s3.setCreatedAt(LocalDateTime.now());
            supplierRepository.save(s3);

            Supplier s4 = new Supplier();
            s4.setId(UUID.fromString("77777777-7777-7777-7777-777777777777"));
            s4.setName("ESPORTES & CIA IMPORTACAO");
            s4.setCpfCnpj("55.666.777/0001-88");
            s4.setPhone("(21) 2222-1111");
            s4.setEmail("import@esportescia.com");
            s4.setCity("Rio de Janeiro - RJ");
            s4.setStatus("Inativo");
            s4.setCreatedAt(LocalDateTime.now());
            supplierRepository.save(s4);
        };
    }
}
