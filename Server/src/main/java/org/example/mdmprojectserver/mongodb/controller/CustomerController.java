package org.example.mdmprojectserver.mongodb.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.ChangePasswordDto;
import org.example.mdmprojectserver.mongodb.dto.CustomerDto;
import org.example.mdmprojectserver.mongodb.service.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@Validated
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping()
    public Page<CustomerDto> getCustomers(@PageableDefault(size = 20) Pageable pageable) {
        return customerService.getAllCustomers(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomer(@PathVariable String id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable String id, @Valid @RequestBody CustomerDto updatedCustomerDto) {
        return ResponseEntity.ok(customerService.updateCustomer(id, updatedCustomerDto));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<String> changePassword(@PathVariable String id, @Valid @RequestBody ChangePasswordDto dto) {
        customerService.changePassword(id, dto.getCurrentPassword(), dto.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}
