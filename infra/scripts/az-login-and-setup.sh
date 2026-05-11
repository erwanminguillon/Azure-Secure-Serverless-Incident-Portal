#!/usr/bin/env bash

set -euo pipefail

echo "=============================================="
echo "Azure login and local environment setup helper"
echo "Project: Secure Serverless Incident Portal"
echo "Environment: dev"
echo "Region: francecentral"
echo "=============================================="
echo

# ---- CONFIG ----
SUBSCRIPTION_NAME="${1:-}"
RESOURCE_GROUP="rg-ssip-dev-frc-01"
LOCATION="francecentral"
PROJECT_CODE="ssip"
ENVIRONMENT="dev"

echo "[INFO] Checking Azure CLI installation..."
if ! command -v az >/dev/null 2>&1; then
  echo "[ERROR] Azure CLI is not installed or not available in PATH."
  echo "Install Azure CLI first, then rerun this script."
  exit 1
fi

echo "[INFO] Azure CLI found:"
az version --output table || true
echo

echo "[INFO] Logging into Azure..."
az login >/dev/null

if [[ -n "${SUBSCRIPTION_NAME}" ]]; then
  echo "[INFO] Setting subscription to: ${SUBSCRIPTION_NAME}"
  az account set --subscription "${SUBSCRIPTION_NAME}"
fi

echo "[INFO] Current Azure account:"
az account show --output table
echo

echo "[INFO] Ensuring resource group exists..."
az group create \
  --name "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --tags ProjectCode="${PROJECT_CODE}" Environment="${ENVIRONMENT}" \
  --output table

echo
echo "[SUCCESS] Azure login/setup helper completed."
echo "Resource Group : ${RESOURCE_GROUP}"
echo "Location       : ${LOCATION}"
echo "Environment    : ${ENVIRONMENT}"