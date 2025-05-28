## To create test data:

### Requrements:

- mysqlclient
- mongodb-atlas-cli

###

1. MariaDB dump
   `mysqldump -h HOST -P PORT -u USER -pPASSWORD --column-statistics=0 DATABASE > FILE`
   `mysqldump -h 127.0.0.1 -P 3306 -u root -proot1234 --column-statistics=0 collaboard > test/data/test.sql`

2. MongoDB dump
   Via MongoDB Compas GUI

## Run tests

1. Run test db

`docker compose --file docker-compose.test.yml up -d`

4. Run the app

5. Merge the merge requests and verify the results
