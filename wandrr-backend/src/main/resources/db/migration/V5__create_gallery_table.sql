CREATE TABLE gallery_photos (
    id             UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id        UUID      REFERENCES trips(id) ON DELETE SET NULL,
    uploaded_by    UUID      NOT NULL REFERENCES users(id),
    image_url      TEXT      NOT NULL,
    cloudinary_id  TEXT      NOT NULL,
    caption        TEXT,
    is_featured    BOOLEAN   NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gallery_trip_id     ON gallery_photos(trip_id);
CREATE INDEX idx_gallery_featured    ON gallery_photos(is_featured);
