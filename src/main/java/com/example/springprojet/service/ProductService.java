package com.example.springprojet.service;

import com.example.springprojet.dto.ProductDto;
import com.example.springprojet.entity.Product;
import com.example.springprojet.mapper.ProductMapper;
import com.example.springprojet.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;
    private final ProductMapper mapper;

    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toDto);
    }

    public ProductDto getProductById(Long id) {
        return repository.findById(id).map(mapper::toDto).orElseThrow();
    }

    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Product product = mapper.toEntity(productDto);
        return mapper.toDto(repository.save(product));
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = repository.findById(id).orElseThrow();
        mapper.updateEntity(productDto, product);
        return mapper.toDto(repository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }

    public Page<ProductDto> searchByCategory(String category, Pageable pageable) {
        return repository.findByCategoryContainingIgnoreCase(category, pageable).map(mapper::toDto);
    }
}
