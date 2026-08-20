package org.example.mdmprojectserver.mongodb.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RefreshRequestDto {

    @NotEmpty(message = "refreshToken must not be empty")
    private String refreshToken;
}
