#!/bin/bash
set -e

# Replace scram-sha-256 with trust in pg_hba.conf for easier development
sed -i 's/scram-sha-256/trust/g' "$PGDATA/pg_hba.conf"

# Reload PostgreSQL configuration
pg_ctl reload -D "$PGDATA"
