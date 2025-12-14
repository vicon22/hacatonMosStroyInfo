package com.mosstroyinfo.api.dto;

import com.mosstroyinfo.api.model.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    private Document.DocumentStatus status;
}
