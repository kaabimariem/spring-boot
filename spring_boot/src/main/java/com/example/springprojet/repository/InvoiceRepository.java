package com.example.springprojet.repository;

import com.example.springprojet.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("SELECT DISTINCT i FROM Invoice i " +
           "LEFT JOIN FETCH i.client " +
           "LEFT JOIN FETCH i.details d " +
           "LEFT JOIN FETCH d.product")
    List<Invoice> findAll();

    @Query("SELECT i FROM Invoice i " +
           "LEFT JOIN FETCH i.client " +
           "LEFT JOIN FETCH i.details d " +
           "LEFT JOIN FETCH d.product " +
           "WHERE i.id = :id")
    Optional<Invoice> findById(@Param("id") Long id);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i")
    Double getTotalRevenue();

    @Query("SELECT COUNT(i) FROM Invoice i")
    Long getInvoiceCount();
}
