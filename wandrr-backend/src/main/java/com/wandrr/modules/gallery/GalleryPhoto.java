package com.wandrr.modules.gallery;

import com.wandrr.modules.trips.Trip;
import com.wandrr.modules.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "gallery_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GalleryPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "cloudinary_id")
    private String cloudinaryId;

    @Column(columnDefinition = "TEXT")
    private String caption;

    @Column(name = "is_featured")
    @Builder.Default
    private boolean isFeatured = false;

    @Column(name = "is_personal", nullable = false)
    @Builder.Default
    private boolean isPersonal = false;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
