#!/usr/bin/env bash
#
# description: Loads all *.json fixtures of db/fixtures
#              into the project's database.
# author:      Matthias Bräuer
#=======================================================================================

db=${MONGO_DB:-"meteor"}
host=${MONGO_HOST:-"localhost:3001"}
user=${MONGO_USER}
password=${MONGO_PW}
path="import/fixtures"

# Forces shell to exit as soon as one command fails.
set -e

# Loads all *.json files of db/fixtures into mongodb.
# Notice: The filename is used as collection name.
function load_fixtures() {
   cd ${path}
   ls -1 *.json | sed 's/.json$//' | while read col; do
      printf "\nImporting ${col}.json...\n"

      if [[ -z "$user" ]]; then
        mongoimport -h ${host} --db ${db} --collection ${col} --type json --file ${col}.json --jsonArray
      else
        mongoimport -h ${host} --db ${db} --collection ${col} -u ${user} -p ${password} --type json --file ${col}.json --jsonArray
      fi
   done
}

# Purges the whole database.
function purge_database() {
    printf "Purging database...\n"
    if [[ -z "$user" ]]; then
      mongo ${host}/${db} --eval "db.dropDatabase();"
    else
      mongo ${host}/${db} -u ${user} -p ${password} --eval "db.dropDatabase();"
    fi
    printf "Database purged\n"
}


if [[ -z "$IS_SERVER" ]]; then
 printf "Load fixtures...\nThis will purge the whole database.\nWould you like to continue (Y/n)?\n"

 read confirmed
else
 confirmed="Y"
fi

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
