-- User buddies relationship table
CREATE TABLE user_buddies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buddy_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, buddy_id)
);

CREATE INDEX idx_user_buddies_user_id ON user_buddies(user_id);
CREATE INDEX idx_user_buddies_buddy_id ON user_buddies(buddy_id);
