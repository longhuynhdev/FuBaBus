package org.example.mdmprojectserver.mongodb.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.TicketDto;
import org.example.mdmprojectserver.mongodb.dto.TicketResponseDto;
import org.example.mdmprojectserver.mongodb.model.Bus;
import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.model.Ticket;
import org.example.mdmprojectserver.mongodb.repository.BusRepository;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.example.mdmprojectserver.mongodb.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@Validated
public class TicketController {
    private final TicketRepository ticketRepositoryRepository;
    private final BusRepository busRepository;
    private final CustomerRepository customerRepository;
    public TicketController(TicketRepository ticketRepositoryRepository, BusRepository busRepository, CustomerRepository customerRepository) {
        this.ticketRepositoryRepository = ticketRepositoryRepository;
        this.busRepository = busRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Ticket> getTickets() {
        return ticketRepositoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicket(@PathVariable String id) {
        Optional<Ticket> optionalTicket = ticketRepositoryRepository.findById(id);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();
            // Assuming you have BusService and CustomerService to fetch Bus and Customer details
            Bus bus = busRepository.getBusById(ticket.getBusId());
            Customer customer = customerRepository.getCustomerById(ticket.getCustomerId());

            TicketResponseDto ticketResponseDto = new TicketResponseDto();
            ticketResponseDto.setBusId(ticket.getBusId());
            ticketResponseDto.setCustomerId(ticket.getCustomerId());
            ticketResponseDto.setSeats(ticket.getSeats());
            ticketResponseDto.setTotalFare(ticket.getTotalFare());
            ticketResponseDto.setFare(ticket.getTotalFare() / ticket.getSeats().size());
            ticketResponseDto.setBoardingPoint(ticket.getBoardingPoint());
            ticketResponseDto.setDroppingPoint(ticket.getDroppingPoint());

            // Set Bus details
            ticketResponseDto.setDepartureTime(bus.getDepartureTime().toString());
            ticketResponseDto.setDepartureLocation(bus.getDepartureLocation());
            ticketResponseDto.setArrivalTime(bus.getArrivalTime().toString());
            ticketResponseDto.setArrivalLocation(bus.getArrivalLocation());

            ticketResponseDto.setBusType(bus.getBusType());

            // Set Customer details
            ticketResponseDto.setName(customer.getName());
            ticketResponseDto.setEmail(customer.getEmail());
            ticketResponseDto.setPhone(customer.getPhone());

            ticketResponseDto.calculateFare();

            return ResponseEntity.ok(ticketResponseDto);
        } else {
            return ResponseEntity.status(404).body("Ticket not found");
        }
    }

    @GetMapping("/{id}/phone/{phone-number}")
    public ResponseEntity<?> getTicketByIdAndPhoneNumber(@PathVariable String id, @PathVariable("phone-number") String phoneNumber) {
        Optional<Ticket> optionalTicket = ticketRepositoryRepository.findById(id);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();
            // Fetch Customer details using phoneNumber
            Optional<Customer> optionalCustomer = customerRepository.findByPhone(phoneNumber);

            if (!optionalCustomer.isPresent()) {
                return ResponseEntity.status(404).body("Customer not found");
            }
            Customer customer = optionalCustomer.get();
            System.out.println(customer);

            // Fetch Bus details
            Optional<Bus> optionalBus = busRepository.findById(ticket.getBusId());
            if (!optionalBus.isPresent()) {
                return ResponseEntity.status(404).body("Bus not found");
            }
            Bus bus = optionalBus.get();

            TicketResponseDto ticketResponseDto = new TicketResponseDto();
            ticketResponseDto.setBusId(ticket.getBusId());
            ticketResponseDto.setCustomerId(ticket.getCustomerId());
            ticketResponseDto.setSeats(ticket.getSeats());
            ticketResponseDto.setTotalFare(ticket.getTotalFare());
            ticketResponseDto.setFare(ticket.getTotalFare() / ticket.getSeats().size());
            ticketResponseDto.setBoardingPoint(ticket.getBoardingPoint());
            ticketResponseDto.setDroppingPoint(ticket.getDroppingPoint());

            // Set Bus details
            ticketResponseDto.setDepartureTime(bus.getDepartureTime().toString());
            ticketResponseDto.setDepartureLocation(bus.getDepartureLocation());
            ticketResponseDto.setArrivalTime(bus.getArrivalTime().toString());
            ticketResponseDto.setArrivalLocation(bus.getArrivalLocation());
            ticketResponseDto.setBusType(bus.getBusType());

            // Set Customer details
            ticketResponseDto.setName(customer.getName());
            ticketResponseDto.setEmail(customer.getEmail());
            ticketResponseDto.setPhone(customer.getPhone());

            ticketResponseDto.calculateFare();

            return ResponseEntity.ok(ticketResponseDto);
        } else {
            return ResponseEntity.status(404).body("Ticket not found");
        }
    }


    @PostMapping()
    public ResponseEntity<?> newTicket(@Valid @RequestBody TicketDto newTicketDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Validation errors: " + result.getAllErrors());
        }
        Ticket ticket = new Ticket(newTicketDto.getBusId(), newTicketDto.getCustomerId(), newTicketDto.getSeats(), newTicketDto.getTotalFare(), newTicketDto.getBoardingPoint(), newTicketDto.getDroppingPoint());
        return ResponseEntity.ok(ticketRepositoryRepository.save(ticket));
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        ticketRepositoryRepository.deleteById(id);
    }
}
