#!/usr/bin/env bash

set -euo pipefail

echo "=============================================="
echo "Development deployment helper"
echo "Project: Secure Serverless Incident Portal"
echo "Environment: dev"
echo "=============================================="
echo

# ---- CONFIG ----
RESOURCE_GROUP="rg-ssip-dev-frc-01"
LOCATION="francecentral"

STATIC_WEB_APP_NAME="swa-ssip-dev-frc-01"
FUNCTION_APP_NAME="func-ssip-dev-frc-01"
STORAGE_ACCOUNT_NAME="stssipdevfrc01"
SQL_SERVER_NAME="sql-ssip-dev-frc-01"
SQL_DATABASE_NAME="sqldb-ssip-dev-frc-01"
APP_INSIGHTS_NAME="appi-ssip-dev-frc-01"

echo "[INFO] This script is currently a guided placeholder."
echo "[INFO] It documents the intended Azure resource names for the dev environment."
echo

echo "Planned resources:"
echo "  Resource Group   : ${RESOURCE_GROUP}"
echo "  Location         : ${LOCATION}"
echo "  Static Web App   : ${STATIC_WEB_APP_NAME}"
echo "  Function App     : ${FUNCTION_APP_NAME}"
echo "  Storage Account  : ${STORAGE_ACCOUNT_NAME}"
echo "  SQL Server       : ${SQL_SERVER_NAME}"
echo "  SQL Database     : ${SQL_DATABASE_NAME}"
echo "  App Insights     : ${APP_INSIGHTS_NAME}"
echo


echo "[DONE] No Azure resources were created by this placeholder script."