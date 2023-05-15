CREATE TABLE reservations(
    id SERIAL PRIMARY KEY,
    dateOfReservation DATE NOT NULL,
    timeRange STRING NOT NULL,
    product_id STRING NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username STRING NOT NULL,
    password STRING NOT NULL,
    role STRING NOT NULL
)