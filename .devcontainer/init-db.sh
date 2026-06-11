#!/usr/bin/env bash
# Runs ONCE, the first time the Oracle XE container is created.
# It grants the extra privileges the schema needs, then loads your
# schema + seed data as the application user (his_user).
set -uo pipefail

echo "==> Granting extra privileges to ${APP_USER}..."
sqlplus -s "system/${ORACLE_PASSWORD}@localhost:1521/XEPDB1" <<SQL
WHENEVER SQLERROR CONTINUE
GRANT CREATE VIEW       TO ${APP_USER};
GRANT CREATE SEQUENCE   TO ${APP_USER};
GRANT CREATE TRIGGER    TO ${APP_USER};
GRANT CREATE PROCEDURE  TO ${APP_USER};
GRANT UNLIMITED TABLESPACE TO ${APP_USER};
EXIT;
SQL

echo "==> Loading schema and seed data as ${APP_USER}..."
sqlplus -s "${APP_USER}/${APP_USER_PASSWORD}@localhost:1521/XEPDB1" <<SQL
WHENEVER SQLERROR CONTINUE
SET DEFINE OFF
@/scripts/01_create.sql
@/scripts/02_insert1.sql
@/scripts/03_insert2.sql
COMMIT;
EXIT;
SQL

echo "==> Database initialization complete."
