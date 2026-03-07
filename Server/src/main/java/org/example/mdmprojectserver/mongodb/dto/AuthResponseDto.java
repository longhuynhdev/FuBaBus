package org.example.mdmprojectserver.mongodb.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String accessToken;
    private String tokenType = "Bearer ";
    private String customerId;
    private String role;

    public AuthResponseDto(String accessToken, String customerId, String role) {
        this.accessToken = accessToken;
        this.customerId = customerId;
        this.role = role;
    }
}
