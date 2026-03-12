package com.wandrr.modules.gallery;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GalleryRepository extends JpaRepository<GalleryPhoto, UUID> {
    Page<GalleryPhoto> findByTripId(UUID tripId, Pageable pageable);

    Page<GalleryPhoto> findByIsFeaturedTrue(Pageable pageable);

    // Personal gallery — only the uploader sees these
    List<GalleryPhoto> findByUploadedByIdAndIsPersonalTrueOrderByCreatedAtDesc(UUID userId);

    // Trip gallery — shared photos (not personal)
    List<GalleryPhoto> findByTripIdAndIsPersonalFalseOrderByCreatedAtDesc(UUID tripId);
}
