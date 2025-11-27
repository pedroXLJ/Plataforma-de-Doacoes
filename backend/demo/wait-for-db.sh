#!/bin/sh
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}

echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  echo "MySQL not reachable yet - sleeping 1s"
  sleep 1
done

echo "MySQL is reachable, starting application..."
exec java -jar /app/app.jar
