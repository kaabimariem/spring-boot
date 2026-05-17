package com.example.springprojet.repository;

import com.example.springprojet.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    @EntityGraph(attributePaths = {"client", "details"})
    Page<Invoice> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"client", "details"})
    Page<Invoice> findByInvoiceDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i")
    Double getTotalRevenue();

    @Query("SELECT COUNT(i) FROM Invoice i")
    Long getInvoiceCount();
}
