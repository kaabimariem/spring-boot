
package com.example.springprojet.mapper;

import com.example.springprojet.dto.InvoiceDto;
import com.example.springprojet.dto.InvoiceDetailDto;
import com.example.springprojet.entity.Invoice;
import com.example.springprojet.entity.InvoiceDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.name", target = "clientName")
    InvoiceDto toDto(Invoice entity);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    InvoiceDetailDto toDetailDto(InvoiceDetail detail);

    @Mapping(target = "client", ignore = true)
    Invoice toEntity(InvoiceDto invoiceDto);

    @Mapping(target = "product", source = "productId", qualifiedByName = "mapIdToProduct")
    @Mapping(target = "invoice", ignore = true)
    InvoiceDetail toDetailEntity(InvoiceDetailDto detailDto);

    @Named("mapIdToProduct")
    default com.example.springprojet.entity.Product mapIdToProduct(Long id) {
        if (id == null) return null;
        com.example.springprojet.entity.Product product = new com.example.springprojet.entity.Product();
        product.setId(id);
        return product;
    }
}
