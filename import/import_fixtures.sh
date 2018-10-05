#!/usr/bin/env bash
#
# description: Loads all *.json fixtures of db/fixtures
#              into the project's database.
# author:      Matthias Bräuer
#=======================================================================================

db="meteor"
host="localhost:3001"
path="import/fixtures"

# Forces shell to exit as soon as one command fails.
set -e

# Loads all *.json files of db/fixtures into mongodb.
# Notice: The filename is used as collection name.
function load_fixtures() {
   cd ${path}
   ls -1 *.json | sed 's/.json$//' | while read col; do
      printf "\nImporting ${col}.json...\n"
      mongoimport -h ${host} --db ${db} --collection ${col} --type json --file ${col}.json --jsonArray
   done
}

# Purges the whole database.
function purge_database() {
    printf "Purging database...\n"
    mongo ${host}/${db} --eval "db.dropDatabase();"
    printf "Database purged\n"
}

printf "Load fixtures...\nThis will purge the whole database.\nWould you like to continue (Y/n)?\n"

read confirmed

if [ ${confirmed} == "Y" ];
then
  purge_database
  load_fixtures

  printf "Fixtures loaded"
  exit 0
else
  printf "Aborted loading fixtures."
  exit 0
fi
