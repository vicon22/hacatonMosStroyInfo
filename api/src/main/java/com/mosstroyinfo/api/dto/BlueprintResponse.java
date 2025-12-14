package com.mosstroyinfo.api.dto;

import java.util.UUID;

public record BlueprintResponse (
    UUID id,
    String title,
    String image_url,
    Long price,
    String material,
    String seriality,
    Integer floors,
    Integer rooms,
    Integer bedrooms,
    Integer bathrooms,
    Integer area
) {}

