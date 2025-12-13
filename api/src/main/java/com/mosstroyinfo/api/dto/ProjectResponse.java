package com.mosstroyinfo.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private UUID id;
    private String title;
    private String status;
    private UUID blueprint_id;
    private List<String> documents;
    private List<String> stream_urls;
}

