package org.example.mdmprojectserver.mongodb.service;

import org.example.mdmprojectserver.mongodb.dto.CustomerDto;
import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<CustomerDto> getAllCustomers(Pageable pageable) {
        return customerRepository.findByActiveTrue(pageable)
                .map(this::toDto);
    }

    public CustomerDto getCustomerById(String id) {
        Customer customer = findActiveCustomer(id);
        return toDto(customer);
    }

    public CustomerDto updateCustomer(String id, CustomerDto dto) {
        Customer customer = findActiveCustomer(id);

        customer.setName(dto.getName());
        customer.setGender(dto.getGender());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setJob(dto.getJob());

        return toDto(customerRepository.save(customer));
    }

    public void changePassword(String id, String currentPassword, String newPassword) {
        Customer customer = findActiveCustomer(id);

        if (!passwordEncoder.matches(currentPassword, customer.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        customer.setPassword(passwordEncoder.encode(newPassword));
        customerRepository.save(customer);
    }

    public void deleteCustomer(String id) {
        Customer customer = findActiveCustomer(id);
        customer.setActive(false);
        customerRepository.save(customer);
    }

    private Customer findActiveCustomer(String id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        if (!customer.isActive()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
        }
        return customer;
    }

    public CustomerDto toDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setGender(customer.getGender());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAddress(customer.getAddress());
        dto.setJob(customer.getJob());
        return dto;
    }
}
