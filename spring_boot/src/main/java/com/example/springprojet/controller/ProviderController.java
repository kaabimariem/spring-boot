package com.example.springprojet.controller;

import com.example.springprojet.entity.Provider;
import com.example.springprojet.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService service;

    @GetMapping
    public List<Provider> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Provider getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Provider create(@RequestBody Provider provider) {
        return service.save(provider);
    }

    @PutMapping("/{id}")
    public Provider update(@PathVariable Long id, @RequestBody Provider provider) {
        return service.update(id, provider);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
