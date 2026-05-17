package com.example.springprojet.service;

import com.example.springprojet.dto.InvoiceDto;
import com.example.springprojet.entity.Invoice;
import com.example.springprojet.entity.InvoiceDetail;
import com.example.springprojet.entity.Product;
import com.example.springprojet.repository.ClientRepository;
import com.example.springprojet.repository.InvoiceRepository;
import com.example.springprojet.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository repository;
    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final com.example.springprojet.mapper.InvoiceMapper mapper;

    public Page<InvoiceDto> getAllInvoices(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toDto);
    }

    @Transactional
    public InvoiceDto createInvoice(InvoiceDto dto) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setClient(clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé")));
        invoice.setInvoiceDate(LocalDateTime.now());
        
        java.util.List<InvoiceDetail> details = new java.util.ArrayList<>();
        double total = 0;

        for (com.example.springprojet.dto.InvoiceDetailDto detailDto : dto.getDetails()) {
            Product product = productRepository.findById(detailDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé : " + detailDto.getProductId()));
            
            if (product.getStockQuantity() < detailDto.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour le produit : " + product.getName());
            }

            InvoiceDetail detail = new InvoiceDetail();
            detail.setInvoice(invoice);
            detail.setProduct(product);
            detail.setQuantity(detailDto.getQuantity());
            detail.setUnitPrice(product.getPrice());
            detail.setSubtotal(detail.getQuantity() * product.getPrice());
            
            details.add(detail);
            total += detail.getSubtotal();
            
            // Mise à jour du stock
            product.setStockQuantity(product.getStockQuantity() - detail.getQuantity());
            productRepository.save(product);
        }
        
        invoice.setDetails(details);
        invoice.setTotalAmount(total);
        
        Invoice savedInvoice = repository.save(invoice);
        return mapper.toDto(savedInvoice);
    }

    @Transactional(readOnly = true)
    public InvoiceDto getInvoice(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
    }

    @Transactional
    public void deleteInvoice(Long id) {
        Invoice invoice = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        
        // Restaurer le stock avant de supprimer
        for (InvoiceDetail detail : invoice.getDetails()) {
            Product product = detail.getProduct();
            product.setStockQuantity(product.getStockQuantity() + detail.getQuantity());
            productRepository.save(product);
        }
        
        repository.delete(invoice);
    }

    public Map<String, Object> getStats() {
        return Map.of(
            "totalRevenue", repository.getTotalRevenue() != null ? repository.getTotalRevenue() : 0.0,
            "invoiceCount", repository.getInvoiceCount(),
            "clientCount", clientRepository.count(),
            "productCount", productRepository.count()
        );
    }
}
