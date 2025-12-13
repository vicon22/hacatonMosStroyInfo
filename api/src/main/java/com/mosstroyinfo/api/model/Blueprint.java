package com.mosstroyinfo.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "blueprints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blueprint {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Long price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Material material;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Seriality seriality;

    @Column(nullable = false)
    private Integer floors;

    @Column(nullable = false)
    private Integer rooms;

    @Column(nullable = false)
    private Integer bedrooms;

    @Column(nullable = false)
    private Integer bathrooms;

    @Column(nullable = false)
    private Integer area;

    public enum Material {
        timber, aeratedConcrete, reinforcedConcrete, bricks
    }

    public enum Seriality {
        individual, serial
    }
}

