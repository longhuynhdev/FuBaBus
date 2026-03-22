package org.example.mdmprojectserver.mongodb.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.InvoiceDto;
import org.example.mdmprojectserver.mongodb.model.Invoice;
import org.example.mdmprojectserver.mongodb.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@Validated
public class InvoiceController {
    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping()
    public List<Invoice> getInvoices() {
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @GetMapping("/phone/{phone}/invoice-id/{invoice-id}")
    public ResponseEntity<Invoice> getInvoiceByPhoneAndInvoiceID(@PathVariable String phone, @PathVariable("invoice-id") String invoiceId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByPhoneAndId(phone, invoiceId));
    }

    @PostMapping()
    public ResponseEntity<Invoice> newInvoice(@Valid @RequestBody InvoiceDto invoiceDto) {
        return ResponseEntity.ok(invoiceService.createInvoice(invoiceDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable String id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok().build();
    }
}
