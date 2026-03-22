package org.example.mdmprojectserver.mongodb.model;

import lombok.Data;
import org.example.mdmprojectserver.mongodb.enums.BusType;
import org.example.mdmprojectserver.mongodb.enums.Status;
import org.example.mdmprojectserver.mongodb.enums.TimeType;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "buses")
@CompoundIndex(name = "search_idx", def = "{'departureLocation': 1, 'arrivalLocation': 1, 'departureTime': 1}")
public class Bus implements Serializable {
    @Id
    public String id;
    @Version
    public Long version;
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
        int seatCount = switch (busType) {
            case GHẾ -> 45;
            case GIƯỜNG -> 21;
            case LIMOUSINE -> 16;
        };
        for (int i = 1; i <= seatCount; i++) {
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
