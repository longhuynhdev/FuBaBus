package org.example.mdmprojectserver.mongodb.dto;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginDto {
    @Pattern(regexp = "^(\\+84|0)\\d{9}$", message = "Invalid phone number format")
    private String phone;
    private String password;
}
