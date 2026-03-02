package org.example.mdmprojectserver.mongodb.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String accessToken;
    private String tokenType = "Bearer ";
    private String customerId;
    public AuthResponseDto(String accessToken, String customerId) {
        this.accessToken = accessToken;
        this.customerId = customerId;
    }

}
