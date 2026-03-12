package com.wandrr.modules.gallery.dto;

import com.wandrr.modules.gallery.GalleryPhoto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GalleryPhotoDTO {
    private UUID id;
    private String imageUrl;
    private String caption;
    private UUID tripId;
    private boolean featured;
    private String createdAt;

    public static GalleryPhotoDTO from(GalleryPhoto photo) {
        return GalleryPhotoDTO.builder()
                .id(photo.getId())
                .imageUrl(photo.getImageUrl())
                .caption(photo.getCaption())
                .tripId(photo.getTrip() != null ? photo.getTrip().getId() : null)
                .featured(photo.isFeatured())
                .createdAt(photo.getCreatedAt() != null ? photo.getCreatedAt().toString() : null)
                .build();
    }
}
