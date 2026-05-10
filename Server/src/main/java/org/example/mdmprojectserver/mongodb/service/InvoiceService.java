package org.example.mdmprojectserver.mongodb.service;

import org.example.mdmprojectserver.mongodb.dto.InvoiceDto;
import org.example.mdmprojectserver.mongodb.model.Invoice;
import org.example.mdmprojectserver.mongodb.repository.InvoiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(String id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found"));
    }

    public Invoice getInvoiceByPhoneAndId(String phone, String invoiceId) {
        return invoiceRepository.findByPhoneAndInvoiceID(phone, invoiceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found"));
    }

    public Invoice createInvoice(InvoiceDto dto) {
        Invoice invoice = new Invoice(
                dto.getName(), dto.getPhone(), dto.getEmail(),
                dto.getPrice(), dto.getPaymentMethod(), dto.getStatus(),
                dto.getBuses(), dto.getTime(), dto.getSeats(), dto.getBoardingPoint()
        );
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(String id) {
        if (!invoiceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found");
        }
        invoiceRepository.deleteById(id);
    }
}
