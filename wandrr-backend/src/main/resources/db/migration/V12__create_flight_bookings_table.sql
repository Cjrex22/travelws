CREATE TABLE IF NOT EXISTS flight_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flight_data_json TEXT,
    passenger_details_json TEXT,
    pnr VARCHAR(20),
    total_cost INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    departure_date DATE,
    from_city VARCHAR(100),
    to_city VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
