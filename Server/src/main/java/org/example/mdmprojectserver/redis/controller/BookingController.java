package org.example.mdmprojectserver.redis.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.TicketDto;
import org.example.mdmprojectserver.mongodb.enums.Role;
import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.model.Ticket;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.example.mdmprojectserver.redis.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;
    private final CustomerRepository customerRepository;

    public BookingController(BookingService bookingService, CustomerRepository customerRepository) {
        this.bookingService = bookingService;
        this.customerRepository = customerRepository;
    }

    @PostMapping
    public ResponseEntity<String> bookTicket(@Valid @RequestBody TicketDto ticketDto) {
        try {
            String customerId = resolveCustomerId(ticketDto);
            Ticket ticket = new Ticket(ticketDto.getBusId(), customerId, ticketDto.getSeats(), ticketDto.getTotalFare(), ticketDto.getBoardingPoint(), ticketDto.getDroppingPoint());
            bookingService.bookTicket(ticket);
            return ResponseEntity.ok("Ticket booked successfully. Please confirm your booking within the time limit.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error booking ticket: " + e.getMessage());
        }
    }

    @PostMapping("/confirmation")
    public ResponseEntity<Map<String, String>> confirmBooking(@RequestParam String busId, @RequestParam String customerId, @RequestParam(required = false) String paymentMethod) {
        try {
            Map<String, String> ids = bookingService.confirmBooking(busId, customerId, paymentMethod);
            return ResponseEntity.ok(ids);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Error confirming booking: " + e.getMessage()));
        }
    }

    private String resolveCustomerId(TicketDto ticketDto) {
        if (ticketDto.getCustomerId() != null && !ticketDto.getCustomerId().isBlank()) {
            return ticketDto.getCustomerId();
        }

        // Guest booking: find or create customer by phone
        String phone = ticketDto.getPhone();
        if (phone != null && phone.startsWith("+84")) {
            phone = "0" + phone.substring(3);
        }

        Optional<Customer> existing = customerRepository.findByPhone(phone);
        if (existing.isPresent()) {
            return existing.get().getId();
        }

        Customer guest = new Customer();
        guest.setName(ticketDto.getName());
        guest.setPhone(ticketDto.getPhone());
        if (ticketDto.getEmail() != null && !ticketDto.getEmail().isBlank()) {
            guest.setEmail(ticketDto.getEmail());
        }
        guest.setRole(Role.USER);
        Customer saved = customerRepository.save(guest);
        return saved.getId();
    }
}
