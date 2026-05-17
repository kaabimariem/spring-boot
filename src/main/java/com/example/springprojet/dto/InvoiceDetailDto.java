package com.example.springprojet.dto;

import lombok.Data;

@Data
public class InvoiceDetailDto {
    private Long id;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
    private Long productId;
    private String productName;
}
