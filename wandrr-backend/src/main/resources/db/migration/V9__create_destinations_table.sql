CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    photo_url VARCHAR(1000),
    category VARCHAR(50),
    best_time VARCHAR(100),
    avg_cost_per_day INTEGER,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    tagline VARCHAR(300),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
