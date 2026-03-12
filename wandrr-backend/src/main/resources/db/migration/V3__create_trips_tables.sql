CREATE TYPE trip_status AS ENUM ('PLANNING', 'CONFIRMED', 'COMPLETED');
CREATE TYPE member_role AS ENUM ('ADMIN', 'MEMBER');

CREATE TABLE trips (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(150) NOT NULL,
    description  TEXT,
    banner_url   TEXT,
    created_by   UUID         NOT NULL REFERENCES users(id),
    status       trip_status  NOT NULL DEFAULT 'PLANNING',
    start_date   DATE,
    end_date     DATE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE trip_members (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id    UUID        NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role       member_role NOT NULL DEFAULT 'MEMBER',
    joined_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_trip_member UNIQUE (trip_id, user_id)
);

CREATE INDEX idx_trip_members_trip_id   ON trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id   ON trip_members(user_id);
CREATE INDEX idx_trips_created_by       ON trips(created_by);
