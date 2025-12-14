package com.mosstroyinfo.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;


public record CreateProjectRequest(
        @NotNull(message = "Blueprint ID is required")
        @JsonProperty("blueprint_id")
        UUID blueprintId,

        @NotBlank(message = "Title is required")
        String title
) {
}

