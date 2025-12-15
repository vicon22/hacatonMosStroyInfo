package com.mosstroyinfo.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;

@Entity
@Table(name = "blueprints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
public class Blueprint {
    @Id
    @UuidGenerator
    UUID id;

    @Column(nullable = false)
    String title;

    @Column(name = "image_url", nullable = false)
    String imageUrl;

    @Column(nullable = false)
    Long price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Material material;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Seriality seriality;

    @Column(nullable = false)
    Integer floors;

    @Column(nullable = false)
    Integer rooms;

    @Column(nullable = false)
    Integer bedrooms;

    @Column(nullable = false)
    Integer bathrooms;

    @Column(nullable = false)
    Integer area;

    public enum Material {
        timber, aeratedConcrete, reinforcedConcrete, bricks
    }

    public enum Seriality {
        individual, serial
    }
}

