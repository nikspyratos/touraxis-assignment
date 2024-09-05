#!/bin/sh
set -e

npm install
touch data/database.sqlite

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

node index.js
