package org.example.mdmprojectserver.mongodb.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer ";
    private String customerId;
    private String role;

    public AuthResponseDto(String accessToken, String refreshToken, String customerId, String role) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.customerId = customerId;
        this.role = role;
    }
}
