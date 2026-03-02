package org.example.mdmprojectserver.mongodb.repository;

import org.example.mdmprojectserver.mongodb.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer,String> {
    @Override
    Optional<Customer> findById(String s);
    Customer getCustomerById(String id);

    //@Query("{ 'phone' : ?0 }")
    Optional<Customer> findByPhone(String phone);

}
