package org.example.mdmprojectserver.mongodb.controller;

import org.example.mdmprojectserver.mongodb.enums.Status;
import org.example.mdmprojectserver.mongodb.model.Bus;
import org.example.mdmprojectserver.mongodb.model.Invoice;
import org.example.mdmprojectserver.mongodb.repository.BusRepository;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.example.mdmprojectserver.mongodb.repository.InvoiceRepository;
import org.example.mdmprojectserver.mongodb.repository.TicketRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BusRepository busRepository;
    private final TicketRepository ticketRepository;
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;

    public AdminController(BusRepository busRepository, TicketRepository ticketRepository,
                           InvoiceRepository invoiceRepository, CustomerRepository customerRepository) {
        this.busRepository = busRepository;
        this.ticketRepository = ticketRepository;
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        List<Bus> buses = busRepository.findAll();
        List<Invoice> invoices = invoiceRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBuses", buses.size());
        stats.put("totalTickets", ticketRepository.count());
        stats.put("totalInvoices", invoices.size());
        stats.put("totalCustomers", customerRepository.count());
        stats.put("totalRevenue", invoices.stream().mapToDouble(Invoice::getPrice).sum());
        stats.put("busesAvailable", buses.stream().filter(b -> b.getStatus() == Status.STILL_AVAILABLE).count());
        stats.put("busesFullyBooked", buses.stream().filter(b -> b.getStatus() == Status.FULLY_BOOKED).count());
        stats.put("busesCompleted", buses.stream().filter(b -> b.getStatus() == Status.COMPLETED).count());

        return stats;
    }
}
