// a file within it and make all interactions with the database go through this file
//per node-postgres guides https://node-postgres.com/guides/project-structure
const { Pool } = require('pg');

// setting node-Postgres SQL to vagrant VM database: default port 5432 is overridden in server.js
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params)
      .then(res => {
        return res.rows;
      })
      .catch(err => {
        return Promise.reject(null);
      });
  },
  userQuery: (text, params) => {
    return pool.query(text, params)
      .then(res => {
       return res.rows[0] === undefined ? null : res.rows[0];
      })
     .catch(err => {
        return Promise.reject(null);
      });
  },
};