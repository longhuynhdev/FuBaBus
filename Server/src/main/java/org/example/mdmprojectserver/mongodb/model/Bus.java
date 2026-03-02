package org.example.mdmprojectserver.mongodb.model;

import lombok.Data;
import org.example.mdmprojectserver.mongodb.enums.BusType;
import org.example.mdmprojectserver.mongodb.enums.Status;
import org.example.mdmprojectserver.mongodb.enums.TimeType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "buses")
public class Bus implements Serializable {
    @Id
    public String id;
    public LocalDateTime departureTime;
    public String departureLocation;
    public TimeType timeType;
    public LocalDateTime arrivalTime;
    public String arrivalLocation;
    public Double fare;
    public List<String> boardingPoints;
    public List<String> droppingPoints;
    public BusType busType;
    public Status status;
    public List<Seat> seats = new ArrayList<>();

    public Bus(LocalDateTime departureTime, String departureLocation,
               LocalDateTime arrivalTime, String arrivalLocation, Double fare,
               List<String> boardingPoints, List<String> droppingPoints, BusType busType) {
        this.departureTime = departureTime;
        setTimeType();
        this.departureLocation = departureLocation;
        this.arrivalTime = arrivalTime;
        this.arrivalLocation = arrivalLocation;
        this.fare = fare;
        this.boardingPoints = boardingPoints;
        this.droppingPoints = droppingPoints;
        this.busType = busType;
        this.status = Status.STILL_AVAILABLE;
        // Create 21 new seats and add them to the bus
        for(int i = 1; i <= 21; i++) {
            this.seats.add(new Seat("A" + i));
        }
    }

    public void setTimeType() {
        int hour = this.departureTime.getHour();
        if (hour < 6) {
            this.timeType = TimeType.EARLY_MORNING;
        } else if (hour < 12) {
            this.timeType = TimeType.MORNING;
        } else if (hour < 18) {
            this.timeType = TimeType.AFTERNOON;
        } else {
            this.timeType = TimeType.NIGHT;
        }
    }
}
