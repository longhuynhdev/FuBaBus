package org.example.mdmprojectserver;

import org.example.mdmprojectserver.mongodb.enums.Gender;
import org.example.mdmprojectserver.mongodb.enums.Role;
import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminPhone = "0123456789";
        String adminPassword = "admin123";
        String adminEmail = "admin@fubabus.com";

        String employeePhone = "0123456888";
        String employeePassword = "employee123";
        String employeeEmail = "employee@fubabus.com";

        if (customerRepository.findByPhone(adminPhone).isEmpty()) {
            Customer admin = new Customer();
            admin.setName("Admin 1");
            admin.setPhone(adminPhone);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setGender(Gender.MALE);
            customerRepository.save(admin);
            log.info("Admin account seeded: 0123456789 / admin123");
        }

        if (customerRepository.findByPhone(employeePhone).isEmpty()) {
            Customer employee = new Customer();
            employee.setName("Employee 1");
            employee.setPhone(employeePhone);
            employee.setEmail(employeeEmail);
            employee.setPassword(passwordEncoder.encode(employeePassword));
            employee.setRole(Role.EMPLOYEE);
            employee.setGender(Gender.MALE);
            customerRepository.save(employee);
            log.info("Employee account seeded: 0123456888 / employee123");
        }
    }
}
