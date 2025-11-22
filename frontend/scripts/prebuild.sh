#!/bin/sh
# Pre-build script for Vercel
# Sets DATABASE_URL placeholder if not set (for Prisma generate)

if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
  echo "⚠️ DATABASE_URL not set, using placeholder for Prisma generate"
else
  echo "✅ DATABASE_URL is set"
fi

# Run Prisma generate
npx prisma generate --schema=./prisma/schema.prisma

