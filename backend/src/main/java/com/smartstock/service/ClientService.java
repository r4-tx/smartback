package com.smartstock.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.smartstock.dto.request.CreateClientRequest;
import com.smartstock.entity.Client;
import com.smartstock.repository.ClientRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> list() {
        return clientRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Client get(UUID id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente nao encontrado"));
    }

    @Transactional
    public Client create(CreateClientRequest request) {
        clientRepository.findByCpfCnpj(request.cpfCnpj()).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF/CNPJ ja cadastrado");
        });

        Client client = new Client();
        client.setName(request.name());
        client.setCpfCnpj(request.cpfCnpj());
        client.setPhone(request.phone());
        client.setEmail(request.email());
        client.setCity(request.city());
        client.setStatus("Ativo");
        client.setCreatedAt(LocalDateTime.now());
        return clientRepository.save(client);
    }

    @Transactional
    public Client update(UUID id, CreateClientRequest request) {
        Client client = get(id);
        client.setName(request.name());
        client.setCpfCnpj(request.cpfCnpj());
        client.setPhone(request.phone());
        client.setEmail(request.email());
        client.setCity(request.city());
        return clientRepository.save(client);
    }

    public void delete(UUID id) {
        if (!clientRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente nao encontrado");
        }
        clientRepository.deleteById(id);
    }
}
