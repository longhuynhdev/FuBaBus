package org.example.mdmprojectserver.redis.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.mdmprojectserver.mongodb.model.*;
import org.example.mdmprojectserver.mongodb.repository.BusRepository;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.example.mdmprojectserver.mongodb.repository.InvoiceRepository;
import org.example.mdmprojectserver.mongodb.repository.TicketRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class BookingService {
    private StringRedisTemplate redisTemplate;
    private TicketRepository ticketRepository;
    private InvoiceRepository invoiceRepository;
    private BusRepository busRepository;
    private CustomerRepository customerRepository;

    public BookingService(StringRedisTemplate redisTemplate, TicketRepository ticketRepository, InvoiceRepository invoiceRepository, BusRepository busRepository, CustomerRepository customerRepository) {
        this.redisTemplate = redisTemplate;
        this.ticketRepository = ticketRepository;
        this.invoiceRepository = invoiceRepository;
        this.busRepository = busRepository;
        this.customerRepository = customerRepository;
    }


    public void bookTicket(Ticket ticket) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        String ticketJson = objectMapper.writeValueAsString(ticket);
        // Create a key for the ticket in Redis
        String key = ticket.getBusId() + ":" + ticket.getCustomerId();

        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        ops.set(key, ticketJson, 30, TimeUnit.SECONDS);

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

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(ticketJson, Ticket.class);
    }

    public Map<String, String> confirmBooking(String busId, String customerId) throws Exception {
        Map<String, String> ids = new HashMap<>();
        Ticket ticket = getTicket(busId, customerId);
        if (ticket != null) {
            // Store the booking information in MongoDB
            ticketRepository.save(ticket);
            // Remove the key from Redis
            redisTemplate.delete(busId + ":" + customerId);
            Customer customer = customerRepository.findById(ticket.getCustomerId()).orElseThrow(() -> new Exception("Customer not found"));
            Invoice invoice = new Invoice(
                    customer.getName(),
                    customer.getPhone(),
                    customer.getEmail(),
                    ticket.getTotalFare(),
                    "ZaloPay",
                    "Confirmed",
                    ticket.getBusId(),
                    "2024-05-05 20:00:00",
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
