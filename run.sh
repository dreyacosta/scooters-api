#!/bin/sh

if [ "$APP_ENV" == "test" ]; then
  npm test
else
  if [ "$APP_ENV" == "development" ]; then
    if [ -n "$APP_POPULATE" ]; then
      npm run populate:scooters -- --longitude $POPULATE_LOCATION_LONG --latitude $POPULATE_LOCATION_LAT --meters $POPULATE_LOCATION_RADIUS --points $POPULATE_POINTS
    else
      npm run start
    fi
  fi
fi
