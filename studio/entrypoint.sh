#!/bin/sh
set -e

export VERSION=$(node -p "require('./package.json').version")

# Run DB migrations
if [ "$1" = "start" ]; then
  npm run migrations:run
  npm start

elif [ "$1" = "db-reset" ]; then
  npm run migrations:drop-schema
  npm run migrations:run
    
elif [ "$1" = "db-migrate" ]; then
  npm run migrations:run

elif [ "$1" = "version" ] || [ "$1" = "--version" ] || [ "$1" = "-v" ]; then
  echo $VERSION

elif [ -z "$1" ] || [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "
MetaCity Studio v$VERSION

Usage:

  $ $0 [start|db-reset|db-migrate|version|help]
  
or
  
  $ docker compose run studio [start|db-reset|db-migrate|version|help]
"
else
  exec "$@"
fi