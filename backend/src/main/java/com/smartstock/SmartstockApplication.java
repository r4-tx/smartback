package com.smartstock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SmartstockApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartstockApplication.class, args);
    }
}
