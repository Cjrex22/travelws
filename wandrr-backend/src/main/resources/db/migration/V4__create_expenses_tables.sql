CREATE TABLE expenses (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id        UUID           NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title          VARCHAR(150)   NOT NULL,
    description    TEXT,
    total_amount   NUMERIC(10,2)  NOT NULL CHECK (total_amount > 0),
    paid_by        UUID           NOT NULL REFERENCES users(id),
    include_self   BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE expense_splits (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id     UUID           NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    user_id        UUID           NOT NULL REFERENCES users(id),
    split_amount   NUMERIC(10,2)  NOT NULL,
    is_settled     BOOLEAN        NOT NULL DEFAULT FALSE,
    settled_at     TIMESTAMP,
    CONSTRAINT uq_expense_user_split UNIQUE (expense_id, user_id)
);

CREATE INDEX idx_expenses_trip_id        ON expenses(trip_id);
CREATE INDEX idx_expenses_paid_by        ON expenses(paid_by);
CREATE INDEX idx_expense_splits_expense  ON expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user     ON expense_splits(user_id);
