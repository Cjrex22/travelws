package com.wandrr.modules.packages;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "trip_packages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String destination;

    private String country;

    @Column(name = "duration_days", nullable = false)
    private int durationDays;

    @Column(name = "price_per_person", nullable = false)
    private int pricePerPerson;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "photo_url", length = 1000)
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String highlights;

    @Column(columnDefinition = "TEXT")
    private String inclusions;

    @Column(columnDefinition = "TEXT")
    private String exclusions;

    @Column(name = "itinerary_json", columnDefinition = "TEXT")
    private String itineraryJson;

    @Column(name = "photos_json", columnDefinition = "TEXT")
    private String photosJson;

    @Column(precision = 3, scale = 1)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @Column(name = "review_count")
    @Builder.Default
    private int reviewCount = 0;

    private String category;

    @Column(name = "is_featured")
    @Builder.Default
    private boolean isFeatured = false;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
