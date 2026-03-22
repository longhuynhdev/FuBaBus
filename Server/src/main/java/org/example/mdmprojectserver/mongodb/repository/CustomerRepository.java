package org.example.mdmprojectserver.mongodb.repository;

import org.example.mdmprojectserver.mongodb.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    @Override
    Optional<Customer> findById(String s);
    Customer getCustomerById(String id);
    Optional<Customer> findByPhone(String phone);
    Page<Customer> findByActiveTrue(Pageable pageable);
}
