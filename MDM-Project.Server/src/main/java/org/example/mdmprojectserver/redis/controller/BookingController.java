package org.example.mdmprojectserver.redis.controller;

import org.example.mdmprojectserver.mongodb.dto.TicketDto;
import org.example.mdmprojectserver.mongodb.model.Ticket;
import org.example.mdmprojectserver.redis.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<String> bookTicket(@RequestBody TicketDto ticketDto) {
        try {
            Ticket ticket = new Ticket(ticketDto.getBusId(), ticketDto.getCustomerId(), ticketDto.getSeats(), ticketDto.getTotalFare(), ticketDto.getBoardingPoint(), ticketDto.getDroppingPoint());
            bookingService.bookTicket(ticket);
            return ResponseEntity.ok("Ticket booked successfully. Please pay within 20 minutes to confirm your booking.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error booking ticket: " + e.getMessage());
        }
    }

    @PostMapping("/confirmation")
    public ResponseEntity<Map<String, String>> confirmBooking(@RequestParam String busId, @RequestParam String customerId) {
        try {
            Map<String, String> ids = bookingService.confirmBooking(busId, customerId);
            return ResponseEntity.ok(ids);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Error confirming booking: " + e.getMessage()));
        }
    }
}
