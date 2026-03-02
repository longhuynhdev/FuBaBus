package org.example.mdmprojectserver.mongodb.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.InvoiceDto;
import org.example.mdmprojectserver.mongodb.model.Invoice;
import org.example.mdmprojectserver.mongodb.repository.InvoiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@Validated
public class InvoiceController {
    private final InvoiceRepository invoiceRepository;

    public InvoiceController(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @GetMapping()
    public List<Invoice> getInvoices() {
        return invoiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInvoice(@PathVariable String id) {
        Optional<Invoice> optionalInvoice = invoiceRepository.findById(id);
        if (optionalInvoice.isPresent()) {
            return ResponseEntity.ok(optionalInvoice.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/phone/{phone}/invoice-id/{invoice-id}")
    public ResponseEntity<?> getInvoiceByPhoneAndInvoiceID(@PathVariable String phone, @PathVariable("invoice-id") String invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findByPhoneAndInvoiceID(phone, invoiceId);
        if (invoice.isPresent()) {
            return ResponseEntity.ok(invoice.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping()
    public ResponseEntity<?> newInvoice(@Valid @RequestBody InvoiceDto invoiceDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Validation errors: " + result.getAllErrors());
        }

        Invoice invoice = new Invoice(
                invoiceDto.getName(),
                invoiceDto.getPhone(),
                invoiceDto.getEmail(),
                invoiceDto.getPrice(),
                invoiceDto.getPaymentMethod(),
                invoiceDto.getStatus(),
                invoiceDto.getBuses(),
                invoiceDto.getTime(),
                invoiceDto.getSeats(),
                invoiceDto.getBoardingPoint()
        );

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return ResponseEntity.ok(savedInvoice);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable String id) {
        Optional<Invoice> optionalInvoice = invoiceRepository.findById(id);
        if (!optionalInvoice.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        invoiceRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
