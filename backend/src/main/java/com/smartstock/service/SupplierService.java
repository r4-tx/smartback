package com.smartstock.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.smartstock.dto.request.CreateSupplierRequest;
import com.smartstock.entity.Supplier;
import com.smartstock.repository.SupplierRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> list() {
        return supplierRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Supplier get(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor nao encontrado"));
    }

    @Transactional
    public Supplier create(CreateSupplierRequest request) {
        supplierRepository.findByCpfCnpj(request.cpfCnpj()).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF/CNPJ ja cadastrado");
        });

        Supplier supplier = new Supplier();
        supplier.setName(request.name());
        supplier.setCpfCnpj(request.cpfCnpj());
        supplier.setPhone(request.phone());
        supplier.setEmail(request.email());
        supplier.setCity(request.city());
        supplier.setStatus("Ativo");
        supplier.setCreatedAt(LocalDateTime.now());
        return supplierRepository.save(supplier);
    }

    @Transactional
    public Supplier update(UUID id, CreateSupplierRequest request) {
        Supplier supplier = get(id);
        supplier.setName(request.name());
        supplier.setCpfCnpj(request.cpfCnpj());
        supplier.setPhone(request.phone());
        supplier.setEmail(request.email());
        supplier.setCity(request.city());
        return supplierRepository.save(supplier);
    }

    public void delete(UUID id) {
        if (!supplierRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor nao encontrado");
        }
        supplierRepository.deleteById(id);
    }
}
