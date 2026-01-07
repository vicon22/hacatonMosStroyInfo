package com.mosstroyinfo.api.dto;

import com.mosstroyinfo.api.model.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ChangeProjectStateRequest {
    @NotBlank(message = "State is required")
    private Project.ProjectStatus status;
}

