package com.mosstroyinfo.api.dto;

import com.mosstroyinfo.api.model.Document;

public record StatusUpdateRequest (
    Document.DocumentStatus status
) {}
