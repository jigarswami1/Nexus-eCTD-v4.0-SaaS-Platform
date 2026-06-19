-- Step 1: eCTD v4.0 PostgreSQL Database Schema
-- Execute this file in your PostgreSQL environment (e.g., pgAdmin or psql)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Applications Table
CREATE TABLE tb_applications (
    app_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_type VARCHAR(50) NOT NULL,
    app_number VARCHAR(100) NOT NULL,
    sponsor_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sequences Table
CREATE TABLE tb_sequences (
    sequence_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fk_app_uuid UUID REFERENCES tb_applications(app_uuid),
    sequence_number VARCHAR(10) NOT NULL,
    submission_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Documents Table (The Physical Files)
CREATE TABLE tb_documents (
    document_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    checksum_md5 VARCHAR(32) NOT NULL,
    storage_uri VARCHAR(500) NOT NULL, -- S3 Bucket Path
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    file_size_bytes INTEGER NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Context of Use Table (The Virtual Tree)
CREATE TABLE tb_context_of_use (
    cou_uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fk_sequence_uuid UUID REFERENCES tb_sequences(sequence_uuid),
    fk_document_uuid UUID REFERENCES tb_documents(document_uuid),
    ctd_section_code VARCHAR(100) NOT NULL, -- e.g., 'm3-2-s-1'
    lifecycle_operator VARCHAR(50) NOT NULL DEFAULT 'Initial',
    target_cou_uuid UUID REFERENCES tb_context_of_use(cou_uuid), -- Used for 'Replace'
    display_title VARCHAR(255) NOT NULL
);

-- 5. Audit Trail (21 CFR Part 11)
CREATE TABLE tb_audit_trail (
    audit_id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_table VARCHAR(100),
    details TEXT
);

-- Insert Demo Data
INSERT INTO tb_applications (app_uuid, app_type, app_number, sponsor_name) 
VALUES ('a1b2c3d4-0000-0000-0000-000000000001', 'NDA', '214332', 'Acme Pharmaceuticals LLC');