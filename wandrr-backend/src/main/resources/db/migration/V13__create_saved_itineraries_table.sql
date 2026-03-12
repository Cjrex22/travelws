CREATE TABLE IF NOT EXISTS saved_itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(200) NOT NULL,
    num_days INTEGER NOT NULL,
    travel_style VARCHAR(50),
    budget VARCHAR(20),
    itinerary_json TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
