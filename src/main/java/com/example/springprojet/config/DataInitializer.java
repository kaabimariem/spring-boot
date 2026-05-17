package com.example.springprojet.config;

import com.example.springprojet.entity.Role;
import com.example.springprojet.entity.User;
import com.example.springprojet.repository.RoleRepository;
import com.example.springprojet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = roleRepository.save(Role.builder().name("ROLE_ADMIN").build());
            Role sellerRole = roleRepository.save(Role.builder().name("ROLE_SELLER").build());
            Role managerRole = roleRepository.save(Role.builder().name("ROLE_MANAGER").build());

            User admin = User.builder()
                    .username("admin")
                    .email("admin@erp.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole))
                    .build();
            userRepository.save(admin);
        }
    }
}
