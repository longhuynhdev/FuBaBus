package org.example.mdmprojectserver.mongodb.dto;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterDto {
    private String name;
    @Pattern(regexp = "^(0|\\+84)\\d{9}$", message = "Invalid phone number, phone number must start with 0 or +84, followed by exactly 9 digits")
    private String phone;
    private String password;
    private String email;

}
