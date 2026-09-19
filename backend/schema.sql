-- Optional PostgreSQL schema for GeoNexus
CREATE TABLE land_records (
    id BIGSERIAL PRIMARY KEY,
    owner_name VARCHAR(150) NOT NULL,
    khata_number VARCHAR(50) NOT NULL,
    plot_number VARCHAR(50) NOT NULL,
    area VARCHAR(100) NOT NULL,
    village VARCHAR(150) NOT NULL,
    district VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Needs Review',
    owner_confidence INTEGER,
    khata_confidence INTEGER,
    plot_confidence INTEGER,
    area_confidence INTEGER,
    village_confidence INTEGER,
    district_confidence INTEGER,
    state_confidence INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
