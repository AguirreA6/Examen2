package com.soporte.tickets.config;

import com.soporte.tickets.entity.Category;
import com.soporte.tickets.entity.User;
import com.soporte.tickets.enums.Role;
import com.soporte.tickets.repository.CategoryRepository;
import com.soporte.tickets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedUsers();
        seedCategories();
        log.info("Datos iniciales cargados correctamente");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.save(User.builder()
                .username("admin")
                .email("admin@soporte.com")
                .password(passwordEncoder.encode("admin123"))
                .nombre("Administrador")
                .apellido("Sistema")
                .role(Role.ADMIN)
                .build());

        userRepository.save(User.builder()
                .username("tecnico1")
                .email("tecnico1@soporte.com")
                .password(passwordEncoder.encode("tecnico123"))
                .nombre("Carlos")
                .apellido("Pérez")
                .role(Role.TECNICO)
                .build());

        userRepository.save(User.builder()
                .username("tecnico2")
                .email("tecnico2@soporte.com")
                .password(passwordEncoder.encode("tecnico123"))
                .nombre("María")
                .apellido("Gómez")
                .role(Role.TECNICO)
                .build());

        userRepository.save(User.builder()
                .username("usuario1")
                .email("usuario1@empresa.com")
                .password(passwordEncoder.encode("usuario123"))
                .nombre("Juan")
                .apellido("López")
                .role(Role.USUARIO)
                .build());

        userRepository.save(User.builder()
                .username("usuario2")
                .email("usuario2@empresa.com")
                .password(passwordEncoder.encode("usuario123"))
                .nombre("Ana")
                .apellido("Martínez")
                .role(Role.USUARIO)
                .build());

        log.info("Usuarios de prueba creados");
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) return;

        categoryRepository.save(Category.builder()
                .nombre("Hardware")
                .descripcion("Problemas con equipos físicos: computadores, impresoras, periféricos")
                .build());

        categoryRepository.save(Category.builder()
                .nombre("Software")
                .descripcion("Instalación, configuración y errores de aplicaciones")
                .build());

        categoryRepository.save(Category.builder()
                .nombre("Red y Conectividad")
                .descripcion("Problemas de red, internet, VPN y conectividad")
                .build());

        categoryRepository.save(Category.builder()
                .nombre("Seguridad")
                .descripcion("Incidentes de seguridad, accesos y contraseñas")
                .build());

        categoryRepository.save(Category.builder()
                .nombre("Mantenimiento Preventivo")
                .descripcion("Solicitudes de mantenimiento programado")
                .build());

        categoryRepository.save(Category.builder()
                .nombre("Otros")
                .descripcion("Solicitudes que no encajan en otras categorías")
                .build());

        log.info("Categorías de prueba creadas");
    }
}
