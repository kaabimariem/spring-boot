package com.example.springprojet.service;

import com.example.springprojet.dto.ClientDto;
import com.example.springprojet.entity.Client;
import com.example.springprojet.mapper.ClientMapper;
import com.example.springprojet.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository repository;
    private final ClientMapper mapper;

    @Transactional(readOnly = true)
    public List<ClientDto> getAllClients() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClientDto getClientById(Long id) {
        Client client = repository.findById(id).orElse(null);
        if (client == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Client non trouvé"
            );
        }
        return mapper.toDto(client);
    }

    @Transactional
    public ClientDto createClient(ClientDto dto) {
        Client client = mapper.toEntity(dto);
        return mapper.toDto(repository.save(client));
    }

    @Transactional
    public ClientDto updateClient(Long id, ClientDto dto) {
        Client client = repository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Client non trouvé"));
        mapper.updateEntity(dto, client);
        return mapper.toDto(repository.save(client));
    }

    @Transactional
    public void deleteClient(Long id) {
        repository.deleteById(id);
    }
}
