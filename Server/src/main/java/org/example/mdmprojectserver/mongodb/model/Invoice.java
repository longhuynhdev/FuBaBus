package org.example.mdmprojectserver.mongodb.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "invoices")
public class Invoice {
    @Id
    private String invoiceID;

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
    private String boardingPoint;

    public Invoice() {
        // Generate random invoice ID
        this.invoiceID = generateRandomInvoiceID();
    }

    public Invoice(String name, String phone, String email, double price, String paymentMethod, String status, String buses, String time, String seats, String boardingPoint) {
        this.invoiceID = generateRandomInvoiceID();
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.price = price;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.buses = buses;
        this.time = time;
        this.seats = seats;
        this.boardingPoint = boardingPoint;
    }

    private String generateRandomInvoiceID() {
        // Generate a random invoice ID with 10 characters
        StringBuilder sb = new StringBuilder();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (int i = 0; i < 10; i++) {
            int index = (int) (Math.random() * characters.length());
            sb.append(characters.charAt(index));
        }
        return sb.toString();
    }

    public void setPhone(String phone) {
        // Validation logic for phone number
        String regex = "^(0|\\+84)\\d{9}$";
        if (!phone.matches(regex)) {
            throw new IllegalArgumentException("Invalid phone number, phone number must start with 0 or +84, followed by exactly 9 digits");
        }
        this.phone = phone;
    }
}