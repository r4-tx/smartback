package com.smartstock.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final CorsProperties corsProperties;

    public CorsConfig(CorsProperties corsProperties) {
        this.corsProperties = corsProperties;
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        var origins = corsProperties.getAllowedOrigins();
        if (origins == null || origins.isEmpty()) {
            throw new IllegalStateException(
                    "Configure app.cors.allowed-origins (YAML) ou desative CORS vazio em dev.");
        }

        var registration = registry.addMapping(corsProperties.getPathPattern())
                .allowedOrigins(origins.toArray(String[]::new))
                .allowedMethods(corsProperties.getAllowedMethods().toArray(String[]::new))
                .allowCredentials(corsProperties.isAllowCredentials());

        var headers = corsProperties.getAllowedHeaders();
        if (headers.size() == 1 && "*".equals(headers.getFirst())) {
            registration.allowedHeaders("*");
        } else {
            registration.allowedHeaders(headers.toArray(String[]::new));
        }
    }
}
