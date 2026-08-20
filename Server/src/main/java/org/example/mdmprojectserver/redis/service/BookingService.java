package org.example.mdmprojectserver.redis.service;

import org.example.mdmprojectserver.mongodb.model.*;
import org.example.mdmprojectserver.mongodb.repository.BusRepository;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.example.mdmprojectserver.mongodb.repository.InvoiceRepository;
import org.example.mdmprojectserver.mongodb.repository.TicketRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class BookingService {
    private StringRedisTemplate redisTemplate;
    private TicketRepository ticketRepository;
    private InvoiceRepository invoiceRepository;
    private BusRepository busRepository;
    private CustomerRepository customerRepository;
    private final ObjectMapper objectMapper;

    public BookingService(StringRedisTemplate redisTemplate, TicketRepository ticketRepository, InvoiceRepository invoiceRepository, BusRepository busRepository, CustomerRepository customerRepository, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.ticketRepository = ticketRepository;
        this.invoiceRepository = invoiceRepository;
        this.busRepository = busRepository;
        this.customerRepository = customerRepository;
        this.objectMapper = objectMapper;
    }


    public void bookTicket(Ticket ticket) throws Exception {
        String ticketJson = objectMapper.writeValueAsString(ticket);
        // Create a key for the ticket in Redis
        String key = ticket.getBusId() + ":" + ticket.getCustomerId();

        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        ops.set(key, ticketJson, Duration.ofSeconds(30));

        // Update the "seats" information on "buses" in MongoDB
        Bus bus = busRepository.findById(ticket.getBusId()).orElseThrow(() -> new Exception("Bus not found"));
        bus.getSeats().forEach(seat -> {
            if (ticket.getSeats().contains(seat.getSeatNumber())) {
                seat.setIsBooked(true);
                seat.setCustomerId(ticket.getCustomerId());
            }
        });
        busRepository.save(bus);

    }

    public Ticket getTicket(String busId, String customerId) throws Exception {
        String key = busId + ":" + customerId;
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String ticketJson = ops.get(key);

        if (ticketJson == null) {
            throw new Exception("No ticket found for busId: " + busId + " and customerId: " + customerId);
        }

        return objectMapper.readValue(ticketJson, Ticket.class);
    }

    public Map<String, String> confirmBooking(String busId, String customerId, String paymentMethod) throws Exception {
        Map<String, String> ids = new HashMap<>();
        Ticket ticket = getTicket(busId, customerId);
        if (ticket != null) {
            ticketRepository.save(ticket);
            redisTemplate.delete(busId + ":" + customerId);
            Customer customer = customerRepository.findById(ticket.getCustomerId()).orElseThrow(() -> new Exception("Customer not found"));
            String resolvedPaymentMethod = (paymentMethod != null && !paymentMethod.isBlank()) ? paymentMethod : "ZaloPay";
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            Invoice invoice = new Invoice(
                    customer.getName(),
                    customer.getPhone(),
                    customer.getEmail(),
                    ticket.getTotalFare(),
                    resolvedPaymentMethod,
                    "Confirmed",
                    ticket.getBusId(),
                    timestamp,
                    ticket.getSeats().toString(),
                    ticket.getBoardingPoint()
            );
            invoiceRepository.save(invoice);
            ids.put("invoiceId", invoice.getInvoiceID());
            ids.put("ticketId", ticket.getId());
        }
        return ids;
    }

}
