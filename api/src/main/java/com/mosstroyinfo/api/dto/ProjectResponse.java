package com.mosstroyinfo.api.dto;

import java.util.List;
import java.util.UUID;

public record ProjectResponse (
    UUID id,
    String title,
    String status,
    UUID blueprint_id,
    List<String> documents,
    List<String> stream_urls
) { }

