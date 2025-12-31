package com.mosstroyinfo.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateProjectRequest {
    @NotNull(message = "Blueprint ID is required")
    private String blueprint_id;

    @NotBlank(message = "Title is required")
    private String title;
}

