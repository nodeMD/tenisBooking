#!/bin/bash

DATE="2025-06-07"

TIME_RANGE="18:00-19:30"

echo "Checking availability for date: $DATE"
echo "Time range: $TIME_RANGE"
echo "------------------------------"

node index.js park-tennis-academy "$DATE" "$TIME_RANGE"
node index.js mera "$DATE" "$TIME_RANGE"
