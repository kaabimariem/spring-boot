package com.example.springprojet.service;

import com.example.springprojet.entity.Provider;
import com.example.springprojet.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository repository;

    public List<Provider> findAll() {
        return repository.findAll();
    }

    public Provider findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
    }

    public Provider save(Provider provider) {
        return repository.save(provider);
    }

    public Provider update(Long id, Provider provider) {
        Provider existing = findById(id);
        existing.setName(provider.getName());
        existing.setEmail(provider.getEmail());
        existing.setPhone(provider.getPhone());
        existing.setAddress(provider.getAddress());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
