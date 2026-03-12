CREATE TYPE otp_purpose AS ENUM ('PASSWORD_RESET', 'EMAIL_VERIFY');

CREATE TABLE otp_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_hash    TEXT         NOT NULL,
    purpose     otp_purpose  NOT NULL,
    expires_at  TIMESTAMP    NOT NULL,
    used        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_user_id ON otp_tokens(user_id);
