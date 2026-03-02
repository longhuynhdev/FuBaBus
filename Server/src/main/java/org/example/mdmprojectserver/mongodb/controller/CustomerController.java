package org.example.mdmprojectserver.mongodb.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.CustomerDto;
import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@Validated
public class CustomerController {
    private final CustomerRepository customerRepository;
    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping()
    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable String id) {
        return ResponseEntity.ok(customerRepository.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable String id, @Valid @RequestBody CustomerDto updatedCustomerDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Validation errors: " + result.getAllErrors());
        }

        Optional<Customer> optionalCustomer = customerRepository.findById(id);
        if (!optionalCustomer.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Customer existingCustomer = optionalCustomer.get();
        existingCustomer.setName(updatedCustomerDto.getName());
        existingCustomer.setGender(updatedCustomerDto.getGender());
        existingCustomer.setEmail(updatedCustomerDto.getEmail());
        existingCustomer.setPhone(updatedCustomerDto.getPhone());
        existingCustomer.setAddress(updatedCustomerDto.getAddress());
        existingCustomer.setJob(updatedCustomerDto.getJob());

        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerRepository.deleteById(id);
    }
}
