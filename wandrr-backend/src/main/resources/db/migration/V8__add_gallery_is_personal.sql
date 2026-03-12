-- V8: Add is_personal column to gallery_photos for personal vs trip galleries
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS is_personal BOOLEAN NOT NULL DEFAULT FALSE;
-- Make cloudinary_id nullable since we use base64 data URLs in dev
ALTER TABLE gallery_photos ALTER COLUMN cloudinary_id DROP NOT NULL;
