CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES trip_packages(id) ON DELETE CASCADE,
    travel_date DATE NOT NULL,
    total_persons INTEGER NOT NULL DEFAULT 1,
    total_cost INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS booking_buddies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    buddy_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'INVITED',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
