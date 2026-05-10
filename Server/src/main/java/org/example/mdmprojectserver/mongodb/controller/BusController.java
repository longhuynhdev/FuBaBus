package org.example.mdmprojectserver.mongodb.controller;

import org.example.mdmprojectserver.mongodb.dto.BusDto;
import org.example.mdmprojectserver.mongodb.model.Bus;
import org.example.mdmprojectserver.mongodb.enums.BusType;
import org.example.mdmprojectserver.mongodb.enums.SortType;
import org.example.mdmprojectserver.mongodb.enums.TimeType;
import org.example.mdmprojectserver.mongodb.service.BusService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/buses")
@RestController
public class BusController {
    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping
    public Page<Bus> getBuses(@PageableDefault(size = 20) Pageable pageable) {
        return busService.getAllBuses(pageable);
    }

    @GetMapping("/{id}")
    public Bus getBus(@PathVariable String id) {
        return busService.getBusById(id);
    }

    @GetMapping("/search")
    public List<Bus> searchBuses(@RequestParam String departureLocation, @RequestParam String arrivalLocation,
                                 @RequestParam String departureTime,
                                 @RequestParam(required = false) SortType sortByFare,
                                 @RequestParam(required = false) SortType sortByDepartureTime,
                                 @RequestParam(required = false) BusType busType,
                                 @RequestParam(required = false) TimeType timeType) {
        return busService.searchBuses(departureLocation, arrivalLocation, departureTime,
                sortByFare, sortByDepartureTime, busType, timeType);
    }

    @PostMapping
    public ResponseEntity<Bus> newBus(@RequestBody BusDto newBusDto) {
        return ResponseEntity.ok(busService.createBus(newBusDto));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Bus>> newBuses(@RequestBody List<BusDto> newBusDtos) {
        List<Bus> saved = newBusDtos.stream().map(busService::createBus).toList();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bus> updateBus(@PathVariable String id, @RequestBody BusDto busDto) {
        return ResponseEntity.ok(busService.updateBus(id, busDto));
    }

    @DeleteMapping("/{id}")
    public void deleteBus(@PathVariable String id) {
        busService.deleteBus(id);
    }
}
