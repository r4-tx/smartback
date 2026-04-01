package com.smartstock.controller;

import java.util.List;
import java.util.UUID;

import com.smartstock.dto.request.CreateSupplierRequest;
import com.smartstock.entity.Supplier;
import com.smartstock.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<Supplier> list() {
        return supplierService.list();
    }

    @GetMapping("/{id}")
    public Supplier get(@PathVariable UUID id) {
        return supplierService.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Supplier create(@Valid @RequestBody CreateSupplierRequest request) {
        return supplierService.create(request);
    }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable UUID id, @Valid @RequestBody CreateSupplierRequest request) {
        return supplierService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        supplierService.delete(id);
    }
}
