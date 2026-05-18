package com.example.springprojet.service;

import com.example.springprojet.entity.Product;
import com.example.springprojet.repository.ProductRepository;
import com.example.springprojet.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;
    private final ProviderRepository providerRepository;

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
    }

    public Product save(Product product) {
        if (product.getProviderId() != null) {
            product.setProvider(providerRepository.findById(product.getProviderId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé")));
        }
        return repository.save(product);
    }

    public Product update(Long id, Product product) {
        Product existing = findById(id);
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setStockQuantity(product.getStockQuantity());
        existing.setCategory(product.getCategory());
        
        if (product.getProviderId() != null) {
            existing.setProvider(providerRepository.findById(product.getProviderId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé")));
        } else {
            existing.setProvider(null);
        }
        
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

