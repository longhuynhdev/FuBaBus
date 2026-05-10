package org.example.mdmprojectserver.mongodb.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class Seat implements Serializable {
    public String seatNumber;
    public Boolean isBooked;
    public String customerId;

    public Seat(String seatNumber) {
        this.seatNumber = seatNumber;
        this.isBooked = false;
    }
}
