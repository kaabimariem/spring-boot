package com.example.springprojet.service;

import com.example.springprojet.entity.Invoice;
import com.example.springprojet.entity.InvoiceDetail;
import com.example.springprojet.entity.Product;
import com.example.springprojet.repository.ClientRepository;
import com.example.springprojet.repository.InvoiceRepository;
import com.example.springprojet.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;

    public List<Invoice> findAll() {
        return invoiceRepository.findAll();
    }

    public Invoice findById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
    }

    @Transactional
    public Invoice create(Invoice invoice) {
        Invoice newInvoice = new Invoice();
        newInvoice.setInvoiceNumber(invoice.getInvoiceNumber());
        newInvoice.setInvoiceDate(LocalDateTime.now());
        newInvoice.setClient(clientRepository.findById(invoice.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé")));

        List<InvoiceDetail> details = new ArrayList<>();
        double total = 0;

        for (InvoiceDetail line : invoice.getDetails()) {
            Product product = productRepository.findById(line.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

            if (product.getStockQuantity() < line.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour : " + product.getName());
            }

            InvoiceDetail detail = new InvoiceDetail();
            detail.setInvoice(newInvoice);
            detail.setProduct(product);
            detail.setQuantity(line.getQuantity());
            detail.setUnitPrice(product.getPrice());
            detail.setSubtotal(line.getQuantity() * product.getPrice());
            details.add(detail);
            total += detail.getSubtotal();

            product.setStockQuantity(product.getStockQuantity() - line.getQuantity());
            productRepository.save(product);
        }

        newInvoice.setDetails(details);
        newInvoice.setTotalAmount(total);
        return invoiceRepository.save(newInvoice);
    }

    @Transactional
    public void delete(Long id) {
        Invoice invoice = findById(id);
        for (InvoiceDetail detail : invoice.getDetails()) {
            Product product = detail.getProduct();
            product.setStockQuantity(product.getStockQuantity() + detail.getQuantity());
            productRepository.save(product);
        }
        invoiceRepository.delete(invoice);
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", invoiceRepository.getTotalRevenue());
        stats.put("invoiceCount", invoiceRepository.getInvoiceCount());
        stats.put("clientCount", clientRepository.count());
        stats.put("productCount", productRepository.count());
        return stats;
    }
}
