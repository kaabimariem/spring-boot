package com.example.springprojet.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceDto {
    private Long id;
    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private Double totalAmount;
    private Long clientId;
    private String clientName;
    private List<InvoiceDetailDto> details;
}
