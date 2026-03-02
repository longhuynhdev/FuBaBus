package org.example.mdmprojectserver.mongodb.dto;
import lombok.Data;
import org.example.mdmprojectserver.mongodb.enums.BusType;

import java.util.List;

@Data
public class TicketDto {
    public String busId;
    public String customerId;
    public List<String> seats;
    public Double totalFare;
    public String boardingPoint;
    public String droppingPoint;
}
