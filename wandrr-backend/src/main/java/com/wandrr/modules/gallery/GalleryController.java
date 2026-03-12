package com.wandrr.modules.gallery;

import com.wandrr.exception.ResourceNotFoundException;
import com.wandrr.exception.UnauthorizedException;
import com.wandrr.modules.gallery.dto.GalleryPhotoDTO;
import com.wandrr.modules.trips.TripMemberRepository;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserRepository;
import com.wandrr.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryRepository galleryRepository;
    private final UserRepository userRepository;
    private final TripMemberRepository tripMemberRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GalleryPhotoDTO>>> getPhotos(
            @RequestParam(required = false) UUID tripId,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "6") int limit,
            @AuthenticationPrincipal UserDetails principal) {

        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        PageRequest pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        Page<GalleryPhoto> photos;

        if (tripId != null) {
            // VERIFY MEMBERSHIP
            if (!tripMemberRepository.existsByTripIdAndUserId(tripId, user.getId())) {
                throw new UnauthorizedException("You are not a member of this trip.");
            }
            photos = galleryRepository.findByTripId(tripId, pageable);
        } else if (Boolean.TRUE.equals(featured)) {
            // For landing page or global featured (if still allowed)
            photos = galleryRepository.findByIsFeaturedTrue(pageable);
        } else {
            // Deny global unfiltered gallery reads for security
            throw new UnauthorizedException("Cannot fetch global gallery without a trip context.");
        }

        List<GalleryPhotoDTO> dtos = photos.getContent().stream()
                .map(GalleryPhotoDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.success("Gallery photos retrieved.", dtos));
    }

    // Personal gallery — only the logged-in user's photos
    @GetMapping("/personal")
    public ResponseEntity<ApiResponse<List<GalleryPhotoDTO>>> getPersonalGallery(
            @AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        List<GalleryPhotoDTO> photos = galleryRepository
                .findByUploadedByIdAndIsPersonalTrueOrderByCreatedAtDesc(user.getId())
                .stream().map(GalleryPhotoDTO::from).toList();

        return ResponseEntity.ok(ApiResponse.success("Personal gallery.", photos));
    }

    // Upload photos — supports both personal and trip galleries
    @PostMapping
    public ResponseEntity<ApiResponse<List<GalleryPhotoDTO>>> uploadPhotos(
            @RequestParam(required = false) UUID tripId,
            @RequestParam(defaultValue = "false") boolean isPersonal,
            @RequestParam(required = false) String caption,
            @RequestParam("images") List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails principal) {

        User uploader = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        // If uploading to a trip gallery, verify membership
        com.wandrr.modules.trips.Trip trip = null;
        if (tripId != null && !isPersonal) {
            if (!tripMemberRepository.existsByTripIdAndUserId(tripId, uploader.getId())) {
                throw new UnauthorizedException("You are not a member of this trip.");
            }
            trip = tripMemberRepository.findByTripIdAndUserId(tripId, uploader.getId())
                    .orElseThrow().getTrip();
        }

        List<GalleryPhotoDTO> uploaded = new ArrayList<>();

        for (MultipartFile image : images) {
            try {
                // Store as base64 data URL (no Cloudinary in dev)
                String contentType = image.getContentType() != null ? image.getContentType() : "image/jpeg";
                String base64 = Base64.getEncoder().encodeToString(image.getBytes());
                String dataUrl = "data:" + contentType + ";base64," + base64;

                GalleryPhoto photo = GalleryPhoto.builder()
                        .trip(trip)
                        .uploadedBy(uploader)
                        .imageUrl(dataUrl)
                        .cloudinaryId("local-" + UUID.randomUUID())
                        .caption(caption)
                        .isPersonal(isPersonal)
                        .build();

                photo = galleryRepository.save(photo);
                uploaded.add(GalleryPhotoDTO.from(photo));
            } catch (IOException e) {
                // Skip failed uploads
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Photos uploaded!", uploaded));
    }
}
