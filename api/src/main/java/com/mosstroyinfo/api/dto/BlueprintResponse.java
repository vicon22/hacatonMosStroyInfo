package com.mosstroyinfo.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlueprintResponse {
    private UUID id;
    private String title;
    private String image_url;
    private Long price;
    private String material;
    private String seriality;
    private Integer floors;
    private Integer rooms;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer area;
}

