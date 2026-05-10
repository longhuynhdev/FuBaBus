package org.example.mdmprojectserver.mongodb.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class TicketDto {
    public String busId;
    public String customerId;
    public List<String> seats;
    public Double totalFare;
    public String boardingPoint;
    public String droppingPoint;

    @NotEmpty(message = "Name is required for booking")
    public String name;

    @Pattern(regexp = "^(0|\\+84)\\d{9}$", message = "Invalid phone number")
    public String phone;

    public String email;
}
