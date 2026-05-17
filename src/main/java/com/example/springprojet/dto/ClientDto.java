package com.example.springprojet.dto;

import lombok.Data;

@Data
public class ClientDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
}
