package org.example.mdmprojectserver.mongodb.repository;

import org.example.mdmprojectserver.mongodb.model.Bus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusRepository extends MongoRepository<Bus, String> {
    boolean existsById(String id);
    Optional<Bus> findById(String invoiceID);
    Bus getBusById(String id);
}
