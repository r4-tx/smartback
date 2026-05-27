package com.smartstock.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * CORS totalmente configurável via {@code application-*.yml} ou variáveis de ambiente
 * (ex.: {@code APP_CORS_ALLOWED_ORIGINS} com lista indexada ou YAML em
 * {@code SPRING_APPLICATION_JSON}).
 */
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    /**
     * Caminho da API coberto pela política CORS.
     */
    private String pathPattern = "/**";

    private List<String> allowedOrigins = defaultOrigins();

    private List<String> allowedMethods = defaultMethods();

    /** Use uma lista com o único elemento {@code *} para permitir qualquer header. */
    private List<String> allowedHeaders = List.of("*");

    private boolean allowCredentials = true;

    private static List<String> defaultOrigins() {
        return List.of(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3001"
        );
    }

    private static List<String> defaultMethods() {
        return List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
    }

    public String getPathPattern() {
        return pathPattern;
    }

    public void setPathPattern(String pathPattern) {
        this.pathPattern = pathPattern;
    }

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins != null ? new ArrayList<>(allowedOrigins) : defaultOrigins();
    }

    public List<String> getAllowedMethods() {
        return allowedMethods;
    }

    public void setAllowedMethods(List<String> allowedMethods) {
        this.allowedMethods = allowedMethods != null ? new ArrayList<>(allowedMethods) : defaultMethods();
    }

    public List<String> getAllowedHeaders() {
        return allowedHeaders;
    }

    public void setAllowedHeaders(List<String> allowedHeaders) {
        this.allowedHeaders = allowedHeaders != null ? new ArrayList<>(allowedHeaders) : List.of("*");
    }

    public boolean isAllowCredentials() {
        return allowCredentials;
    }

    public void setAllowCredentials(boolean allowCredentials) {
        this.allowCredentials = allowCredentials;
    }
}
