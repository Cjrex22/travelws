package com.wandrr.modules.itinerary;

import com.wandrr.modules.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "saved_itineraries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedItinerary {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String destination;

    @Column(name = "num_days", nullable = false)
    private int numDays;

    @Column(name = "travel_style")
    private String travelStyle;

    private String budget;

    @Column(name = "itinerary_json", columnDefinition = "TEXT")
    private String itineraryJson;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
