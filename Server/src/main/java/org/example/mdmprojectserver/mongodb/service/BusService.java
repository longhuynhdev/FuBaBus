package org.example.mdmprojectserver.mongodb.service;

import org.example.mdmprojectserver.mongodb.dto.BusDto;
import org.example.mdmprojectserver.mongodb.enums.BusType;
import org.example.mdmprojectserver.mongodb.enums.SortType;
import org.example.mdmprojectserver.mongodb.enums.TimeType;
import org.example.mdmprojectserver.mongodb.model.Bus;
import org.example.mdmprojectserver.mongodb.repository.BusRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd:HH:mm");

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    public Page<Bus> getAllBuses(Pageable pageable) {
        return busRepository.findAll(pageable);
    }

    public Bus getBusById(String id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found"));
    }

    public List<Bus> searchBuses(String departureLocation, String arrivalLocation, String departureTime,
                                 SortType sortByFare, SortType sortByDepartureTime,
                                 BusType busType, TimeType timeType) {
        LocalDate departureDate = LocalDate.parse(departureTime, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        LocalDateTime startOfDay = departureDate.atStartOfDay();
        LocalDateTime endOfDay = departureDate.plusDays(1).atStartOfDay();

        List<Bus> buses = busRepository.findByDepartureLocationAndArrivalLocationAndDepartureTimeBetween(
                departureLocation, arrivalLocation, startOfDay, endOfDay);

        if (sortByFare != null) {
            Comparator<Bus> fareComparator = Comparator.comparingDouble(Bus::getFare);
            if (sortByFare == SortType.DESCENDING) fareComparator = fareComparator.reversed();
            buses = buses.stream().sorted(fareComparator).collect(Collectors.toList());
        }

        if (sortByDepartureTime != null) {
            Comparator<Bus> timeComparator = Comparator.comparing(Bus::getDepartureTime);
            if (sortByDepartureTime == SortType.DESCENDING) timeComparator = timeComparator.reversed();
            buses = buses.stream().sorted(timeComparator).collect(Collectors.toList());
        }

        if (busType != null) {
            buses = buses.stream().filter(bus -> bus.getBusType() == busType).collect(Collectors.toList());
        }

        if (timeType != null) {
            buses = buses.stream().filter(bus -> bus.getTimeType() == timeType).collect(Collectors.toList());
        }

        return buses;
    }

    public Bus createBus(BusDto dto) {
        LocalDateTime departureTime = LocalDateTime.parse(dto.getDepartureTime(), DATETIME_FORMATTER);
        LocalDateTime arrivalTime = LocalDateTime.parse(dto.getArrivalTime(), DATETIME_FORMATTER);
        Bus bus = new Bus(departureTime, dto.getDepartureLocation(), arrivalTime, dto.getArrivalLocation(),
                dto.getFare(), dto.getBoardingPoints(), dto.getDroppingPoints(), dto.getBusType());
        return busRepository.save(bus);
    }

    public Bus updateBus(String id, BusDto dto) {
        Bus bus = getBusById(id);

        if (dto.getDepartureTime() != null) {
            bus.setDepartureTime(LocalDateTime.parse(dto.getDepartureTime(), DATETIME_FORMATTER));
            bus.setTimeType();
        }
        if (dto.getArrivalTime() != null) {
            bus.setArrivalTime(LocalDateTime.parse(dto.getArrivalTime(), DATETIME_FORMATTER));
        }
        if (dto.getDepartureLocation() != null) bus.setDepartureLocation(dto.getDepartureLocation());
        if (dto.getArrivalLocation() != null) bus.setArrivalLocation(dto.getArrivalLocation());
        if (dto.getFare() != null) bus.setFare(dto.getFare());
        if (dto.getBoardingPoints() != null) bus.setBoardingPoints(dto.getBoardingPoints());
        if (dto.getDroppingPoints() != null) bus.setDroppingPoints(dto.getDroppingPoints());
        if (dto.getBusType() != null) bus.setBusType(dto.getBusType());
        if (dto.getStatus() != null) bus.setStatus(dto.getStatus());

        return busRepository.save(bus);
    }

    public void deleteBus(String id) {
        busRepository.deleteById(id);
    }
}
