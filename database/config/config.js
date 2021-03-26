require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER_DEV,
    "password": process.env.DB_PASS_DEV,
    "database": process.env.DB_NAME_DEV,
    "host": process.env.DB_HOST_DEV,
    "dialect": "postgres",
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL", //desde heroku
    "dialect": "postgres",
    "dialectOptions": {
      "native": true,
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
