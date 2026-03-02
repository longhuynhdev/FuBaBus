package org.example.mdmprojectserver.mongodb.repository;

import org.example.mdmprojectserver.mongodb.model.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    Optional<Invoice> findById(String invoiceID);
    Optional<Invoice> findByPhoneAndInvoiceID(String phone, String invoiceID);
    void deleteById(String invoiceID);
}
