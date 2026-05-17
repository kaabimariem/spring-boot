package com.example.springprojet.repository;

import com.example.springprojet.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Page<Client> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
