package org.example.mdmprojectserver.mongodb.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "tickets")
public class Ticket implements Serializable {
    @Id
    public String id;
    @Indexed
    public String busId;
    @Indexed
    public String customerId;
    public List<String> seats;
    public Double totalFare;
    public String boardingPoint;
    public String droppingPoint;
    public Ticket() {
    }

    public Ticket(String busId, String customerId, List<String> seats, Double totalFare, String boardingPoint, String droppingPoint) {
        this.id = UUID.randomUUID().toString();
        this.busId = busId;
        this.customerId = customerId;
        this.seats = seats;
        this.totalFare = totalFare;
        this.boardingPoint = boardingPoint;
        this.droppingPoint = droppingPoint;
    }


}
