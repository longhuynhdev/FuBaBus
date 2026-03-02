package org.example.mdmprojectserver.mongodb.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.List;

@Data
@Document(collection = "tickets")
public class Ticket implements Serializable {
    @Id
    public String id;
    public String busId;
    public String customerId;
    public List<String> seats;
    public Double totalFare;
    public String boardingPoint;
    public String droppingPoint;
    public Ticket() {
    }

    public Ticket(String busId, String customerId, List<String> seats, Double totalFare, String boardingPoint, String droppingPoint) {
        this.id = generateRandomTicketID();
        this.busId = busId;
        this.customerId = customerId;
        this.seats = seats;
        this.totalFare = totalFare;
        this.boardingPoint = boardingPoint;
        this.droppingPoint = droppingPoint;
    }


    private String generateRandomTicketID() {
        // Generate a random ticket ID with 10 characters
        StringBuilder sb = new StringBuilder();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (int i = 0; i < 10; i++) {
            int index = (int) (Math.random() * characters.length());
            sb.append(characters.charAt(index));
        }
        return sb.toString();
    }
}
