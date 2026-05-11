# SQL

This folder contains the SQL assets for the **Secure Serverless Incident Portal** project.

## Purpose

The SQL files in this folder define:

- relational schema
- reference data
- indexes
- future migrations or sample data

---

## Current files

### `001_init_schema.sql`
Creates the database schema:
- incidents
- evidence
- audit
- comments
- reference tables

### `002_seed_reference_data.sql`
Seeds:
- status values
- severity values
- report type values
- category values

### `003_indexes.sql`
Creates indexes to support:
- filtering
- lookup by public ID
- audit retrieval
- evidence/comment lookups

---

## Planned future additions

Possible future files:

004_sample_data.sql
005_views.sql
006_constraints_and_checks.sql