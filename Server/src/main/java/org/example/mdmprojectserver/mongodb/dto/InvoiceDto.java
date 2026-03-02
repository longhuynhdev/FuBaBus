package org.example.mdmprojectserver.mongodb.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class InvoiceDto {
    @NotEmpty(message = "Name must not be empty")
    private String name;

    @Pattern(regexp = "^(0|\\+84)\\d{9}$", message = "Invalid phone number, phone number must start with 0 or +84, followed by exactly 9 digits")
    private String phone;

    @Email(message = "Email should be valid")
    private String email;

    private double price;
    private String paymentMethod;
    private String status;
    private String buses;
    private String time;
    private String seats;
    private String licensePlates;
    private String boardingPoint;
}
