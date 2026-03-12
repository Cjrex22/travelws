CREATE TYPE content_section AS ENUM ('MISSION', 'ABOUT_US', 'SOCIAL_LINKS');

CREATE TABLE app_content (
    id           UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    section      content_section UNIQUE NOT NULL,
    content_json JSONB           NOT NULL,
    updated_by   UUID            REFERENCES users(id),
    updated_at   TIMESTAMP       NOT NULL DEFAULT NOW()
);

INSERT INTO app_content (section, content_json) VALUES
('MISSION', '{"heading":"The Wandrr Mission","body":"We believe travel should be about the moments, not the management.","features":[{"icon":"auto_awesome","title":"AI Planning","description":"Smart itineraries tailored to your unique travel style."},{"icon":"splitscreen","title":"Splitter","description":"Effortless expense sharing for stress-free group travel."},{"icon":"photo_library","title":"Memories","description":"A collaborative vault for all your favorite trip photos."}]}'),
('ABOUT_US', '{"heading":"About Wandrr","body":"Wandrr was founded in 2024 by a group of passionate travellers who were tired of juggling spreadsheets, group chats, and photo albums."}'),
('SOCIAL_LINKS', '{"instagram":"https://instagram.com/wandrr","twitter":"https://twitter.com/wandrr","facebook":"https://facebook.com/wandrr"}');
