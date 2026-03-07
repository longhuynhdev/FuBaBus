package org.example.mdmprojectserver.mongodb.controller;

import org.example.mdmprojectserver.mongodb.dto.BusDto;
import org.example.mdmprojectserver.mongodb.model.Bus;
import org.example.mdmprojectserver.mongodb.enums.BusType;
import org.example.mdmprojectserver.mongodb.enums.SortType;
import org.example.mdmprojectserver.mongodb.enums.TimeType;
import org.example.mdmprojectserver.mongodb.repository.BusRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/buses")
@RestController
public class BusController {
    private final BusRepository busRepository;

    public BusController(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @GetMapping
    public List<Bus> getBuses() {
        return this.busRepository.findAll();
    }

    @GetMapping("/{id}")
    public Bus getBus(@PathVariable String id) {
        Bus bus = this.busRepository.findById(id).orElse(null);
        if (bus == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found");
        } else {
            return bus;
        }
    }

    @GetMapping("/search")
    public List<Bus> searchBuses(@RequestParam String departureLocation, @RequestParam String arrivalLocation,
                                 @RequestParam String departureTime,
                                 @RequestParam(required = false) SortType sortByFare, @RequestParam(required = false) SortType sortByDepartureTime,
                                 @RequestParam(required = false) BusType busType, @RequestParam(required = false)TimeType timeType){
        // Parse the departureTime to LocalDate
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate departureDate = LocalDate.parse(departureTime, formatter);

        // Find buses that match the departureLocation, arrivalLocation, and departureDate
        List<Bus> buses = busRepository.findAll().stream()
                .filter(bus -> bus.getDepartureLocation().equals(departureLocation) &&
                        bus.getArrivalLocation().equals(arrivalLocation)
                        && bus.getDepartureTime().toLocalDate().equals(departureDate)
                )
                .collect(Collectors.toList());

        // Sort the results based on fare
        if (sortByFare != null) {
            if (sortByFare == SortType.ASCENDING) {
                buses = buses.stream().sorted(Comparator.comparingDouble(Bus::getFare)).collect(Collectors.toList());
            } else if (sortByFare == SortType.DESCENDING) {
                buses = buses.stream().sorted(Comparator.comparingDouble(Bus::getFare).reversed()).collect(Collectors.toList());
            }
        }

        // Sort the results based on departureTime
        if (sortByDepartureTime != null) {
            if (sortByDepartureTime == SortType.ASCENDING) {
                buses = buses.stream().sorted(Comparator.comparing(Bus::getDepartureTime)).collect(Collectors.toList());
            } else if (sortByDepartureTime == SortType.DESCENDING) {
                buses = buses.stream().sorted(Comparator.comparing(Bus::getDepartureTime).reversed()).collect(Collectors.toList());
            }
        }

        // Filter the results based on busType
        if (busType != null) {
            buses = buses.stream().filter(bus -> bus.getBusType() == busType).collect(Collectors.toList());
        }

        // Filter the results based on timeType
        if (timeType != null) {
            buses = buses.stream().filter(bus -> bus.getTimeType() == timeType).collect(Collectors.toList());
        }

        return buses;
    }

    @PostMapping
    public ResponseEntity<?> newBus(@RequestBody BusDto newBusDto, BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Validation errors: " + result.getAllErrors());
        }

        //Format the date time to a specific format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd:HH:mm");
        LocalDateTime departureTime = LocalDateTime.parse(newBusDto.getDepartureTime(), formatter);
        LocalDateTime arrivalTime = LocalDateTime.parse(newBusDto.getArrivalTime(), formatter);

        Bus bus = new Bus(departureTime, newBusDto.getDepartureLocation(), arrivalTime, newBusDto.getArrivalLocation(), newBusDto.getFare(), newBusDto.getBoardingPoints(), newBusDto.getDroppingPoints(), newBusDto.getBusType());

        return ResponseEntity.ok(this.busRepository.save(bus));
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> newBuses(@RequestBody List<BusDto> newBusDtos, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Validation errors: " + result.getAllErrors());
        }

        List<Bus> savedBuses = new ArrayList<>();

        for (BusDto newBusDto : newBusDtos) {
            //Format the date time to a specific format
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd:HH:mm");
            LocalDateTime departureTime = LocalDateTime.parse(newBusDto.getDepartureTime(), formatter);
            LocalDateTime arrivalTime = LocalDateTime.parse(newBusDto.getArrivalTime(), formatter);

            Bus bus = new Bus(departureTime, newBusDto.getDepartureLocation(), arrivalTime, newBusDto.getArrivalLocation(), newBusDto.getFare(), newBusDto.getBoardingPoints(), newBusDto.getDroppingPoints(), newBusDto.getBusType());

            savedBuses.add(this.busRepository.save(bus));
        }

        return ResponseEntity.ok(savedBuses);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBus(@PathVariable String id, @RequestBody BusDto busDto) {
        Bus bus = this.busRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd:HH:mm");

        if (busDto.getDepartureTime() != null) {
            bus.setDepartureTime(LocalDateTime.parse(busDto.getDepartureTime(), formatter));
            bus.setTimeType();
        }
        if (busDto.getArrivalTime() != null) {
            bus.setArrivalTime(LocalDateTime.parse(busDto.getArrivalTime(), formatter));
        }
        if (busDto.getDepartureLocation() != null) bus.setDepartureLocation(busDto.getDepartureLocation());
        if (busDto.getArrivalLocation() != null) bus.setArrivalLocation(busDto.getArrivalLocation());
        if (busDto.getFare() != null) bus.setFare(busDto.getFare());
        if (busDto.getBoardingPoints() != null) bus.setBoardingPoints(busDto.getBoardingPoints());
        if (busDto.getDroppingPoints() != null) bus.setDroppingPoints(busDto.getDroppingPoints());
        if (busDto.getBusType() != null) bus.setBusType(busDto.getBusType());
        if (busDto.getStatus() != null) bus.setStatus(busDto.getStatus());

        return ResponseEntity.ok(this.busRepository.save(bus));
    }

    @DeleteMapping("/{id}")
    public void deleteBus(@PathVariable String id) {
        this.busRepository.deleteById(id);
    }
}
