package org.example.mdmprojectserver.mongodb.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.TicketDto;
import org.example.mdmprojectserver.mongodb.dto.TicketResponseDto;
import org.example.mdmprojectserver.mongodb.model.Ticket;
import org.example.mdmprojectserver.mongodb.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public List<Ticket> getTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicket(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/{id}/phone/{phone-number}")
    public ResponseEntity<TicketResponseDto> getTicketByIdAndPhoneNumber(@PathVariable String id, @PathVariable("phone-number") String phoneNumber) {
        return ResponseEntity.ok(ticketService.getTicketByIdAndPhone(id, phoneNumber));
    }

    @PostMapping()
    public ResponseEntity<Ticket> newTicket(@Valid @RequestBody TicketDto newTicketDto) {
        return ResponseEntity.ok(ticketService.createTicket(newTicketDto));
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
    }
}
