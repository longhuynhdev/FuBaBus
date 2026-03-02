package org.example.mdmprojectserver.mongodb.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.example.mdmprojectserver.mongodb.enums.Gender;

@Data
public class CustomerDto {
    @NotEmpty(message = "Name must not be empty")
    private String name;
    private Gender gender;
    @Email(message = "Email should be valid")
    private String email;
    @Pattern(regexp = "^(0|\\+84)\\d{9}$", message = "Invalid phone number, phone number must start with 0 or +84, followed by exactly 9 digits")
    private String phone;
    public String address;
    public String job;
}