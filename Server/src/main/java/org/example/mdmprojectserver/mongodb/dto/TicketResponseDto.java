package org.example.mdmprojectserver.mongodb.dto;
import lombok.Data;
import org.example.mdmprojectserver.mongodb.enums.BusType;
import java.util.List;

@Data
public class TicketResponseDto {
    public String busId;
    public String customerId;
    // Bus details
    public String departureTime;
    public String departureLocation;
    public String arrivalTime;
    public String arrivalLocation;
    public String boardingPoint;
    public String droppingPoint;
    public BusType busType;
    public Double totalFare;
    public List<String> seats;
    public Double fare;
    // Customer details
    private String name;
    private String email;
    private String phone;

    public void calculateFare() {
        if (totalFare != null && seats != null && !seats.isEmpty()) {
            fare = totalFare / seats.size();
        }
    }
}

