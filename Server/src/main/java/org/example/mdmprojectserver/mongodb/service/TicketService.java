package org.example.mdmprojectserver.mongodb.service;

import org.example.mdmprojectserver.mongodb.dto.TicketDto;
import org.example.mdmprojectserver.mongodb.dto.TicketResponseDto;
import org.example.mdmprojectserver.mongodb.model.Bus;
import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.model.Ticket;
import org.example.mdmprojectserver.mongodb.repository.BusRepository;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.example.mdmprojectserver.mongodb.repository.TicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final BusRepository busRepository;
    private final CustomerRepository customerRepository;

    public TicketService(TicketRepository ticketRepository, BusRepository busRepository, CustomerRepository customerRepository) {
        this.ticketRepository = ticketRepository;
        this.busRepository = busRepository;
        this.customerRepository = customerRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public TicketResponseDto getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
        Bus bus = busRepository.getBusById(ticket.getBusId());
        Customer customer = customerRepository.getCustomerById(ticket.getCustomerId());
        return toResponseDto(ticket, bus, customer);
    }

    public TicketResponseDto getTicketByIdAndPhone(String id, String phoneNumber) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
        Customer customer = customerRepository.findByPhone(phoneNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        Bus bus = busRepository.findById(ticket.getBusId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found"));
        return toResponseDto(ticket, bus, customer);
    }

    public Ticket createTicket(TicketDto dto) {
        Ticket ticket = new Ticket(dto.getBusId(), dto.getCustomerId(), dto.getSeats(),
                dto.getTotalFare(), dto.getBoardingPoint(), dto.getDroppingPoint());
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }

    private TicketResponseDto toResponseDto(Ticket ticket, Bus bus, Customer customer) {
        TicketResponseDto dto = new TicketResponseDto();
        dto.setBusId(ticket.getBusId());
        dto.setCustomerId(ticket.getCustomerId());
        dto.setSeats(ticket.getSeats());
        dto.setTotalFare(ticket.getTotalFare());
        dto.setBoardingPoint(ticket.getBoardingPoint());
        dto.setDroppingPoint(ticket.getDroppingPoint());

        dto.setDepartureTime(bus.getDepartureTime().toString());
        dto.setDepartureLocation(bus.getDepartureLocation());
        dto.setArrivalTime(bus.getArrivalTime().toString());
        dto.setArrivalLocation(bus.getArrivalLocation());
        dto.setBusType(bus.getBusType());

        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());

        dto.calculateFare();
        return dto;
    }
}
