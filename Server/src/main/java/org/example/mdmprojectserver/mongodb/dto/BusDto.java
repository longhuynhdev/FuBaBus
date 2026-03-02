package org.example.mdmprojectserver.mongodb.dto;

import lombok.Data;
import org.example.mdmprojectserver.mongodb.enums.BusType;
import org.example.mdmprojectserver.mongodb.enums.Status;

import java.util.List;
    
@Data
public class BusDto {
    public String departureTime;
    public String departureLocation;
    public String arrivalTime;
    public String arrivalLocation;
    public Double fare;
    public List<String> boardingPoints;
    public List<String> droppingPoints;
    public BusType busType;
    public Status status;

}
