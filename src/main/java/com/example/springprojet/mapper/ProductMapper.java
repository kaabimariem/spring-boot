package com.example.springprojet.mapper;

import com.example.springprojet.dto.ProductDto;
import com.example.springprojet.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDto toDto(Product product);
    Product toEntity(ProductDto productDto);
    void updateEntity(ProductDto productDto, @MappingTarget Product product);
}
