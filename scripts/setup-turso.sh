#!/usr/bin/env bash
# Run after: turso auth login
# Usage: ./scripts/setup-turso.sh
set -euo pipefail

export PATH="$HOME/.turso:$PATH"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_NAME="${TURSO_DB_NAME:-ilakk-portfolio}"

cd "$ROOT"

if ! command -v turso >/dev/null 2>&1; then
  echo "Turso CLI not found. Install:"
  echo "  curl -sSfL https://get.tur.so/install.sh | bash"
  echo "  source ~/.zshrc"
  exit 1
fi

if ! turso auth whoami >/dev/null 2>&1; then
  echo "Not logged in. Run: turso auth login"
  exit 1
fi

echo "Logged in as: $(turso auth whoami)"

if ! turso db show "$DB_NAME" >/dev/null 2>&1; then
  echo "Creating database: $DB_NAME"
  turso db create "$DB_NAME"
else
  echo "Database already exists: $DB_NAME"
fi

TURSO_DATABASE_URL="$(turso db show "$DB_NAME" --url)"
TURSO_AUTH_TOKEN="$(turso db tokens create "$DB_NAME")"

echo ""
echo "Applying migrations…"
TURSO_DATABASE_URL="$TURSO_DATABASE_URL" TURSO_AUTH_TOKEN="$TURSO_AUTH_TOKEN" npm run turso:migrate

echo ""
echo "Seeding database…"
TURSO_DATABASE_URL="$TURSO_DATABASE_URL" TURSO_AUTH_TOKEN="$TURSO_AUTH_TOKEN" npm run db:seed

echo ""
echo "=============================================="
echo "Done. Add these to Vercel → Environment Variables"
echo "(Production + Preview):"
echo ""
echo "TURSO_DATABASE_URL=$TURSO_DATABASE_URL"
echo "TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN"
echo ""
echo "Keep DATABASE_URL=file:./prisma/prod.db"
echo "Then Redeploy on Vercel."
echo "=============================================="
