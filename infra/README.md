# Infrastructure

This folder contains infrastructure-related assets for the **Secure Serverless Incident Portal** project.

## Purpose

The goal of this folder is to support:

- Azure deployment preparation
- repeatable setup steps
- future infrastructure-as-code work
- environment-specific deployment helpers

---

## Current contents

### `scripts/`
Shell helper scripts used during development and deployment preparation.

Expected examples:
- `az-login-and-setup.sh`
- `deploy-dev.sh`

---

## Planned future contents

### `bicep/`
This folder will later contain Azure Bicep templates for reproducible infrastructure deployment.

Possible future structure:


bicep/
  main.bicep
  modules/
  parameters/