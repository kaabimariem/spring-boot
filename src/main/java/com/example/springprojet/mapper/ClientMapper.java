package com.example.springprojet.mapper;

import com.example.springprojet.dto.ClientDto;
import com.example.springprojet.entity.Client;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDto toDto(Client client);
    
    @org.mapstruct.Mapping(target = "invoices", ignore = true)
    Client toEntity(ClientDto clientDto);
    
    @org.mapstruct.Mapping(target = "invoices", ignore = true)
    void updateEntity(ClientDto clientDto, @MappingTarget Client client);
}
