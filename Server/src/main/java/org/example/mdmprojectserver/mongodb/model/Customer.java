package org.example.mdmprojectserver.mongodb.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.example.mdmprojectserver.mongodb.enums.Gender;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "customers")
public class Customer {
    @Id
    public String id;
    @NotEmpty(message = "Name must not be empty")
    public String name;
    public Gender gender = Gender.MALE;
    @Email(message = "Email should be valid")
    public String email;

    @Indexed(unique = true, background = true)
    @Pattern(regexp = "^(0|\\+84)\\d{9}$", message = "Invalid phone number, phone number must start with 0 or +84, followed by exactly 9 digits")
    public String phone;
    public String password;
    public String role;
    public String address;
    public String job;

    public Customer() {
    }

    public void setPhone(String phone) {
        String regex = "^(0|\\+84)\\d{9}$";
        if (!phone.matches(regex)) {
            throw new IllegalArgumentException("Invalid phone number, phone number must start with 0 or +84, followed by exactly 9 digits");
        }
        // Convert +84 format to 0 format
        if (phone.startsWith("+84")) {
            this.phone = "0" + phone.substring(3);
        } else {
            this.phone = phone;
        }
    }

}
